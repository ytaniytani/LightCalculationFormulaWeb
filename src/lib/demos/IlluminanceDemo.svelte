<script lang="ts">
  // 第11章 照度(ルクス)と輝度(ニット)デモ。単位の関係の中心。
  //   照度 E[lx] = 光度 I[cd] × cosθ / d²   … 第4章(逆2乗)+ 第5章(余弦則)
  //   輝度 L[nit] = 反射率ρ × E / π          … 拡散面が「どれだけ明るく見えるか」
  import Slider from '../components/Slider.svelte';
  import { illuminance, luminanceNit } from '../math/photometry';

  let candela = $state(200);
  let distance = $state(3);
  let tilt = $state(0);
  let reflectance = $state(0.8);

  const lux = $derived(illuminance(candela, distance, tilt));
  const nit = $derived(luminanceNit(lux, reflectance));

  // 表示用のトーンマッピング(大きな値を 0..1 の明るさに収める)
  const luxBright = $derived(1 - Math.exp(-lux * 0.03));
  const nitBright = $derived(1 - Math.exp(-nit * 0.12));

  let canvas: HTMLCanvasElement;
  let wrap: HTMLDivElement;

  function resolveColor(name: string): string {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || '#fff';
  }

  // アニメする光子(0..1 の進行度)
  const RAYS = 11;
  let phase = 0;

  $effect(() => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const H = 250;
    let W = 0;
    let raf = 0;

    const cLight = resolveColor('--accent');
    const cText = resolveColor('--text-2');
    const cSurf = resolveColor('--border-strong');

    function sizeCanvas() {
      W = wrap.clientWidth;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width = W + 'px';
      canvas.style.height = H + 'px';
    }
    sizeCanvas();
    const ro = new ResizeObserver(sizeCanvas);
    ro.observe(wrap);

    function frame() {
      raf = requestAnimationFrame(frame);
      const ctx = canvas.getContext('2d')!;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      phase = (phase + 0.012) % 1;

      const cx = W / 2;
      const surfaceY = H - 46;
      const dPix = Math.max(28, Math.min(150, distance * 26));
      const lightY = surfaceY - dPix;
      const halfLen = Math.min(W * 0.32, 150);
      const th = (tilt * Math.PI) / 180;
      // 面(中心 cx,surfaceY を軸に傾ける)。法線は上向きから傾く。
      const dx = Math.cos(th) * halfLen;
      const dy = Math.sin(th) * halfLen;

      // 距離の目盛り線
      ctx.strokeStyle = cText;
      ctx.globalAlpha = 0.3;
      ctx.setLineDash([3, 4]);
      ctx.beginPath();
      ctx.moveTo(cx, lightY);
      ctx.lineTo(cx, surfaceY);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.globalAlpha = 1;
      ctx.fillStyle = cText;
      ctx.font = '11px system-ui, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(`距離 ${distance.toFixed(1)}`, cx + 6, (lightY + surfaceY) / 2);

      // 面
      ctx.strokeStyle = cSurf;
      ctx.lineWidth = 8;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(cx - dx, surfaceY - dy);
      ctx.lineTo(cx + dx, surfaceY + dy);
      ctx.stroke();
      // 面の明るさ(輝度)を上に薄く重ねる
      ctx.strokeStyle = cLight;
      ctx.globalAlpha = Math.min(1, nitBright);
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.moveTo(cx - dx, surfaceY - dy);
      ctx.lineTo(cx + dx, surfaceY + dy);
      ctx.stroke();
      ctx.globalAlpha = 1;

      // 光子(光源→面のサンプル点)
      const flux = luxBright;
      for (let i = 0; i < RAYS; i++) {
        const u = (i / (RAYS - 1)) * 2 - 1; // -1..1
        const tx = cx + dx * u;
        const ty = surfaceY + dy * u;
        const t = (phase + i / RAYS) % 1;
        const x = cx + (tx - cx) * t;
        const y = lightY + (ty - lightY) * t;
        ctx.fillStyle = cLight;
        ctx.globalAlpha = 0.2 + 0.8 * flux;
        ctx.beginPath();
        ctx.arc(x, y, 2.2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // 光源
      ctx.fillStyle = cLight;
      ctx.shadowColor = cLight;
      ctx.shadowBlur = 16;
      ctx.beginPath();
      ctx.arc(cx, lightY, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.fillStyle = cText;
      ctx.textAlign = 'center';
      ctx.fillText(`光源 ${candela} cd`, cx, lightY - 14);
    }
    frame();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  });
</script>

<div class="demo">
  <div class="canvas-wrap" bind:this={wrap}>
    <canvas bind:this={canvas}></canvas>
  </div>

  <div class="swatches">
    <div class="sw">
      <div class="chip" style="opacity:{0.12 + 0.88 * luxBright}"></div>
      <div class="lbl">届く光(照度)<b>{Math.round(lux)} lx</b></div>
    </div>
    <div class="arrow">× 反射率 ÷ π →</div>
    <div class="sw">
      <div class="chip" style="opacity:{0.12 + 0.88 * nitBright}"></div>
      <div class="lbl">見える明るさ(輝度)<b>{nit.toFixed(1)} nit</b></div>
    </div>
  </div>

  <Slider label="光度(カンデラ)" bind:value={candela} min={20} max={1000} step={5} reset={200} unit=" cd" digits={0} accent="var(--accent)" />
  <Slider label="距離 d" bind:value={distance} min={0.5} max={8} step={0.1} reset={3} accent="var(--accent-2)" />
  <Slider label="面の傾き θ" bind:value={tilt} min={0} max={85} step={1} reset={0} unit="°" digits={0} accent="var(--accent-2)" />
  <Slider label="反射率 ρ(アルベド)" bind:value={reflectance} min={0} max={1} step={0.01} reset={0.8} accent="var(--accent-3)" />

  <p class="note">
    <strong>照度(ルクス)</strong>は面に<strong>届く光の量</strong>。距離を離すと逆2乗で暗くなり(第4章)、
    面を傾けると余弦則で減ります(第5章)。<strong>輝度(ニット)</strong>は、その面が
    <strong>目にどれだけ明るく見えるか</strong>。届いた光に反射率をかけて π で割った値です。
    白い紙(ρ大)は明るく、黒い紙(ρ小)は同じ照度でも暗く見えます。
  </p>
</div>

<style>
  .demo {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  .canvas-wrap {
    width: 100%;
    background: radial-gradient(circle at 50% 20%, var(--bg-2), var(--bg-0) 72%);
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    overflow: hidden;
  }
  canvas {
    display: block;
  }
  .swatches {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.8rem;
    flex-wrap: wrap;
    margin: 0.3rem 0;
  }
  .sw {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  .chip {
    width: 46px;
    height: 46px;
    border-radius: 8px;
    background: var(--accent);
    border: 1px solid var(--border-strong);
  }
  .lbl {
    font-size: 0.8rem;
    color: var(--text-2);
    display: flex;
    flex-direction: column;
  }
  .lbl b {
    font-family: var(--font-mono);
    font-size: 1.05rem;
    color: var(--text-0);
  }
  .arrow {
    font-size: 0.8rem;
    color: var(--text-2);
  }
  .note {
    font-size: 0.85rem;
    color: var(--text-2);
    line-height: 1.6;
    margin: 0.3rem 0 0;
  }
</style>
