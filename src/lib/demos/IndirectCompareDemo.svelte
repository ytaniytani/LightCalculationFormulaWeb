<script lang="ts">
  // 第9章 直接光のみ / 間接光あり の比較デモ。
  // 間接光を足すと、影の中が真っ黒でなくなり、のっぺり感が消えることを体感する。
  import ShaderPreview from '../three/ShaderPreview.svelte';
  import Slider from '../components/Slider.svelte';
  import { pbrFragmentShader, makePbrUniforms, lightDirFromAngles } from '../three/pbr';

  let azimuth = $state(55);
  let elevation = $state(40);
  let ambient = $state(0.18);
  let indirectOn = $state(true);
  let geometry = $state<'sphere' | 'box' | 'cylinder'>('sphere');

  const uniforms = makePbrUniforms({ albedo: '#c05a44', roughness: 0.5, ambient: 0.18 });

  $effect(() => {
    uniforms.uLightDir.value.copy(lightDirFromAngles(azimuth, elevation));
    uniforms.uAmbient.value = indirectOn ? ambient : 0;
  });
</script>

<div class="demo">
  <ShaderPreview fragmentShader={pbrFragmentShader} {uniforms} {geometry} height={340} />

  <div class="controls">
    <label class="big-toggle" class:on={indirectOn}>
      <input type="checkbox" bind:checked={indirectOn} />
      間接光を足す
    </label>

    <div class="seg">
      <span class="seg-label">形</span>
      <div class="btns">
        <button class:on={geometry === 'sphere'} onclick={() => (geometry = 'sphere')}>球</button>
        <button class:on={geometry === 'box'} onclick={() => (geometry = 'box')}>箱</button>
        <button class:on={geometry === 'cylinder'} onclick={() => (geometry = 'cylinder')}>筒</button>
      </div>
    </div>

    <Slider label="間接光の量" bind:value={ambient} min={0} max={0.5} step={0.01} reset={0.18} accent="var(--accent-2)" />
    <Slider label="ライト方位" bind:value={azimuth} min={-180} max={180} step={1} reset={55} unit="°" accent="var(--accent)" />
    <Slider label="ライト仰角" bind:value={elevation} min={-10} max={90} step={1} reset={40} unit="°" accent="var(--accent)" />

    <p class="note">
      チェックを<strong>外す</strong>と、直接光だけの状態。ライトが当たらない影の側が
      <strong>真っ黒</strong>になり、のっぺりします。チェックを<strong>入れる</strong>と、
      周囲から回り込む光(間接光)で影の中がほんのり満たされ、立体感と自然さが戻ります。
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
  .big-toggle {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    background: var(--bg-2);
    border: 1px solid var(--border-strong);
    border-radius: var(--radius-sm);
    padding: 0.6rem 0.9rem;
    font-size: 0.95rem;
    color: var(--text-1);
    cursor: pointer;
    margin-bottom: 0.4rem;
  }
  .big-toggle.on {
    border-color: var(--accent-2);
    color: var(--text-0);
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
