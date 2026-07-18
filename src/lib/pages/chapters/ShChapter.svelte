<script lang="ts">
  import SHDemo from '../../demos/SHDemo.svelte';
  import KeyCard from '../../components/KeyCard.svelte';
</script>

<section>
  <h2>ライトプローブ:その場所の「周囲の光」を記録した点</h2>
  <p class="prereq">
    この章で使う数学:<a href="#/chapter/actors">法線 N(第4章)</a>、<a href="#/chapter/indirect">スカイライト(第9章)</a>
  </p>
  <p>
    前章のスカイライトは「空と地面」だけの単純な周囲光でした。でも実際の部屋では、赤い壁の近くは
    赤っぽく、窓際は明るく……と、<strong>場所によって周囲の光が違います</strong>。
  </p>
  <p>
    そこでゲームでは、部屋のあちこちに<strong>ライトプローブ</strong>という点を置いておきます。
    これは「<strong>その場所に立ったら、周囲からどんな光が来るか</strong>」を事前に記録した点です。
    動くキャラクターは、自分のいる位置に近いプローブの記録を<strong>補間して</strong>使います。
  </p>

  <h2>問題:周囲の光は「重い」</h2>
  <p>
    周囲から来る光は、いわば<strong>360度のパノラマ写真</strong>。そのまま全部持つとデータが重すぎます。
    プローブは何千個も置くので、1個あたりはできるだけ<strong>少ない数字</strong>に圧縮したい。
    そこで登場するのが <strong>SH(球面調和関数)</strong>です。
  </p>

  <h2>SH:周囲光を「数個の係数」に要約する道具</h2>
  <p>
    SH は「方向ごとの明るさ」を、少数の係数(ツマミ)で表す<strong>要約の道具</strong>です。
    ツマミを増やすほど細かく表現できますが、リアルタイムでは少しで十分:
  </p>
  <ul class="levels">
    <li><b>L0</b>(1個)= <strong>全方向の平均の明るさ</strong>。じつは第9章のアンビエントと同じもの。</li>
    <li><b>L1</b>(+3個)= <strong>「どっち側が明るいか」のゆるい傾き</strong>(上が明るい / 右が明るい 等)。</li>
  </ul>
  <p>
    色ごと(赤緑青)に L0+L1 の計4個 × 3色 = 12個の数字。これだけで、周囲光の「平均の明るさ」と
    「ざっくりした方向性」が表せます。下のデモで、その4つのツマミが球の見え方をどう変えるか確かめてください。
  </p>

  <SHDemo />

  <p>
    L0 だけだと、どの向きの面も同じ明るさ(=アンビエント、のっぺり)。そこに L1 を足すと、
    「上から光が来ている」「右が明るい」といった<strong>ゆるい陰り</strong>が生まれ、
    ぐっと自然になります。細かい模様までは出せませんが、<strong>柔らかい間接光としては十分</strong>——
    そこが SH の狙いです。

  </p>

  <KeyCard title="つまずいたらここに戻る" icon="🌐">
    <p>SH は要するに「<strong>周囲の明るさを数個のツマミで表す圧縮</strong>」。</p>
    <p>L0 = 平均の明るさ(アンビエント)、L1 = どっち側が明るいかの傾き。</p>
    <p>細かい反射像は出せないが、<strong>柔らかい回り込みの光</strong>を安く出すのが得意。</p>
  </KeyCard>

  <details>
    <summary>もっと知りたい人へ:基底関数と、なぜ「調和関数」なのか</summary>
    <p>
      SH は球面上で定義された<strong>基底関数</strong>の集まりで、任意の「方向→明るさ」の関数を、
      これらの重ね合わせで近似します。L0 は定数(<code>Y₀₀ ≈ 0.282</code>)、L1 は
      <code>x, y, z</code> に比例する3つ(<code>≈ 0.488·成分</code>)。係数は、周囲光をこれらの基底で
      <strong>積分(第2章)</strong>して求めます。「全方向の光 × 基底 を足し合わせる」——第8章の BRDF で見た
      “全方向を足す”がここでも出てきます。回転や球面積分の詳細は本サイトのスコープ外とし、
      ここでは<strong>係数の意味と役割の直感</strong>までにとどめます。
    </p>
  </details>
</section>

<style>
  h2 {
    margin-top: 2.2rem;
  }
  h2:first-of-type {
    margin-top: 0;
  }
  .prereq {
    font-size: 0.85rem;
    color: var(--text-2);
    background: var(--bg-2);
    border: 1px dashed var(--border-strong);
    border-radius: var(--radius-sm);
    padding: 0.3rem 0.7rem;
    display: inline-block;
  }
  .levels {
    list-style: none;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
    color: var(--text-1);
  }
  .levels li {
    background: var(--bg-2);
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    padding: 0.45rem 0.8rem;
  }
  .levels b {
    color: var(--accent-2);
    font-family: var(--font-mono);
    margin-right: 0.3rem;
  }
  details {
    margin-top: 1.5rem;
    background: var(--bg-1);
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    padding: 0.6rem 1rem;
  }
  summary {
    cursor: pointer;
    color: var(--accent-2);
    font-size: 0.92rem;
  }
  details p {
    font-size: 0.9rem;
    color: var(--text-1);
  }
</style>
