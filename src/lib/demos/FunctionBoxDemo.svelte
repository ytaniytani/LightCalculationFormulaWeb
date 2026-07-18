<script lang="ts">
  // 第1章「関数=入力→出力の箱」デモ。
  // y = a·x を、x を入れると y が返ってくる“機械”として体感する。
  import Slider from '../components/Slider.svelte';
  import Graph2D from '../components/Graph2D.svelte';

  let a = $state(2);
  let x = $state(0.5);

  const fn = $derived((xx: number) => a * xx);
  const y = $derived(a * x);
</script>

<div class="wrap">
  <div class="pipe">
    <div class="box in">
      <span class="lbl">入力 x</span>
      <span class="val">{x.toFixed(2)}</span>
    </div>
    <span class="arrow">→</span>
    <div class="box machine">
      <span class="lbl">箱(関数)</span>
      <span class="val">y = {a}x</span>
    </div>
    <span class="arrow">→</span>
    <div class="box out">
      <span class="lbl">出力 y</span>
      <span class="val">{y.toFixed(2)}</span>
    </div>
  </div>

  <Graph2D
    fn={fn}
    xMin={0}
    xMax={1}
    yMin={0}
    yMax={2}
    xLabel="x(入力)"
    yLabel="y(出力)"
    color="var(--accent-2)"
    markers={[{ x, y, color: 'var(--accent)', label: `(${x.toFixed(2)}, ${y.toFixed(2)})` }]}
  />

  <Slider label="a(かける数)" bind:value={a} min={0} max={2} step={0.1} reset={2} accent="var(--accent-2)" />
  <Slider label="x(入力)" bind:value={x} min={0} max={1} step={0.01} reset={0.5} accent="var(--accent)" />

  <p class="note">
    <strong>関数</strong>は「値を入れると値が返ってくる機械(箱)」です。ここでは x を入れると
    <code>a × x</code> が出てきます。この「入力→出力の箱」という考え方が、このあと出てくる
    すべての式の土台。むずかしい記号は、全部この箱の名前にすぎません。
  </p>
</div>

<style>
  .wrap {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  .pipe {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.6rem;
    flex-wrap: wrap;
    margin-bottom: 0.4rem;
  }
  .box {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.2rem;
    border-radius: var(--radius-sm);
    border: 1px solid var(--border-strong);
    background: var(--bg-2);
    padding: 0.5rem 0.9rem;
    min-width: 92px;
  }
  .box .lbl {
    font-size: 0.72rem;
    color: var(--text-2);
  }
  .box .val {
    font-family: var(--font-mono);
    font-size: 1.15rem;
    color: var(--text-0);
  }
  .box.machine {
    background: linear-gradient(180deg, var(--bg-3), var(--bg-2));
    border-color: var(--accent-2);
  }
  .box.machine .val {
    color: var(--accent-2);
  }
  .box.out .val {
    color: var(--accent);
  }
  .arrow {
    color: var(--text-2);
    font-size: 1.4rem;
  }
  .note {
    font-size: 0.85rem;
    color: var(--text-2);
    line-height: 1.6;
    margin: 0.2rem 0 0;
  }
</style>
