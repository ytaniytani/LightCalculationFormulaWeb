<script lang="ts">
  // 第7章 メタリック/ラフネス デモ。共有 PBR シェーダーで、2つのツマミだけで
  // 材質(金属/非金属、つるつる/ざらざら)が作れることを体感する。
  import ShaderPreview from '../three/ShaderPreview.svelte';
  import Slider from '../components/Slider.svelte';
  import { pbrFragmentShader, makePbrUniforms, lightDirFromAngles } from '../three/pbr';

  let azimuth = $state(40);
  let elevation = $state(35);
  let metallic = $state(0.0);
  let roughness = $state(0.3);
  let mode = $state<'final' | 'diffuse' | 'specular'>('final');
  let geometry = $state<'sphere' | 'box' | 'cylinder'>('sphere');

  const presets: { name: string; metallic: number; roughness: number; albedo: string }[] = [
    { name: 'プラスチック', metallic: 0, roughness: 0.35, albedo: '#c83f3f' },
    { name: 'つや消しゴム', metallic: 0, roughness: 0.85, albedo: '#404652' },
    { name: '磨いた金', metallic: 1, roughness: 0.15, albedo: '#e0a94b' },
    { name: 'ざらつく鉄', metallic: 1, roughness: 0.55, albedo: '#b8bcc4' },
  ];

  const uniforms = makePbrUniforms({ albedo: '#c83f3f', ambient: 0.12 });

  const modeIndex = $derived(mode === 'final' ? 0 : mode === 'diffuse' ? 1 : 2);

  $effect(() => {
    uniforms.uLightDir.value.copy(lightDirFromAngles(azimuth, elevation));
    uniforms.uMetallic.value = metallic;
    uniforms.uRoughness.value = roughness;
    uniforms.uMode.value = modeIndex;
  });

  function applyPreset(p: (typeof presets)[number]) {
    metallic = p.metallic;
    roughness = p.roughness;
    uniforms.uAlbedo.value.set(p.albedo);
  }
</script>

<div class="demo">
  <ShaderPreview fragmentShader={pbrFragmentShader} {uniforms} {geometry} height={340} />

  <div class="controls">
    <div class="seg">
      <span class="seg-label">プリセット材質</span>
      <div class="btns">
        {#each presets as p}
          <button onclick={() => applyPreset(p)}>{p.name}</button>
        {/each}
      </div>
    </div>
    <div class="seg">
      <span class="seg-label">表示</span>
      <div class="btns">
        <button class:on={mode === 'final'} onclick={() => (mode = 'final')}>最終結果</button>
        <button class:on={mode === 'diffuse'} onclick={() => (mode = 'diffuse')}>拡散のみ</button>
        <button class:on={mode === 'specular'} onclick={() => (mode = 'specular')}>鏡面のみ</button>
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

    <Slider label="メタリック(金属っぽさ)" bind:value={metallic} min={0} max={1} step={0.01} reset={0} accent="var(--accent-3)" />
    <Slider label="ラフネス(ざらつき)" bind:value={roughness} min={0.04} max={1} step={0.01} reset={0.3} accent="var(--accent-3)" />
    <Slider label="ライト方位" bind:value={azimuth} min={-180} max={180} step={1} reset={40} unit="°" accent="var(--accent)" />
    <Slider label="ライト仰角" bind:value={elevation} min={-10} max={90} step={1} reset={35} unit="°" accent="var(--accent)" />

    <p class="note">
      <strong>メタリック</strong>を上げると、拡散(色みのある明るさ)が消えて、反射だけの金属になります。
      <strong>ラフネス</strong>を上げると、鋭いハイライトがぼやけて広がります。この2つだけで、
      驚くほど多くの材質が作れます。
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
