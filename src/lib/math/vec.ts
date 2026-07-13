// ベクトルまわりの最小ヘルパー。学習デモで使う範囲だけ。

export interface Vec2 {
  x: number;
  y: number;
}

export function length(v: Vec2): number {
  return Math.hypot(v.x, v.y);
}

/** 正規化。長さ0のときは (0,0) を返す。 */
export function normalize(v: Vec2): Vec2 {
  const len = length(v);
  if (len < 1e-9) return { x: 0, y: 0 };
  return { x: v.x / len, y: v.y / len };
}

export function dot(a: Vec2, b: Vec2): number {
  return a.x * b.x + a.y * b.y;
}

/** 2ベクトルのなす角(度)。 */
export function angleDeg(a: Vec2, b: Vec2): number {
  const na = normalize(a);
  const nb = normalize(b);
  const c = clamp(dot(na, nb), -1, 1);
  return (Math.acos(c) * 180) / Math.PI;
}

export function clamp(x: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, x));
}

/** GLSL の saturate 相当(0〜1にクランプ)。 */
export function saturate(x: number): number {
  return clamp(x, 0, 1);
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function toFixed(x: number, digits = 2): string {
  return x.toFixed(digits);
}
