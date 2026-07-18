<script lang="ts">
  // 第6章 鏡面反射デモ。Phong と Blinn-Phong を切り替え、shininess でハイライトの絞りを体感。
  // 教える式をそのまま GLSL に:
  //   Phong        spec = pow(max(0, dot(R, V)), shininess),  R = reflect(-L, N)
  //   Blinn-Phong  spec = pow(max(0, dot(N, H)), shininess),  H = normalize(L + V)
  import * as THREE from 'three';
  import ShaderPreview from '../three/ShaderPreview.svelte';
  import Slider from '../components/Slider.svelte';
  import { CAMERA_POS, lightDirFromAngles } from '../three/pbr';

  let azimuth = $state(40);
  let elevation = $state(35);
  let shininess = $state(32);
  let model = $state<'blinn' | 'phong'>('blinn');
  let mode = $state<'final' | 'specular' | 'diffuse'>('final');
  let geometry = $state<'sphere' | 'box' | 'cylinder'>('sphere');

  const uniforms = {
    uLightDir: { value: new THREE.Vector3(0, 1, 0) },
    uCameraPos: { value: CAMERA_POS.clone() },
    uAlbedo: { value: new THREE.Color('#3f6fb0') },
    uShininess: { value: 32 },
    uBlinn: { value: 1 },
    uMode: { value: 0 },
  };

  const modeIndex = $derived(mode === 'final' ? 0 : mode === 'specular' ? 1 : 2);

  $effect(() => {
    uniforms.uLightDir.value.copy(lightDirFromAngles(azimuth, elevation));
    uniforms.uShininess.value = shininess;
    uniforms.uBlinn.value = model === 'blinn' ? 1 : 0;
    uniforms.uMode.value = modeIndex;
  });

  const fragmentShader = /* glsl */ `
    precision highp float;
    varying vec3 vWorldNormal;
    varying vec3 vWorldPos;
    uniform vec3 uLightDir;
    uniform vec3 uCameraPos;
    uniform vec3 uAlbedo;
    uniform float uShininess;
    uniform float uBlinn;   // 1=Blinn-Phong, 0=Phong
    uniform int uMode;      // 0 final, 1 specular only, 2 diffuse only

    vec3 toSRGB(vec3 c) { return pow(clamp(c, 0.0, 1.0), vec3(1.0 / 2.2)); }

    void main() {
      vec3 N = normalize(vWorldNormal);
      vec3 L = normalize(uLightDir);
      vec3 V = normalize(uCameraPos - vWorldPos);

      float ndl = max(dot(N, L), 0.0);
      vec3 diffuse = uAlbedo * ndl;

      // ハイライト(てかり)
      float specBase;
      if (uBlinn > 0.5) {
        vec3 H = normalize(L + V);
        specBase = max(dot(N, H), 0.0);          // Blinn-Phong
      } else {
        vec3 R = reflect(-L, N);
        specBase = max(dot(R, V), 0.0);          // Phong
      }
      // ライトが裏に回ったらてかりも消す
      float spec = pow(specBase, uShininess) * step(0.0001, ndl);
      vec3 specular = vec3(spec);

      vec3 ambient = uAlbedo * 0.06;

      vec3 color;
      if (uMode == 1)      color = specular;
      else if (uMode == 2) color = diffuse + ambient;
      else                 color = diffuse + specular + ambient;

      gl_FragColor = vec4(toSRGB(color), 1.0);
    }
  `;
</script>

<div class="demo">
  <ShaderPreview {fragmentShader} {uniforms} {geometry} height={340} />

  <div class="controls">
    <div class="seg">
      <span class="seg-label">モデル(反射式)</span>
      <div class="btns">
        <button class:on={model === 'blinn'} onclick={() => (model = 'blinn')}>Blinn-Phong</button>
        <button class:on={model === 'phong'} onclick={() => (model = 'phong')}>Phong</button>
      </div>
    </div>
    <div class="seg">
      <span class="seg-label">表示</span>
      <div class="btns">
        <button class:on={mode === 'final'} onclick={() => (mode = 'final')}>最終結果</button>
        <button class:on={mode === 'specular'} onclick={() => (mode = 'specular')}>てかりのみ</button>
        <button class:on={mode === 'diffuse'} onclick={() => (mode = 'diffuse')}>拡散のみ</button>
      </div>
    </div>
    <div class="seg">
      <span class="seg-label">形</span>
      <div class="btns">
        <button class:on={geometry === 'sphere'} onclick={() => (geometry = 'sphere')}>球</button>
        <button class:on={geometry === 'box'} onclick={() => (geometry = 'box')}>箱</button>
        <button class:on={geometry === 'cylinder'} onclick={() => (geometry = 'cylinder')}>筒</button>
      </div>
    </div>

    <Slider label="ライト方位" bind:value={azimuth} min={-180} max={180} step={1} reset={40} unit="°" accent="var(--accent)" />
    <Slider label="ライト仰角" bind:value={elevation} min={-10} max={90} step={1} reset={35} unit="°" accent="var(--accent)" />
    <Slider label="shininess(てかりの鋭さ)" bind:value={shininess} min={1} max={128} step={1} reset={32} accent="var(--accent-2)" />

    <p class="note">
      <strong>shininess を上げる</strong>ほどハイライトが小さく鋭くなります(第2章の pow の再登場)。
      Blinn と Phong を切り替えると、同じ shininess でもハイライトの大きさが少し違うのがわかります。
    </p>
  </div>
</div>

<style>
  .demo {
    display: grid;
    grid-template-columns: 1.1fr 1fr;
    gap: 1rem;
    align-items: start;
  }
  @media (max-width: 720px) {
    .demo {
      grid-template-columns: 1fr;
    }
  }
  .controls {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
  }
  .seg {
    margin-bottom: 0.3rem;
  }
  .seg-label {
    font-size: 0.8rem;
    color: var(--text-2);
    display: block;
    margin-bottom: 0.3rem;
  }
  .btns {
    display: flex;
    gap: 0.4rem;
    flex-wrap: wrap;
  }
  .btns button {
    background: var(--bg-2);
    color: var(--text-1);
    border: 1px solid var(--border-strong);
    border-radius: 999px;
    padding: 0.3rem 0.8rem;
    font-size: 0.85rem;
    cursor: pointer;
  }
  .btns button.on {
    background: var(--accent-2);
    color: var(--bg-0);
    border-color: var(--accent-2);
    font-weight: 700;
  }
  .note {
    font-size: 0.83rem;
    color: var(--text-2);
    line-height: 1.6;
    margin: 0.4rem 0 0;
  }
</style>
