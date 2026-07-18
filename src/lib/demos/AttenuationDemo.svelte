<script lang="ts">
  // 第4章「ライトの減衰」デモ。
  // ポイントライトは距離が離れるほど暗くなる(逆2乗の法則)。
  import Slider from '../components/Slider.svelte';
  import Graph2D from '../components/Graph2D.svelte';

  let dist = $state(2);
  // 逆2乗:1 / d^2(d=0付近の発散を避けて 0.2 で下限)
  const fn = (d: number) => 1 / Math.max(d, 0.2) ** 2;
  const val = $derived(fn(dist));
</script>

<div class="wrap">
  <Graph2D
    fn={fn}
    xMin={0.2}
    xMax={6}
    yMin={0}
    yMax={4}
    xLabel="距離 d"
    yLabel="明るさ ∝ 1/d²"
    color="var(--accent)"
    markers={[{ x: dist, y: val, color: 'var(--accent-2)', label: `d=${dist.toFixed(1)} → ${val.toFixed(2)}` }]}
  />
  <Slider label="ライトからの距離 d" bind:value={dist} min={0.2} max={6} step={0.1} reset={2} accent="var(--accent-2)" />
  <p class="note">
    ポイントライト(電球のように一点から広がる光)は、距離が<strong>2倍</strong>になると明るさが
    <strong>1/4</strong> に落ちます。これが「逆2乗の法則」。光が広い球面に薄まっていくイメージです。
    ディレクショナルライト(太陽のような平行光)は遠すぎて距離が効かないので、減衰は考えません。
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
