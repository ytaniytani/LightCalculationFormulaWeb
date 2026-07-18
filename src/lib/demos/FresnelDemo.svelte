<script lang="ts">
  // 第7章 フレネル デモ。
  // 浅い角度(すれすれ)ほど反射が強くなる = Schlick 近似のカーブを体感する。
  //   F(θ) = F0 + (1 - F0) * (1 - cosθ)^5
  // 横軸は「見る角度」(0°=正面, 90°=すれすれ)。
  import Slider from '../components/Slider.svelte';
  import Graph2D from '../components/Graph2D.svelte';

  let f0 = $state(0.04); // 正面での反射率(非金属は約0.04)
  let angle = $state(40); // 見る角度(度)

  // x: 角度(度) → cosθ を作って Schlick
  const fn = $derived((deg: number) => {
    const c = Math.cos((deg * Math.PI) / 180);
    return f0 + (1 - f0) * Math.pow(1 - c, 5);
  });
  const val = $derived(fn(angle));
</script>

<div class="wrap">
  <Graph2D
    fn={fn}
    xMin={0}
    xMax={90}
    yMin={0}
    yMax={1}
    xLabel="見る角度(0=正面, 90=すれすれ)"
    yLabel="反射率 F"
    color="var(--accent)"
    markers={[{ x: angle, y: val, color: 'var(--accent-2)', label: `${angle}° → ${val.toFixed(2)}` }]}
  />
  <Slider label="F0(正面での反射率)" bind:value={f0} min={0.02} max={1} step={0.01} reset={0.04} accent="var(--accent-3)" />
  <Slider label="見る角度" bind:value={angle} min={0} max={90} step={1} reset={40} unit="°" accent="var(--accent-2)" />

  <p class="note">
    正面から見ると反射はわずか(非金属で <strong>F0 ≈ 0.04</strong>)。でも<strong>すれすれの角度</strong>
    (90°に近づく)では、どんな材質も<strong>ほぼ鏡</strong>になります。静かな水面を真上から見ると底が透け、
    遠くを見ると空を映すのと同じ現象です。金属は F0 が高い(0.5〜1.0)ので、正面からでもよく反射します。
  </p>
</div>

<style>
  .wrap {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
  }
  .note {
    font-size: 0.85rem;
    color: var(--text-2);
    line-height: 1.6;
    margin: 0.4rem 0 0;
  }
</style>
