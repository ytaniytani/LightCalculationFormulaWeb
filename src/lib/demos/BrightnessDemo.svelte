<script lang="ts">
  // 第1章「0〜1の世界」デモ。
  // CGでは明るさを 0(なし)〜1(最大)で表す。割合・百分率の復習。
  import Slider from '../components/Slider.svelte';

  let brightness = $state(0.5);

  const pct = $derived(Math.round(brightness * 100));
  // 0〜1 を 0〜255 のグレーに(sRGB 近似のガンマを軽くかけて見た目を自然に)
  const gray = $derived(Math.round(Math.pow(brightness, 1 / 2.2) * 255));
  const swatch = $derived(`rgb(${gray}, ${gray}, ${gray})`);
</script>

<div class="demo">
  <div class="swatch" style="background:{swatch}">
    <span class="tag" style="color:{brightness > 0.5 ? '#000' : '#fff'}">{brightness.toFixed(2)}</span>
  </div>
  <div class="controls">
    <Slider label="明るさ(0〜1)" bind:value={brightness} min={0} max={1} step={0.01} reset={0.5} accent="var(--accent)" />
    <div class="readouts">
      <div class="stat"><span class="k">割合でいうと</span><span class="v">{pct}%</span></div>
      <div class="stat"><span class="k">0 = 真っ黒 / 1 = 真っ白</span><span class="v">{brightness === 0 ? '黒' : brightness === 1 ? '白' : '灰'}</span></div>
    </div>
    <p class="note">
      CGの世界では、明るさも色も「0=なし、1=最大」の<strong>割合</strong>で表します。
      0.5 は 50%、つまり「半分の明るさ」。百分率(%)を 100 で割っただけ、と思えばOKです。
    </p>
  </div>
</div>

<style>
  .demo {
    display: grid;
    grid-template-columns: 200px 1fr;
    gap: 1rem;
    align-items: center;
  }
  @media (max-width: 560px) {
    .demo {
      grid-template-columns: 1fr;
    }
  }
  .swatch {
    height: 160px;
    border-radius: var(--radius-sm);
    border: 1px solid var(--border-strong);
    display: flex;
    align-items: flex-end;
    justify-content: flex-end;
    padding: 0.5rem;
  }
  .tag {
    font-family: var(--font-mono);
    font-size: 1.1rem;
    font-weight: 700;
  }
  .controls {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  .readouts {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
  }
  .stat {
    flex: 1;
    min-width: 130px;
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    background: var(--bg-2);
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    padding: 0.4rem 0.7rem;
  }
  .stat .k {
    color: var(--text-2);
    font-size: 0.82rem;
  }
  .stat .v {
    font-family: var(--font-mono);
    font-size: 1.15rem;
    color: var(--accent);
  }
  .note {
    font-size: 0.85rem;
    color: var(--text-2);
    line-height: 1.6;
    margin: 0.2rem 0 0;
  }
</style>
