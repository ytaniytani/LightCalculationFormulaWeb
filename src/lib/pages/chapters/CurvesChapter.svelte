<script lang="ts">
  import PowCurveDemo from '../../demos/PowCurveDemo.svelte';
  import Formula from '../../components/Formula.svelte';
  import KeyCard from '../../components/KeyCard.svelte';
</script>

<section>
  <h2>べき乗(pow):カーブが「鋭くなる」感覚をつかむ</h2>
  <p>
    ここでは <code>y = xⁿ</code> という式を触ります。むずかしそうに見えますが、やることは
    「<strong>x を n 回かけ算する</strong>」だけ。たとえば n = 2 なら <code>x × x</code>、n = 3 なら
    <code>x × x × x</code> です。
  </p>

  <Formula tex={'y = x^{n}'} />

  <p>
    下のグラフで <strong>n のスライダー</strong>を右に動かしてみてください。x が 1 に近いところ以外の
    カーブが、どんどん下(0)に張りつくように「鋭く」なっていきます。この“鋭さ”が、あとで学ぶ
    <strong>スペキュラー(てかり)</strong>のハイライトの大きさを決める正体です。
  </p>

  <PowCurveDemo />

  <KeyCard title="ここだけ押さえればOK">
    <p>・n が大きい = カーブが鋭い = てかりが小さく強くなる</p>
    <p>・pow は「入力を何回もかけ算して、小さい値をより小さくする」道具</p>
  </KeyCard>

  <h3>ついでに:微分と積分の“気持ち”だけ</h3>
  <p>
    この先で記号を見かけても怖くないように、意味だけ先に言っておきます。計算はしません。
  </p>
  <ul>
    <li><strong>微分</strong>=「カーブのある点での<strong>傾き</strong>(どれだけ急か)」。上のカーブが急なところほど傾きが大きい、というだけの話です。</li>
    <li>
      <strong>積分</strong>(記号 <Formula tex={'\\int'} display={false} />)=「<strong>細かいものを全部足し合わせる</strong>」。のちほど「面にあらゆる方向から届く光を全部足す」ときに登場します。∫ は “合計(Sum)” の S を縦に伸ばした印、と覚えておけば十分です。
    </li>
  </ul>
</section>

<style>
  section {
    display: block;
  }
  h2 {
    margin-top: 0;
  }
  ul {
    color: var(--text-1);
  }
  li {
    margin: 0.4rem 0;
  }
</style>
