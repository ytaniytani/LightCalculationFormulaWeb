<script lang="ts">
  // Lambert 拡散反射の 3D デモ。
  // diffuse = max(0, dot(N, L)) をそのまま GLSL で実装している。
  // ライトの方位・仰角、Half Lambert、環境光(スカイライト)を操作できる。
  import * as THREE from 'three';
  import ShaderPreview from '../three/ShaderPreview.svelte';
  import Slider from '../components/Slider.svelte';

  let azimuth = $state(35); // 方位(度)
  let elevation = $state(35); // 仰角(度)
  let intensity = $state(1.0);
  let halfLambert = $state(false);
  let ambient = $state(0.08);
  let mode = $state<'final' | 'diffuse' | 'ambient'>('final');
  let geometry = $state<'sphere' | 'box' | 'cylinder' | 'plane'>('sphere');

  const albedo = new THREE.Color('#e0664f');
  const skyColor = new THREE.Color('#6fb3ff');
  const groundColor = new THREE.Color('#3a2f2a');

  // ライト方向ベクトル(球座標→デカルト)
  const lightDir = $derived.by(() => {
    const az = (azimuth * Math.PI) / 180;
    const el = (elevation * Math.PI) / 180;
    return new THREE.Vector3(
      Math.cos(el) * Math.sin(az),
      Math.sin(el),
      Math.cos(el) * Math.cos(az)
    ).normalize();
  });

  const modeIndex = $derived(mode === 'final' ? 0 : mode === 'diffuse' ? 1 : 2);

  // 安定した uniforms オブジェクト(参照は固定、.value を書き換える)
  const uniforms = {
    uLightDir: { value: new THREE.Vector3(0, 1, 0) },
    uAlbedo: { value: albedo },
    uIntensity: { value: 1 },
    uHalfLambert: { value: 0 },
    uAmbient: { value: 0.08 },
    uSkyColor: { value: skyColor },
    uGroundColor: { value: groundColor },
    uMode: { value: 0 },
  };

  $effect(() => {
    uniforms.uLightDir.value.copy(lightDir);
    uniforms.uIntensity.value = intensity;
    uniforms.uHalfLambert.value = halfLambert ? 1 : 0;
    uniforms.uAmbient.value = ambient;
    uniforms.uMode.value = modeIndex;
  });

  const fragmentShader = /* glsl */ `
    precision highp float;
    varying vec3 vWorldNormal;
    uniform vec3 uLightDir;
    uniform vec3 uAlbedo;
    uniform float uIntensity;
    uniform float uHalfLambert;
    uniform float uAmbient;
    uniform vec3 uSkyColor;
    uniform vec3 uGroundColor;
    uniform int uMode; // 0 final, 1 diffuse only, 2 ambient only

    // 簡易ガンマ補正(リニア→sRGB 近似)
    vec3 toSRGB(vec3 c) { return pow(clamp(c, 0.0, 1.0), vec3(1.0 / 2.2)); }

    void main() {
      vec3 N = normalize(vWorldNormal);
      vec3 L = normalize(uLightDir);

      // ★ここが Lambert の核: 面の法線とライト方向の内積
      float ndl = dot(N, L);
      float lambert = (uHalfLambert > 0.5)
        ? pow(ndl * 0.5 + 0.5, 2.0)   // Half Lambert
        : max(0.0, ndl);              // 素の Lambert

      vec3 diffuse = uAlbedo * uIntensity * lambert;

      // 環境光:上向き=空色、下向き=地面色 の半球ライト(スカイライト)
      float up = N.y * 0.5 + 0.5;
      vec3 sky = mix(uGroundColor, uSkyColor, up);
      vec3 ambient = uAlbedo * (uAmbient) * sky * 2.0;

      vec3 color;
      if (uMode == 1)      color = diffuse;
      else if (uMode == 2) color = ambient;
      else                 color = diffuse + ambient;

      gl_FragColor = vec4(toSRGB(color), 1.0);
    }
  `;
</script>

<div class="demo">
  <ShaderPreview {fragmentShader} {uniforms} {geometry} height={340} />

  <div class="controls">
    <div class="seg">
      <span class="seg-label">表示</span>
      <div class="btns">
        <button class:on={mode === 'final'} onclick={() => (mode = 'final')}>最終結果</button>
        <button class:on={mode === 'diffuse'} onclick={() => (mode = 'diffuse')}>拡散のみ</button>
        <button class:on={mode === 'ambient'} onclick={() => (mode = 'ambient')}>環境光のみ</button>
      </div>
    </div>
    <div class="seg">
      <span class="seg-label">モデル</span>
      <div class="btns">
        <button class:on={geometry === 'sphere'} onclick={() => (geometry = 'sphere')}>球</button>
        <button class:on={geometry === 'box'} onclick={() => (geometry = 'box')}>箱</button>
        <button class:on={geometry === 'cylinder'} onclick={() => (geometry = 'cylinder')}>筒</button>
        <button class:on={geometry === 'plane'} onclick={() => (geometry = 'plane')}>板</button>
      </div>
    </div>

    <Slider label="ライト方位" bind:value={azimuth} min={-180} max={180} step={1} reset={35} unit="°" accent="var(--accent)" />
    <Slider label="ライト仰角" bind:value={elevation} min={-10} max={90} step={1} reset={35} unit="°" accent="var(--accent)" />
    <Slider label="ライト強度" bind:value={intensity} min={0} max={2} step={0.01} reset={1} accent="var(--accent)" />
    <Slider label="環境光の量" bind:value={ambient} min={0} max={0.4} step={0.01} reset={0.08} accent="var(--accent-2)" />

    <label class="check">
      <input type="checkbox" bind:checked={halfLambert} />
      Half Lambert(影を柔らかくする“絵作りの嘘”)
    </label>
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
    margin-bottom: 0.4rem;
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
  .check {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.88rem;
    color: var(--text-1);
    margin-top: 0.5rem;
    cursor: pointer;
  }
</style>
