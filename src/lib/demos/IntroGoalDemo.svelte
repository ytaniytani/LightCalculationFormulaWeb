<script lang="ts">
  // 第0章「ゴールの絵」デモ。
  // このサイトを最後まで進むと、この球のすべてのツマミの意味がわかるようになる、という地図。
  // 中身は第8章で分解する Cook-Torrance PBR そのもの。
  import ShaderPreview from '../three/ShaderPreview.svelte';
  import Slider from '../components/Slider.svelte';
  import { pbrFragmentShader, makePbrUniforms, lightDirFromAngles } from '../three/pbr';

  let azimuth = $state(40);
  let elevation = $state(35);
  let metallic = $state(0.0);
  let roughness = $state(0.35);
  let geometry = $state<'sphere' | 'box' | 'cylinder'>('sphere');

  const uniforms = makePbrUniforms({ albedo: '#d0654a', ambient: 0.14 });

  $effect(() => {
    uniforms.uLightDir.value.copy(lightDirFromAngles(azimuth, elevation));
    uniforms.uMetallic.value = metallic;
    uniforms.uRoughness.value = roughness;
  });
</script>

<div class="demo">
  <ShaderPreview fragmentShader={pbrFragmentShader} {uniforms} {geometry} height={360} />

  <div class="controls">
    <div class="seg">
      <span class="seg-label">モデル</span>
      <div class="btns">
        <button class:on={geometry === 'sphere'} onclick={() => (geometry = 'sphere')}>球</button>
        <button class:on={geometry === 'box'} onclick={() => (geometry = 'box')}>箱</button>
        <button class:on={geometry === 'cylinder'} onclick={() => (geometry = 'cylinder')}>筒</button>
      </div>
    </div>

    <Slider label="ライト方位" bind:value={azimuth} min={-180} max={180} step={1} reset={40} unit="°" accent="var(--accent)" />
    <Slider label="ライト仰角" bind:value={elevation} min={-10} max={90} step={1} reset={35} unit="°" accent="var(--accent)" />
    <Slider label="メタリック(金属っぽさ)" bind:value={metallic} min={0} max={1} step={0.01} reset={0} accent="var(--accent-3)" />
    <Slider label="ラフネス(ざらつき)" bind:value={roughness} min={0.04} max={1} step={0.01} reset={0.35} accent="var(--accent-3)" />

    <ul class="legend">
      <li><span class="dot light"></span>ライトの向き → <a href="#/chapter/actors">第4章</a></li>
      <li><span class="dot mr"></span>メタリック/ラフネス → <a href="#/chapter/pbr">第7章</a></li>
      <li><span class="dot mr"></span>てかりの形(D/F/G) → <a href="#/chapter/brdf">第8章</a></li>
    </ul>
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
  .legend {
    list-style: none;
    padding: 0;
    margin: 0.6rem 0 0;
    font-size: 0.82rem;
    color: var(--text-2);
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
  }
  .legend .dot {
    display: inline-block;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    margin-right: 0.4rem;
    vertical-align: middle;
  }
  .legend .dot.light {
    background: var(--accent);
  }
  .legend .dot.mr {
    background: var(--accent-3);
  }
</style>
