<script lang="ts">
  import IntroGoalDemo from '../../demos/IntroGoalDemo.svelte';
  import KeyCard from '../../components/KeyCard.svelte';
</script>

<section>
  <h2>ライティングって、そもそも何の計算?</h2>
  <p>
    ゲームの画面に映る物体の「明るさ」や「てかり」は、じつは1ピクセルずつ
    <strong>計算</strong>で決まっています。その計算がやっていることは、たった一言でいうと——
  </p>
  <p class="big">「光が物にあたって、跳ね返って、目に届くまで」を数字で追いかける。</p>
  <p>
    このサイトは、その計算式を<strong>中学数学から</strong>、実際に触りながら理解していく場所です。
    数式は出てきますが、暗記は不要。「読めればOK」「まず動かして、意味は後から」で進みます。
  </p>

  <h2>これが“ゴールの絵”です</h2>
  <p>
    下の球は、このサイトを最後まで進むと<strong>すべてのツマミの意味がわかるようになる</strong>デモです。
    今はまだ分からなくて当然。ためしにスライダーを動かして、金属になったり、つや消しになったり、
    ハイライト(てかり)が動いたりするのを眺めてみてください。
  </p>

  <IntroGoalDemo />

  <p>
    それぞれのツマミが、どの章で学ぶ内容に対応しているか——それがこのサイトの「地図」です。
    上のデモの下に、章へのリンクを付けてあります。
  </p>

  <KeyCard title="このサイトの歩き方" icon="🗺️">
    <p>・<strong>準備(数学)</strong>の章(第1〜3章)で、関数・カーブ・ベクトル・内積をゼロから思い出します。</p>
    <p>・<strong>直接光</strong>の章(第4〜8章)で、Lambert → スペキュラー → PBR/BRDF と進みます。</p>
    <p>・<strong>間接光</strong>の章(第9〜10章)で、跳ね返って回り込む光(スカイライト・SH)を扱います。</p>
    <p>・<strong>「わかる」ところは飛ばしてOK</strong>。各章の頭に「この章で使う数学」のリンクを置いています。</p>
  </KeyCard>

  <h3>操作のしかた(共通ルール)</h3>
  <ul>
    <li><strong>スライダー</strong>:ドラッグで値が変わり、絵も即座に変わります。<strong>ダブルクリックで初期値に戻せます</strong>。</li>
    <li><strong>3Dプレビュー</strong>:画面の上でドラッグすると、モデルをぐるぐる回せます。</li>
    <li><strong>ボタン</strong>:モデルの形(球・箱・筒・板)や、表示の内訳(拡散だけ/てかりだけ 等)を切り替えます。</li>
  </ul>

  <p class="next">準備ができたら、まずは<a href="#/chapter/numbers">第1章 数のきほん復習</a>から。</p>
</section>

<style>
  h2 {
    margin-top: 2rem;
  }
  h2:first-of-type {
    margin-top: 0;
  }
  .big {
    font-size: 1.15rem;
    color: var(--text-0);
    background: var(--bg-2);
    border-left: 4px solid var(--accent);
    border-radius: var(--radius-sm);
    padding: 0.8rem 1rem;
  }
  ul {
    color: var(--text-1);
  }
  li {
    margin: 0.4rem 0;
  }
  .next {
    margin-top: 2rem;
    font-size: 1.02rem;
  }
</style>
