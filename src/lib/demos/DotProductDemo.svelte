<script lang="ts">
  // 内積デモ:2本の矢印(N と L)をドラッグして、内積 dot(N,L) と
  // なす角を体感する。本サイト最重要の直感を作る中核デモ。
  import { dot, normalize, angleDeg, clamp, type Vec2 } from '../math/vec';

  const SIZE = 320;
  const C = SIZE / 2; // 中心
  const R = 120; // 矢印の基準長(ピクセル)

  // 単位ベクトル(向き)を state として持つ。表示は正規化した矢印。
  let n = $state<Vec2>({ x: 0.85, y: -0.5 });
  let l = $state<Vec2>({ x: 0.2, y: -0.95 });

  let dragging: 'n' | 'l' | null = null;
  let svgEl: SVGSVGElement;

  const nu = $derived(normalize(n));
  const lu = $derived(normalize(l));
  const d = $derived(clamp(dot(nu, lu), -1, 1));
  const ang = $derived(angleDeg(nu, lu));
  const lambert = $derived(Math.max(0, d));

  // 画面座標(y下向き)へ:数学のy上向きを反転
  function toScreen(v: Vec2): Vec2 {
    return { x: C + v.x * R, y: C - v.y * R };
  }

  function pointerToVec(e: PointerEvent): Vec2 {
    const rect = svgEl.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * SIZE;
    const py = ((e.clientY - rect.top) / rect.height) * SIZE;
    return normalize({ x: px - C, y: -(py - C) });
  }

  function startDrag(which: 'n' | 'l', e: PointerEvent) {
    dragging = which;
    (e.target as Element).setPointerCapture?.(e.pointerId);
  }
  function onMove(e: PointerEvent) {
    if (!dragging) return;
    const v = pointerToVec(e);
    if (v.x === 0 && v.y === 0) return;
    if (dragging === 'n') n = v;
    else l = v;
  }
  function endDrag() {
    dragging = null;
  }

  const nS = $derived(toScreen(nu));
  const lS = $derived(toScreen(lu));

  // dot の符号で色を変える(正=同じ向き寄り、負=反対向き寄り)
  const dotColor = $derived(
    d > 0.02 ? 'var(--accent-3)' : d < -0.02 ? 'var(--danger)' : 'var(--text-2)'
  );

  // なす角の扇を描くSVGパス
  function arcPath(a: Vec2, b: Vec2): string {
    const r = 42;
    const na = normalize(a);
    const nb = normalize(b);
    const p1 = { x: C + na.x * r, y: C - na.y * r };
    const p2 = { x: C + nb.x * r, y: C - nb.y * r };
    const cross = na.x * nb.y - na.y * nb.x;
    const sweep = cross > 0 ? 0 : 1;
    return `M ${C} ${C} L ${p1.x} ${p1.y} A ${r} ${r} 0 0 ${sweep} ${p2.x} ${p2.y} Z`;
  }
</script>

<div class="demo">
  <svg
    bind:this={svgEl}
    viewBox="0 0 {SIZE} {SIZE}"
    onpointermove={onMove}
    onpointerup={endDrag}
    onpointerleave={endDrag}
    role="application"
    aria-label="2本のベクトルをドラッグして内積を確かめるデモ"
  >
    <!-- 単位円 -->
    <circle cx={C} cy={C} r={R} class="unit-circle" />
    <!-- 軸 -->
    <line x1={C - R - 20} y1={C} x2={C + R + 20} y2={C} class="axis" />
    <line x1={C} y1={C - R - 20} x2={C} y2={C + R + 20} class="axis" />

    <!-- L と N のなす角を示す扇 -->
    <path d={arcPath(nu, lu)} class="angle-arc" />

    <!-- L ベクトル -->
    <line x1={C} y1={C} x2={lS.x} y2={lS.y} class="vec vec-l" />
    <circle
      cx={lS.x}
      cy={lS.y}
      r="11"
      class="handle handle-l"
      onpointerdown={(e) => startDrag('l', e)}
      role="button"
      tabindex="0"
      aria-label="ライト方向 L のハンドル"
    />
    <text x={lS.x} y={lS.y} dx={lS.x > C ? 16 : -16} dy="-8" class="lbl lbl-l">L</text>

    <!-- N ベクトル -->
    <line x1={C} y1={C} x2={nS.x} y2={nS.y} class="vec vec-n" />
    <circle
      cx={nS.x}
      cy={nS.y}
      r="11"
      class="handle handle-n"
      onpointerdown={(e) => startDrag('n', e)}
      role="button"
      tabindex="0"
      aria-label="法線 N のハンドル"
    />
    <text x={nS.x} y={nS.y} dx={nS.x > C ? 16 : -16} dy="-8" class="lbl lbl-n">N</text>
  </svg>

  <div class="readout">
    <div class="stat">
      <span class="k">なす角</span>
      <span class="v">{ang.toFixed(0)}°</span>
    </div>
    <div class="stat">
      <span class="k">dot(N, L)</span>
      <span class="v" style="color:{dotColor}">{d.toFixed(2)}</span>
    </div>
    <div class="stat">
      <span class="k">Lambert = max(0, dot)</span>
      <span class="v" style="color:var(--accent)">{lambert.toFixed(2)}</span>
    </div>
    <div class="hint">
      矢印の先の丸をドラッグして動かしてみよう。<br />
      2本が<strong>同じ向き</strong>のとき dot は <strong>1</strong>、<strong>直角</strong>で
      <strong>0</strong>、<strong>反対向き</strong>で <strong>-1</strong>。
    </div>
  </div>
</div>

<style>
  .demo {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
    align-items: center;
  }
  svg {
    width: min(320px, 100%);
    height: auto;
    background: var(--bg-1);
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    touch-action: none;
  }
  .unit-circle {
    fill: none;
    stroke: var(--border-strong);
    stroke-dasharray: 3 4;
  }
  .axis {
    stroke: var(--border);
    stroke-width: 1;
  }
  .angle-arc {
    fill: rgba(255, 204, 102, 0.15);
    stroke: none;
  }
  .vec {
    stroke-width: 4;
    stroke-linecap: round;
  }
  .vec-n {
    stroke: var(--accent-2);
  }
  .vec-l {
    stroke: var(--accent);
  }
  .handle {
    cursor: grab;
    stroke: var(--bg-0);
    stroke-width: 2;
  }
  .handle:active {
    cursor: grabbing;
  }
  .handle-n {
    fill: var(--accent-2);
  }
  .handle-l {
    fill: var(--accent);
  }
  .lbl {
    font-size: 15px;
    font-weight: 700;
    fill: var(--text-0);
    user-select: none;
  }
  .readout {
    flex: 1;
    min-width: 200px;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  .stat {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    background: var(--bg-2);
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    padding: 0.5rem 0.8rem;
  }
  .stat .k {
    color: var(--text-1);
    font-size: 0.9rem;
  }
  .stat .v {
    font-family: var(--font-mono);
    font-size: 1.3rem;
    font-variant-numeric: tabular-nums;
  }
  .hint {
    font-size: 0.85rem;
    color: var(--text-2);
    line-height: 1.6;
  }
</style>
