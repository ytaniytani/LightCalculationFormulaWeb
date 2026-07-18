<script lang="ts">
  // 第11章 光束(ルーメン)と光度(カンデラ)デモ。
  // 電球が全方向へ出す光の総量 = 光束。それをビームで一方向に絞るほど、
  // その向きの強さ = 光度(カンデラ)が上がる。同じ光束でも絞れば眩しくなる。
  import Slider from '../components/Slider.svelte';
  import { solidAngleSr, candelaFromLumen } from '../math/photometry';

  let lumen = $state(800);
  let beam = $state(360); // ビームの全角(度)。360=裸電球

  const omega = $derived(solidAngleSr(beam));
  const candela = $derived(candelaFromLumen(lumen, beam));

  let canvas: HTMLCanvasElement;
  let wrap: HTMLDivElement;

  interface P {
    ang: number;
    dist: number;
    speed: number;
  }
  let particles: P[] = [];

  function resolveColor(name: string): string {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || '#fff';
  }

  $effect(() => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const H = 260;
    let W = 0;
    let raf = 0;
    let cBulb = '#ffcc66';
    let cText = '#7d879c';
    let cAxis = '#2c3547';

    function sizeCanvas() {
      W = wrap.clientWidth;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width = W + 'px';
      canvas.style.height = H + 'px';
    }
    cBulb = resolveColor('--accent');
    cText = resolveColor('--text-2');
    cAxis = resolveColor('--border');
    sizeCanvas();
    const ro = new ResizeObserver(sizeCanvas);
    ro.observe(wrap);

    const bulbX = 62;
    const bulbY = H / 2;

    function spawn(p: P) {
      const half = (Math.min(360, beam) / 2) * (Math.PI / 180);
      // -half..half の範囲でランダムな射出角(水平右向きが基準)
      p.ang = (Math.random() * 2 - 1) * half;
      p.dist = 6 + Math.random() * 10;
      p.speed = 1.4 + Math.random() * 1.2;
    }

    function frame() {
      raf = requestAnimationFrame(frame);
      const ctx = canvas.getContext('2d')!;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);

      // 目標パーティクル数 = 光束に比例
      const target = Math.round(lumen / 12);
      while (particles.length < target) {
        const p: P = { ang: 0, dist: 0, speed: 1 };
        spawn(p);
        particles.push(p);
      }
      if (particles.length > target) particles.length = target;

      // 中心軸(基準方向)
      ctx.strokeStyle = cAxis;
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 5]);
      ctx.beginPath();
      ctx.moveTo(bulbX, bulbY);
      ctx.lineTo(W, bulbY);
      ctx.stroke();
      ctx.setLineDash([]);

      // ビームの縁(コーン)
      const half = (Math.min(360, beam) / 2) * (Math.PI / 180);
      if (beam < 359) {
        ctx.strokeStyle = cBulb;
        ctx.globalAlpha = 0.35;
        ctx.beginPath();
        ctx.moveTo(bulbX, bulbY);
        ctx.lineTo(bulbX + Math.cos(half) * (W - bulbX), bulbY + Math.sin(half) * (W - bulbX));
        ctx.moveTo(bulbX, bulbY);
        ctx.lineTo(bulbX + Math.cos(-half) * (W - bulbX), bulbY + Math.sin(-half) * (W - bulbX));
        ctx.stroke();
        ctx.globalAlpha = 1;
      }

      // パーティクル(光)
      for (const p of particles) {
        p.dist += p.speed;
        const x = bulbX + Math.cos(p.ang) * p.dist;
        const y = bulbY + Math.sin(p.ang) * p.dist;
        if (x > W + 4 || y < -4 || y > H + 4) {
          spawn(p);
          continue;
        }
        // 近いほど明るく見せる(距離でフェード)
        const a = Math.max(0.15, 1 - p.dist / (W - bulbX));
        ctx.fillStyle = cBulb;
        ctx.globalAlpha = a;
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // 電球
      ctx.fillStyle = cBulb;
      ctx.shadowColor = cBulb;
      ctx.shadowBlur = 18;
      ctx.beginPath();
      ctx.arc(bulbX, bulbY, 9, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // ラベル
      ctx.fillStyle = cText;
      ctx.font = '11px system-ui, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('光源', bulbX - 12, bulbY + 26);
      ctx.textAlign = 'right';
      ctx.fillText('この向きの強さ = カンデラ', W - 6, bulbY - 10);
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

  <div class="readouts">
    <div class="stat"><span class="k">光束(全体の光の量)</span><span class="v">{lumen} lm</span></div>
    <div class="stat"><span class="k">ビームの広がり</span><span class="v">{beam}°</span></div>
    <div class="stat"><span class="k">立体角 Ω</span><span class="v">{omega.toFixed(2)} sr</span></div>
    <div class="stat hi"><span class="k">光度 = 光束 ÷ Ω</span><span class="v">{Math.round(candela)} cd</span></div>
  </div>

  <Slider label="光束(ルーメン)" bind:value={lumen} min={100} max={3000} step={10} reset={800} unit=" lm" digits={0} accent="var(--accent)" />
  <Slider label="ビームの広がり(全角)" bind:value={beam} min={10} max={360} step={1} reset={360} unit="°" digits={0} accent="var(--accent-2)" />

  <p class="note">
    <strong>光束(ルーメン)</strong>は電球が出す光の<strong>総量</strong>。スライダーを上げると光の粒が増えます。
    <strong>ビームを絞る</strong>と、同じ光束が狭い範囲に集中し、その向きの<strong>光度(カンデラ)がぐんと上がります</strong>。
    懐中電灯やスポットライトが眩しいのは、光束を一方向に集めているからです。
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
    background: radial-gradient(circle at 12% 50%, var(--bg-2), var(--bg-0) 70%);
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    overflow: hidden;
  }
  canvas {
    display: block;
  }
  .readouts {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 0.5rem;
  }
  .stat {
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
    background: var(--bg-2);
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    padding: 0.4rem 0.7rem;
  }
  .stat.hi {
    border-color: var(--accent-2);
  }
  .stat .k {
    color: var(--text-2);
    font-size: 0.76rem;
  }
  .stat .v {
    font-family: var(--font-mono);
    font-size: 1.1rem;
    color: var(--text-0);
  }
  .stat.hi .v {
    color: var(--accent-2);
  }
  .note {
    font-size: 0.85rem;
    color: var(--text-2);
    line-height: 1.6;
    margin: 0.3rem 0 0;
  }
</style>
