<script lang="ts">
  // 第10章 SH(球面調和関数)デモ。
  // 周囲の光を「少数の係数」で表す直感を作る。
  //   L0 = 全方向の平均の明るさ(=アンビエント)
  //   L1 = どっち側が明るいか、のゆるい傾き(右/上/前)
  // 直感を優先し、基底関数の厳密な定数は使わない(= 平均 + 向きの傾き)。
  import * as THREE from 'three';
  import ShaderPreview from '../three/ShaderPreview.svelte';
  import Slider from '../components/Slider.svelte';

  let l0 = $state(0.5); // 平均の明るさ
  let l1x = $state(0.0); // 右方向の傾き
  let l1y = $state(0.35); // 上方向の傾き(上が明るい)
  let l1z = $state(0.0); // 前方向の傾き
  let tintHex = $state('#ffe9c7');
  let geometry = $state<'sphere' | 'box' | 'cylinder'>('sphere');

  const uniforms = {
    uL0: { value: 0.5 },
    uL1: { value: new THREE.Vector3(0, 0.35, 0) },
    uTint: { value: new THREE.Color('#ffe9c7') },
    uAlbedo: { value: new THREE.Color('#cfcfcf') },
  };

  $effect(() => {
    uniforms.uL0.value = l0;
    uniforms.uL1.value.set(l1x, l1y, l1z);
    uniforms.uTint.value.set(tintHex);
  });

  const fragmentShader = /* glsl */ `
    precision highp float;
    varying vec3 vWorldNormal;
    uniform float uL0;
    uniform vec3 uL1;
    uniform vec3 uTint;
    uniform vec3 uAlbedo;

    vec3 toSRGB(vec3 c) { return pow(clamp(c, 0.0, 1.0), vec3(1.0 / 2.2)); }

    void main() {
      vec3 N = normalize(vWorldNormal);
      // 周囲光を SH で「要約」して評価:平均(L0) + 向きの傾き(L1)
      float irradiance = uL0 + dot(uL1, N);
      irradiance = max(irradiance, 0.0);
      vec3 color = uAlbedo * uTint * irradiance;
      gl_FragColor = vec4(toSRGB(color), 1.0);
    }
  `;
</script>

<div class="demo">
  <ShaderPreview {fragmentShader} {uniforms} {geometry} height={340} />

  <div class="controls">
    <div class="seg">
      <span class="seg-label">形</span>
      <div class="btns">
        <button class:on={geometry === 'sphere'} onclick={() => (geometry = 'sphere')}>球</button>
        <button class:on={geometry === 'box'} onclick={() => (geometry = 'box')}>箱</button>
        <button class:on={geometry === 'cylinder'} onclick={() => (geometry = 'cylinder')}>筒</button>
      </div>
    </div>

    <div class="group-label">L0(全方向の平均 = アンビエント)</div>
    <Slider label="平均の明るさ" bind:value={l0} min={0} max={1} step={0.01} reset={0.5} accent="var(--accent-3)" />

    <div class="group-label">L1(どっち側が明るいか、のゆるい傾き)</div>
    <Slider label="右←→左の傾き" bind:value={l1x} min={-0.6} max={0.6} step={0.01} reset={0} accent="var(--accent-2)" />
    <Slider label="上←→下の傾き" bind:value={l1y} min={-0.6} max={0.6} step={0.01} reset={0.35} accent="var(--accent-2)" />
    <Slider label="前←→奥の傾き" bind:value={l1z} min={-0.6} max={0.6} step={0.01} reset={0} accent="var(--accent-2)" />

    <label class="color">
      <span>周囲光の色み(tint)</span>
      <input type="color" bind:value={tintHex} />
    </label>

    <p class="note">
      たった<strong>4つのツマミ</strong>(平均1個 + 傾き3個)で、球への周囲光の当たり方が変わります。
      L0 だけだとどこも同じ明るさ(=アンビエント)。L1 を足すと「上が明るい」「右が明るい」といった
      <strong>ゆるい方向性</strong>が出ます。これが SH による「周囲光の要約」の正体です。
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
    gap: 0.2rem;
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
  .group-label {
    font-size: 0.8rem;
    color: var(--accent-2);
    margin: 0.5rem 0 0;
    font-weight: 700;
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
  .color {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    font-size: 0.82rem;
    color: var(--text-1);
    margin: 0.5rem 0 0;
  }
  .color input[type='color'] {
    width: 34px;
    height: 26px;
    border: 1px solid var(--border-strong);
    border-radius: 6px;
    background: none;
    cursor: pointer;
    padding: 0;
  }
  .note {
    font-size: 0.83rem;
    color: var(--text-2);
    line-height: 1.6;
    margin: 0.5rem 0 0;
  }
</style>
