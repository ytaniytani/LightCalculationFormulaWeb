// 共有 PBR シェーダー。
// 教える式(Cook-Torrance の直接光 + 半球ライトの間接光)をそのまま GLSL で書く。
// 第0章(ゴールの絵)・第7章(メタリック/ラフネス)・第8章(D/F/G 可視化)・
// 第9章(間接光の比較)で再利用する。学ぶ式と表示を完全一致させるのが狙い。
//
// uMode で表示を切り替える:
//   0 = 最終結果 / 1 = 拡散のみ / 2 = 鏡面のみ /
//   3 = D のみ / 4 = F のみ / 5 = G のみ / 6 = 間接光(半球ライト)のみ / 7 = 直接光のみ
// uDEnable/uFEnable/uGEnable(0 or 1)で鏡面の D・F・G を個別に ON/OFF できる。

import * as THREE from 'three';

export const CAMERA_POS = new THREE.Vector3(0, 0, 4.2);

export const pbrFragmentShader = /* glsl */ `
  precision highp float;
  varying vec3 vWorldNormal;
  varying vec3 vWorldPos;

  uniform vec3  uLightDir;
  uniform vec3  uCameraPos;
  uniform vec3  uLightColor;
  uniform float uIntensity;
  uniform vec3  uAlbedo;
  uniform float uMetallic;
  uniform float uRoughness;
  uniform float uReflectance; // 非金属の F0(0.04 が既定)
  uniform vec3  uSkyColor;
  uniform vec3  uGroundColor;
  uniform float uAmbient;     // 間接光(半球ライト)の強さ
  uniform int   uMode;
  uniform float uDEnable;
  uniform float uFEnable;
  uniform float uGEnable;

  const float PI = 3.14159265359;

  // D:法線分布関数(GGX / Trowbridge-Reitz)。ハイライトの形を決める。
  float D_GGX(float NoH, float rough) {
    float a  = rough * rough;
    float a2 = a * a;
    float d  = (NoH * NoH) * (a2 - 1.0) + 1.0;
    return a2 / max(PI * d * d, 1e-7);
  }

  // F:フレネル(Schlick 近似)。浅い角度ほど反射が強い。
  vec3 F_Schlick(float VoH, vec3 f0) {
    float f = pow(1.0 - VoH, 5.0);
    return f0 + (1.0 - f0) * f;
  }

  // G:幾何減衰(Smith + Schlick-GGX)。ざらざら面で微小面同士が遮り合う効果。
  float G_SchlickGGX(float NoX, float k) {
    return NoX / (NoX * (1.0 - k) + k);
  }
  float G_Smith(float NoV, float NoL, float rough) {
    float r = rough + 1.0;
    float k = (r * r) / 8.0;
    return G_SchlickGGX(NoV, k) * G_SchlickGGX(NoL, k);
  }

  vec3 toSRGB(vec3 c) { return pow(clamp(c, 0.0, 1.0), vec3(1.0 / 2.2)); }

  void main() {
    vec3 N = normalize(vWorldNormal);
    vec3 V = normalize(uCameraPos - vWorldPos);
    vec3 L = normalize(uLightDir);
    vec3 H = normalize(V + L);

    float NoL = max(dot(N, L), 0.0);
    float NoV = max(dot(N, V), 1e-4);
    float NoH = max(dot(N, H), 0.0);
    float VoH = max(dot(V, H), 0.0);
    float rough = clamp(uRoughness, 0.04, 1.0);

    // 金属は反射色にアルベドを使い、拡散を持たない。非金属は F0=uReflectance。
    vec3 f0 = mix(vec3(uReflectance), uAlbedo, uMetallic);

    float D = D_GGX(NoH, rough);
    vec3  F = F_Schlick(VoH, f0);
    float G = G_Smith(NoV, NoL, rough);

    // 各項を個別に ON/OFF(OFF のときは中立値=1 にする)
    float Dv = mix(1.0, D, uDEnable);
    vec3  Fv = mix(vec3(1.0), F, uFEnable);
    float Gv = mix(1.0, G, uGEnable);

    vec3 spec = (Dv * Fv * Gv) / (4.0 * NoV * NoL + 1e-3);

    // 拡散:金属は 0、非金属はエネルギー保存で (1-F)。
    vec3 kd = (vec3(1.0) - F) * (1.0 - uMetallic);
    vec3 diffuse = kd * uAlbedo / PI;

    vec3 radiance = uLightColor * uIntensity;
    vec3 direct = (diffuse + spec) * NoL * radiance;

    // 間接光:上=空色、下=地面色 の半球ライト(第9章)
    float up = N.y * 0.5 + 0.5;
    vec3 hemi = mix(uGroundColor, uSkyColor, up);
    vec3 ambient = uAlbedo * hemi * uAmbient;

    vec3 color;
    if      (uMode == 1) color = diffuse * NoL * radiance;                 // 拡散のみ
    else if (uMode == 2) color = spec * NoL * radiance;                    // 鏡面のみ
    else if (uMode == 3) color = vec3(clamp(D * 0.08, 0.0, 1.0));          // D のみ(白黒)
    else if (uMode == 4) color = F;                                        // F のみ
    else if (uMode == 5) color = vec3(G);                                  // G のみ
    else if (uMode == 6) color = ambient;                                  // 間接光のみ
    else if (uMode == 7) color = direct;                                   // 直接光のみ
    else                 color = direct + ambient;                        // 最終結果

    gl_FragColor = vec4(toSRGB(color), 1.0);
  }
`;

export interface PbrUniformOpts {
  albedo?: string;
  metallic?: number;
  roughness?: number;
  intensity?: number;
  ambient?: number;
  reflectance?: number;
  lightColor?: string;
  skyColor?: string;
  groundColor?: string;
}

/** ShaderPreview に渡す uniforms を生成する(参照は固定し、.value を書き換えて使う)。 */
export function makePbrUniforms(opts: PbrUniformOpts = {}) {
  return {
    uLightDir: { value: new THREE.Vector3(0, 1, 0) },
    uCameraPos: { value: CAMERA_POS.clone() },
    uLightColor: { value: new THREE.Color(opts.lightColor ?? '#ffffff') },
    uIntensity: { value: opts.intensity ?? 1 },
    uAlbedo: { value: new THREE.Color(opts.albedo ?? '#c85a3f') },
    uMetallic: { value: opts.metallic ?? 0 },
    uRoughness: { value: opts.roughness ?? 0.4 },
    uReflectance: { value: opts.reflectance ?? 0.04 },
    uSkyColor: { value: new THREE.Color(opts.skyColor ?? '#6fb3ff') },
    uGroundColor: { value: new THREE.Color(opts.groundColor ?? '#3a2f2a') },
    uAmbient: { value: opts.ambient ?? 0.12 },
    uMode: { value: 0 },
    uDEnable: { value: 1 },
    uFEnable: { value: 1 },
    uGEnable: { value: 1 },
  };
}

/** 方位・仰角(度)からライト方向ベクトルを作る。 */
export function lightDirFromAngles(azimuthDeg: number, elevationDeg: number): THREE.Vector3 {
  const az = (azimuthDeg * Math.PI) / 180;
  const el = (elevationDeg * Math.PI) / 180;
  return new THREE.Vector3(
    Math.cos(el) * Math.sin(az),
    Math.sin(el),
    Math.cos(el) * Math.cos(az)
  ).normalize();
}
