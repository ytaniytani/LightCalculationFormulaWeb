<script lang="ts">
  // 第11章 色温度(ケルビン)デモ。
  // 明るさ(強さ)とは別の軸=「白の色み」。低いほど暖色(オレンジ)、高いほど寒色(青)。
  import Slider from '../components/Slider.svelte';
  import { kelvinToRGB, rgbToCss, normalizeTint } from '../math/photometry';

  let kelvin = $state(4000);

  const raw = $derived(kelvinToRGB(kelvin));
  const lightCss = $derived(rgbToCss(raw));
  const wallCss = $derived(rgbToCss(normalizeTint(raw)));

  const refs: { k: number; label: string }[] = [
    { k: 1900, label: 'ろうそく' },
    { k: 2700, label: '電球色' },
    { k: 4000, label: '温白色' },
    { k: 5000, label: '昼白色' },
    { k: 6500, label: '昼光色' },
    { k: 10000, label: '晴天の空' },
  ];

  let bar: HTMLCanvasElement;
  let barWrap: HTMLDivElement;

  $effect(() => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const H = 22;
    let W = 0;
    function draw() {
      W = barWrap.clientWidth;
      bar.width = W * dpr;
      bar.height = H * dpr;
      bar.style.width = W + 'px';
      bar.style.height = H + 'px';
      const ctx = bar.getContext('2d')!;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const kMin = 1500;
      const kMax = 12000;
      for (let x = 0; x < W; x++) {
        const k = kMin + ((kMax - kMin) * x) / W;
        ctx.fillStyle = rgbToCss(kelvinToRGB(k));
        ctx.fillRect(x, 0, 1, H);
      }
    }
    draw();
    const ro = new ResizeObserver(draw);
    ro.observe(barWrap);
    return () => ro.disconnect();
  });

  const markerPct = $derived(((kelvin - 1500) / (12000 - 1500)) * 100);
</script>

<div class="demo">
  <div class="panels">
    <div class="wall" style="background:{wallCss}">
      <span class="tag">白い壁がこう見える</span>
    </div>
    <div class="light">
      <div class="bulb" style="background:{lightCss}; box-shadow:0 0 26px {lightCss}"></div>
      <span class="tag">光の色み</span>
      <span class="kv">{kelvin} K</span>
    </div>
  </div>

  <div class="bar-wrap" bind:this={barWrap}>
    <canvas bind:this={bar}></canvas>
    <div class="marker" style="left:{markerPct}%"></div>
  </div>

  <Slider label="色温度(ケルビン)" bind:value={kelvin} min={1500} max={12000} step={50} reset={4000} unit=" K" digits={0} accent="var(--accent)" />

  <div class="refs">
    {#each refs as r}
      <button class="ref" class:on={Math.abs(kelvin - r.k) < 200} onclick={() => (kelvin = r.k)}>
        <span class="dot" style="background:{rgbToCss(kelvinToRGB(r.k))}"></span>
        {r.label}<small>{r.k}K</small>
      </button>
    {/each}
  </div>

  <p class="note">
    色温度は<strong>明るさとは別の軸</strong>——「白」がどんな色みかを表します。低い(2000K前後)ほど
    <strong>暖かいオレンジ</strong>(ろうそく・電球)、高い(6500K以上)ほど<strong>青白い</strong>
    (曇天・空)。カメラの「ホワイトバランス」や、部屋の照明を選ぶときの「電球色/昼光色」は、
    まさにこのケルビンの話です。
  </p>
</div>

<style>
  .demo {
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
  }
  .panels {
    display: grid;
    grid-template-columns: 1.6fr 1fr;
    gap: 0.7rem;
  }
  @media (max-width: 560px) {
    .panels {
      grid-template-columns: 1fr;
    }
  }
  .wall,
  .light {
    height: 130px;
    border-radius: var(--radius-sm);
    border: 1px solid var(--border-strong);
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap: 0.4rem;
  }
  .light {
    background: var(--bg-1);
  }
  .bulb {
    width: 44px;
    height: 44px;
    border-radius: 50%;
  }
  .tag {
    position: absolute;
    bottom: 6px;
    left: 8px;
    font-size: 0.72rem;
    color: rgba(0, 0, 0, 0.55);
    background: rgba(255, 255, 255, 0.35);
    padding: 0 0.3rem;
    border-radius: 4px;
  }
  .light .tag {
    color: var(--text-2);
    background: none;
    position: static;
  }
  .kv {
    font-family: var(--font-mono);
    color: var(--text-0);
    font-size: 0.95rem;
  }
  .bar-wrap {
    position: relative;
    width: 100%;
  }
  .bar-wrap canvas {
    display: block;
    border-radius: 6px;
    border: 1px solid var(--border);
  }
  .marker {
    position: absolute;
    top: -3px;
    bottom: -3px;
    width: 3px;
    background: var(--text-0);
    border-radius: 2px;
    transform: translateX(-50%);
    box-shadow: 0 0 0 1px var(--bg-0);
  }
  .refs {
    display: flex;
    gap: 0.4rem;
    flex-wrap: wrap;
  }
  .ref {
    display: flex;
    align-items: center;
    gap: 0.35rem;
    background: var(--bg-2);
    border: 1px solid var(--border-strong);
    border-radius: 999px;
    padding: 0.25rem 0.7rem;
    font-size: 0.82rem;
    color: var(--text-1);
    cursor: pointer;
  }
  .ref.on {
    border-color: var(--accent);
    color: var(--text-0);
  }
  .ref small {
    color: var(--text-2);
    margin-left: 0.2rem;
  }
  .ref .dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    border: 1px solid var(--border-strong);
  }
  .note {
    font-size: 0.85rem;
    color: var(--text-2);
    line-height: 1.6;
    margin: 0.3rem 0 0;
  }
</style>
