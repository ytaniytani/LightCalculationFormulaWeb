<script lang="ts">
  // 第9章 スカイライト(半球ライト)デモ。
  // ambient = lerp(地面色, 空色, N.y*0.5+0.5)。空の色・地面の色を変えて、
  // 球の上下で色が変わることを体感する。
  import ShaderPreview from '../three/ShaderPreview.svelte';
  import Slider from '../components/Slider.svelte';
  import { pbrFragmentShader, makePbrUniforms, lightDirFromAngles } from '../three/pbr';

  let azimuth = $state(50);
  let elevation = $state(35);
  let ambient = $state(0.5);
  let mode = $state<'final' | 'sky'>('sky');
  let skyHex = $state('#6fb3ff');
  let groundHex = $state('#5a4636');
  let geometry = $state<'sphere' | 'box' | 'cylinder' | 'plane'>('sphere');

  const uniforms = makePbrUniforms({
    albedo: '#cfcfcf',
    roughness: 0.7,
    ambient: 0.5,
    skyColor: '#6fb3ff',
    groundColor: '#5a4636',
  });

  const modeIndex = $derived(mode === 'sky' ? 6 : 0);

  $effect(() => {
    uniforms.uLightDir.value.copy(lightDirFromAngles(azimuth, elevation));
    uniforms.uAmbient.value = ambient;
    uniforms.uMode.value = modeIndex;
    uniforms.uSkyColor.value.set(skyHex);
    uniforms.uGroundColor.value.set(groundHex);
  });
</script>

<div class="demo">
  <ShaderPreview fragmentShader={pbrFragmentShader} {uniforms} {geometry} height={340} />

  <div class="controls">
    <div class="seg">
      <span class="seg-label">表示</span>
      <div class="btns">
        <button class:on={mode === 'sky'} onclick={() => (mode = 'sky')}>スカイライトのみ</button>
        <button class:on={mode === 'final'} onclick={() => (mode = 'final')}>直接光と合わせて</button>
      </div>
    </div>
    <div class="seg">
      <span class="seg-label">形</span>
      <div class="btns">
        <button class:on={geometry === 'sphere'} onclick={() => (geometry = 'sphere')}>球</button>
        <button class:on={geometry === 'box'} onclick={() => (geometry = 'box')}>箱</button>
        <button class:on={geometry === 'cylinder'} onclick={() => (geometry = 'cylinder')}>筒</button>
        <button class:on={geometry === 'plane'} onclick={() => (geometry = 'plane')}>板</button>
      </div>
    </div>

    <div class="colors">
      <label class="color">
        <span>空の色(上)</span>
        <input type="color" bind:value={skyHex} />
      </label>
      <label class="color">
        <span>地面の色(下)</span>
        <input type="color" bind:value={groundHex} />
      </label>
    </div>

    <Slider label="スカイライトの強さ" bind:value={ambient} min={0} max={1} step={0.01} reset={0.5} accent="var(--accent-2)" />
    <Slider label="ライト方位" bind:value={azimuth} min={-180} max={180} step={1} reset={50} unit="°" accent="var(--accent)" />
    <Slider label="ライト仰角" bind:value={elevation} min={-10} max={90} step={1} reset={35} unit="°" accent="var(--accent)" />

    <p class="note">
      上を向いた面には<strong>空の色</strong>、下を向いた面には<strong>地面の照り返しの色</strong>が乗ります。
      面の向き(法線)の縦成分 <code>N.y</code> で、2色を <strong>lerp(混ぜる・第3章)</strong> しているだけ。
      「スカイライトのみ」にすると、その色の付き方だけを取り出して見られます。
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
  .colors {
    display: flex;
    gap: 0.6rem;
    margin: 0.3rem 0;
  }
  .color {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    font-size: 0.82rem;
    color: var(--text-1);
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
    margin: 0.4rem 0 0;
  }
</style>
