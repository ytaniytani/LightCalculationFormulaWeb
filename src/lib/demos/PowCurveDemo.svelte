<script lang="ts">
  // べき乗デモ:y = x^n の n を動かして「カーブが鋭くなる」感覚を体感。
  // スペキュラーの shininess の布石。
  import Slider from '../components/Slider.svelte';
  import Graph2D from '../components/Graph2D.svelte';

  let n = $state(2);
  let sample = $state(0.6); // グラフ上のサンプル点 x

  const fn = $derived((x: number) => Math.pow(x, n));
  const sampleY = $derived(Math.pow(sample, n));
</script>

<div class="wrap">
  <Graph2D
    fn={fn}
    xMin={0}
    xMax={1}
    yMin={0}
    yMax={1}
    xLabel="x(入力)"
    yLabel="y = xⁿ"
    color="var(--accent)"
    markers={[{ x: sample, y: sampleY, color: 'var(--accent-2)', label: `(${sample.toFixed(2)}, ${sampleY.toFixed(2)})` }]}
  />

  <Slider label="n(べき指数)" bind:value={n} min={1} max={64} step={1} reset={2} accent="var(--accent)" />
  <Slider label="x(サンプル点)" bind:value={sample} min={0} max={1} step={0.01} reset={0.6} accent="var(--accent-2)" />

  <p class="note">
    n が大きいほど、x が 1 に近いところ以外は一気に 0 へ潰れる。これがスペキュラーの
    「ハイライトが小さく鋭く絞られる」正体。青い点を動かすと、同じ x でも n によって
    y が激変するのがわかる。
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
