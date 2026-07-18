// 光の単位(測光量)まわりの計算ヘルパー。第11章で使う。
// 物理的に正確な簡易式に絞る(学習用)。

export interface RGB {
  r: number; // 0..255
  g: number;
  b: number;
}

/** 円錐(全角 fullAngleDeg)の立体角 Ω[sr]。360°で全球 4π になる。 */
export function solidAngleSr(fullAngleDeg: number): number {
  const half = (Math.min(360, Math.max(0, fullAngleDeg)) / 2) * (Math.PI / 180);
  return 2 * Math.PI * (1 - Math.cos(half));
}

/** 光度 cd = 光束 lm / 立体角 Ω。 */
export function candelaFromLumen(lumen: number, fullAngleDeg: number): number {
  const omega = solidAngleSr(fullAngleDeg);
  if (omega < 1e-6) return 0;
  return lumen / omega;
}

/** 照度 E[lx] = 光度 I[cd] × cosθ / 距離d² (点光源・逆2乗+余弦則)。 */
export function illuminance(candela: number, distance: number, tiltDeg: number): number {
  const d = Math.max(0.05, distance);
  const cos = Math.max(0, Math.cos((tiltDeg * Math.PI) / 180));
  return (candela * cos) / (d * d);
}

/** 拡散面(反射率ρ)の輝度 L[nit] = ρ × E / π。 */
export function luminanceNit(illuminanceLx: number, reflectance: number): number {
  return (reflectance * illuminanceLx) / Math.PI;
}

/**
 * 色温度(ケルビン)→ RGB。Tanner Helland 近似。
 * 1000〜40000K を想定。0..255 を返す。
 */
export function kelvinToRGB(kelvin: number): RGB {
  const temp = Math.max(1000, Math.min(40000, kelvin)) / 100;
  let r: number;
  let g: number;
  let b: number;

  if (temp <= 66) {
    r = 255;
    g = 99.4708025861 * Math.log(temp) - 161.1195681661;
  } else {
    r = 329.698727446 * Math.pow(temp - 60, -0.1332047592);
    g = 288.1221695283 * Math.pow(temp - 60, -0.0755148492);
  }

  if (temp >= 66) {
    b = 255;
  } else if (temp <= 19) {
    b = 0;
  } else {
    b = 138.5177312231 * Math.log(temp - 10) - 305.0447927307;
  }

  const clamp = (x: number) => Math.max(0, Math.min(255, Math.round(x)));
  return { r: clamp(r), g: clamp(g), b: clamp(b) };
}

/** CSS の rgb() 文字列に。 */
export function rgbToCss({ r, g, b }: RGB): string {
  return `rgb(${r}, ${g}, ${b})`;
}

/** 明るさを保ったまま色みだけ使いたいとき、最大チャンネルを255に正規化する。 */
export function normalizeTint({ r, g, b }: RGB): RGB {
  const m = Math.max(r, g, b, 1);
  const k = 255 / m;
  return { r: Math.round(r * k), g: Math.round(g * k), b: Math.round(b * k) };
}
