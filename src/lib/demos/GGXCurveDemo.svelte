<script lang="ts">
  // 第8章 D項(GGX)デモ。
  // 「面の鏡たちがどれだけ N の向きにそろっているか」の分布を、ラフネス別に見る。
  // 横軸:N と H のなす角(度)。縦軸:相対的なてかりの強さ(ピークを1に正規化)。
  import Slider from '../components/Slider.svelte';
  import Graph2D from '../components/Graph2D.svelte';

  let roughness = $state(0.3);

  // GGX(Trowbridge-Reitz):a=rough^2。ピーク(θ=0)を1に正規化して形だけ見せる。
  const fn = $derived((deg: number) => {
    const a = roughness * roughness;
    const a2 = a * a;
    const noh = Math.cos((deg * Math.PI) / 180);
    const d = noh * noh * (a2 - 1) + 1;
    const D = a2 / (Math.PI * d * d);
    // θ=0 のとき d=a2 なので D_peak = 1/(π·a2)。これで割って形だけを取り出す。
    const peak = 1 / (Math.PI * a2);
    return D / peak;
  });
</script>

<div class="wrap">
  <Graph2D
    fn={fn}
    xMin={0}
    xMax={60}
    yMin={0}
    yMax={1}
    xLabel="N と H のなす角(度)"
    yLabel="相対的なてかり(D)"
    color="var(--accent)"
  />
  <Slider label="ラフネス(ざらつき)" bind:value={roughness} min={0.05} max={1} step={0.01} reset={0.3} accent="var(--accent-3)" />
  <p class="note">
    ラフネスが<strong>小さい</strong>(つるつる)ほど、カーブは中央にキュッと集まります
    = ハイライトが<strong>小さく鋭い</strong>。ラフネスが<strong>大きい</strong>(ざらざら)ほど、
    カーブは横に広がります = ハイライトが<strong>ぼやけて広い</strong>。これが D 項(GGX)の役割です。
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
