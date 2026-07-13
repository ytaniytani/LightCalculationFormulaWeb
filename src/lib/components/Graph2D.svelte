<script lang="ts">
  // 汎用 2D グラフ。関数 y=f(x) を描画し、任意でマーカー点を重ねる。
  // Canvas 2D 実装。スライダー連動で 60fps 描画できるよう軽量に保つ。
  interface Marker {
    x: number;
    y: number;
    color?: string;
    label?: string;
  }
  interface Props {
    fn: (x: number) => number;
    xMin?: number;
    xMax?: number;
    yMin?: number;
    yMax?: number;
    xLabel?: string;
    yLabel?: string;
    markers?: Marker[];
    color?: string;
    height?: number;
  }
  let {
    fn,
    xMin = 0,
    xMax = 1,
    yMin = 0,
    yMax = 1,
    xLabel = 'x',
    yLabel = 'y',
    markers = [],
    color = 'var(--accent)',
    height = 220,
  }: Props = $props();

  let canvas: HTMLCanvasElement;
  let wrap: HTMLDivElement;

  function resolveColor(c: string): string {
    if (c.startsWith('var(')) {
      const name = c.slice(4, -1).trim();
      return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || '#fff';
    }
    return c;
  }

  function draw() {
    if (!canvas || !wrap) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = wrap.clientWidth;
    const h = height;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    const ctx = canvas.getContext('2d')!;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);

    const pad = { l: 38, r: 12, t: 12, b: 26 };
    const plotW = w - pad.l - pad.r;
    const plotH = h - pad.t - pad.b;

    const sx = (x: number) => pad.l + ((x - xMin) / (xMax - xMin)) * plotW;
    const sy = (y: number) => pad.t + (1 - (y - yMin) / (yMax - yMin)) * plotH;

    const cText = resolveColor('var(--text-2)');
    const cBorder = resolveColor('var(--border)');
    const cCurve = resolveColor(color);

    // グリッド
    ctx.strokeStyle = cBorder;
    ctx.lineWidth = 1;
    ctx.fillStyle = cText;
    ctx.font = '11px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    const xticks = 5;
    for (let i = 0; i <= xticks; i++) {
      const x = xMin + ((xMax - xMin) * i) / xticks;
      const px = sx(x);
      ctx.globalAlpha = 0.35;
      ctx.beginPath();
      ctx.moveTo(px, pad.t);
      ctx.lineTo(px, pad.t + plotH);
      ctx.stroke();
      ctx.globalAlpha = 1;
      ctx.fillText(x.toFixed(x % 1 === 0 ? 0 : 1), px, pad.t + plotH + 5);
    }
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    const yticks = 4;
    for (let i = 0; i <= yticks; i++) {
      const y = yMin + ((yMax - yMin) * i) / yticks;
      const py = sy(y);
      ctx.globalAlpha = 0.35;
      ctx.beginPath();
      ctx.moveTo(pad.l, py);
      ctx.lineTo(pad.l + plotW, py);
      ctx.stroke();
      ctx.globalAlpha = 1;
      ctx.fillText(y.toFixed(y % 1 === 0 ? 0 : 1), pad.l - 6, py);
    }

    // 軸ラベル
    ctx.fillStyle = cText;
    ctx.textAlign = 'right';
    ctx.textBaseline = 'top';
    ctx.fillText(xLabel, pad.l + plotW, pad.t + plotH + 5);
    ctx.textAlign = 'left';
    ctx.fillText(yLabel, 2, 2);

    // カーブ
    ctx.strokeStyle = cCurve;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    const steps = Math.max(64, Math.floor(plotW));
    let started = false;
    for (let i = 0; i <= steps; i++) {
      const x = xMin + ((xMax - xMin) * i) / steps;
      let y = fn(x);
      if (!Number.isFinite(y)) {
        started = false;
        continue;
      }
      const py = sy(Math.max(yMin, Math.min(yMax, y)));
      if (!started) {
        ctx.moveTo(sx(x), py);
        started = true;
      } else {
        ctx.lineTo(sx(x), py);
      }
    }
    ctx.stroke();

    // マーカー
    for (const m of markers) {
      const cm = resolveColor(m.color ?? color);
      const px = sx(m.x);
      const py = sy(Math.max(yMin, Math.min(yMax, m.y)));
      ctx.fillStyle = cm;
      ctx.beginPath();
      ctx.arc(px, py, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = resolveColor('var(--bg-0)');
      ctx.lineWidth = 2;
      ctx.stroke();
      if (m.label) {
        ctx.fillStyle = cm;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'bottom';
        ctx.font = '12px system-ui, sans-serif';
        ctx.fillText(m.label, px + 8, py - 4);
      }
    }
  }

  // props が変わるたびに再描画(Svelte 5: $effect が依存を自動追跡)
  $effect(() => {
    // 依存を明示的に読む
    void fn;
    void markers;
    void xMin;
    void xMax;
    void yMin;
    void yMax;
    draw();
  });

  $effect(() => {
    const ro = new ResizeObserver(() => draw());
    if (wrap) ro.observe(wrap);
    return () => ro.disconnect();
  });
</script>

<div class="graph" bind:this={wrap}>
  <canvas bind:this={canvas}></canvas>
</div>

<style>
  .graph {
    width: 100%;
    background: var(--bg-1);
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    padding: 6px;
  }
  canvas {
    display: block;
  }
</style>
