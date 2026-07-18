<script lang="ts">
  // 第8章 Cook-Torrance 合体デモ。共有 PBR シェーダーの D・F・G を個別に ON/OFF して、
  // 各項が見た目にどう効くかを確かめる。表示モードで各項だけを取り出すこともできる。
  import ShaderPreview from '../three/ShaderPreview.svelte';
  import Slider from '../components/Slider.svelte';
  import { pbrFragmentShader, makePbrUniforms, lightDirFromAngles } from '../three/pbr';

  let azimuth = $state(45);
  let elevation = $state(35);
  let metallic = $state(1.0);
  let roughness = $state(0.35);
  let useD = $state(true);
  let useF = $state(true);
  let useG = $state(true);
  let mode = $state<'final' | 'specular' | 'D' | 'F' | 'G'>('final');

  const uniforms = makePbrUniforms({ albedo: '#d8b04a', metallic: 1, roughness: 0.35, ambient: 0.1 });

  const modeIndex = $derived(
    mode === 'final' ? 0 : mode === 'specular' ? 2 : mode === 'D' ? 3 : mode === 'F' ? 4 : 5
  );

  $effect(() => {
    uniforms.uLightDir.value.copy(lightDirFromAngles(azimuth, elevation));
    uniforms.uMetallic.value = metallic;
    uniforms.uRoughness.value = roughness;
    uniforms.uDEnable.value = useD ? 1 : 0;
    uniforms.uFEnable.value = useF ? 1 : 0;
    uniforms.uGEnable.value = useG ? 1 : 0;
    uniforms.uMode.value = modeIndex;
  });
</script>

<div class="demo">
  <ShaderPreview fragmentShader={pbrFragmentShader} {uniforms} geometry="sphere" height={340} />

  <div class="controls">
    <div class="seg">
      <span class="seg-label">表示する項</span>
      <div class="btns">
        <button class:on={mode === 'final'} onclick={() => (mode = 'final')}>最終結果</button>
        <button class:on={mode === 'specular'} onclick={() => (mode = 'specular')}>鏡面のみ</button>
        <button class:on={mode === 'D'} onclick={() => (mode = 'D')}>D</button>
        <button class:on={mode === 'F'} onclick={() => (mode = 'F')}>F</button>
        <button class:on={mode === 'G'} onclick={() => (mode = 'G')}>G</button>
      </div>
    </div>

    <div class="seg">
      <span class="seg-label">鏡面の内訳を ON/OFF(最終結果・鏡面のみ で効く)</span>
      <div class="toggles">
        <label class="tog" class:on={useD}><input type="checkbox" bind:checked={useD} /><b>D</b> 分布</label>
        <label class="tog" class:on={useF}><input type="checkbox" bind:checked={useF} /><b>F</b> フレネル</label>
        <label class="tog" class:on={useG}><input type="checkbox" bind:checked={useG} /><b>G</b> 遮蔽</label>
      </div>
    </div>

    <Slider label="メタリック" bind:value={metallic} min={0} max={1} step={0.01} reset={1} accent="var(--accent-3)" />
    <Slider label="ラフネス" bind:value={roughness} min={0.04} max={1} step={0.01} reset={0.35} accent="var(--accent-3)" />
    <Slider label="ライト方位" bind:value={azimuth} min={-180} max={180} step={1} reset={45} unit="°" accent="var(--accent)" />
    <Slider label="ライト仰角" bind:value={elevation} min={-10} max={90} step={1} reset={35} unit="°" accent="var(--accent)" />

    <p class="note">
      <b>D</b> を切ると、ラフネスによるハイライトの形が消えます。<b>F</b> を切ると、ふちの明るさ
      (すれすれの反射)が消えます。<b>G</b> を切ると、ざらざら面が本来より明るくなりすぎます。
      3つそろって、はじめて自然なてかりになります。
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
    font-size: 0.78rem;
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
  .toggles {
    display: flex;
    gap: 0.4rem;
    flex-wrap: wrap;
  }
  .tog {
    display: flex;
    align-items: center;
    gap: 0.35rem;
    background: var(--bg-2);
    border: 1px solid var(--border-strong);
    border-radius: 999px;
    padding: 0.25rem 0.7rem;
    font-size: 0.85rem;
    color: var(--text-2);
    cursor: pointer;
  }
  .tog.on {
    color: var(--text-0);
    border-color: var(--accent-3);
  }
  .tog b {
    color: var(--accent-3);
    font-family: var(--font-mono);
  }
  .note {
    font-size: 0.83rem;
    color: var(--text-2);
    line-height: 1.6;
    margin: 0.4rem 0 0;
  }
</style>
