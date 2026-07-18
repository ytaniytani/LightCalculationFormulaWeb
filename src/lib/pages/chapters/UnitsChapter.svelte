<script lang="ts">
  import LumenCandelaDemo from '../../demos/LumenCandelaDemo.svelte';
  import IlluminanceDemo from '../../demos/IlluminanceDemo.svelte';
  import ColorTempDemo from '../../demos/ColorTempDemo.svelte';
  import Formula from '../../components/Formula.svelte';
  import KeyCard from '../../components/KeyCard.svelte';
</script>

<section>
  <h2>光の単位は、なぜこんなに多いのか</h2>
  <p class="prereq">
    この章で使う数学:<a href="#/chapter/actors">逆2乗の減衰(第4章)</a>、<a href="#/chapter/diffuse">余弦則・拡散(第5章)</a>
  </p>
  <p>
    ルーメン、カンデラ、ルクス、ニット……光の単位がたくさんあって混乱しますよね。でも安心してください。
    多いのには理由があります。光は<strong>「出る → 飛ぶ → 面に届く → 目に見える」</strong>という旅をしていて、
    <strong>その段階ごとに測る単位が違う</strong>だけなのです。順番に、1つずつ体験していきましょう。
  </p>

  <div class="journey">
    <div class="step"><b>ルーメン</b><span>光源が出す総量</span></div>
    <span class="sep">→</span>
    <div class="step"><b>カンデラ</b><span>ある向きの強さ</span></div>
    <span class="sep">→</span>
    <div class="step"><b>ルクス</b><span>面に届く量</span></div>
    <span class="sep">→</span>
    <div class="step"><b>ニット</b><span>目に見える明るさ</span></div>
  </div>

  <h2>① ルーメン(lm)= 光源が出す光の「総量」</h2>
  <p>
    まずは<strong>ルーメン(光束)</strong>。これは電球やLEDが<strong>全方向へ出す光の合計量</strong>です。
    「このLEDは800ルーメン」と言えば、向きに関係なく<strong>全部でどれだけ光を出すか</strong>の量。
    電球のパッケージに大きく書いてあるのがこれです。
  </p>

  <h2>② カンデラ(cd)= ある「一方向」への強さ</h2>
  <p>
    同じ800ルーメンでも、<strong>裸電球</strong>のように全方向へばらまくのと、<strong>スポットライト</strong>
    のように一方向へ絞るのとでは、その方向の眩しさが全然違います。この
    <strong>「ある向きへどれだけ強く光っているか」</strong>が<strong>カンデラ(光度)</strong>です。
  </p>
  <p>
    下のデモで、まず<strong>光束(ルーメン)</strong>を増やして光の粒が増えるのを見て、次に
    <strong>ビームを絞って</strong>ください。光束は同じままなのに、カンデラがぐんと上がります。
  </p>

  <LumenCandelaDemo />

  <p>
    式で書くと、カンデラは「光束を、広がりの<strong>立体角 Ω(ステラジアン)</strong>で割ったもの」。
    立体角は「どれだけの範囲に広がっているか」の面積のようなものです(全方向 = 4π sr)。
  </p>
  <Formula tex={'\\text{カンデラ (cd)} = \\dfrac{\\text{ルーメン (lm)}}{\\text{立体角}\\ \\Omega}'} />

  <h2>③ ルクス(lx)= 面が「どれだけ照らされるか」</h2>
  <p>
    次は、光が<strong>面に届いた</strong>ときの量。机の上や床が<strong>どれだけ明るく照らされているか</strong>が
    <strong>ルクス(照度)</strong>です。「勉強机は500ルクス以上が目安」などと使われます。
  </p>
  <p>
    ここで、これまで学んだ2つの法則がそのまま効いてきます:
  </p>
  <ul>
    <li><strong>距離で暗くなる</strong>(第4章の<strong>逆2乗</strong>):光源から離れると <code>÷ d²</code></li>
    <li><strong>傾けると減る</strong>(第5章の<strong>余弦則</strong>):面が斜めだと <code>× cosθ</code></li>
  </ul>
  <Formula tex={'\\text{照度 (lx)} = \\dfrac{\\text{光度 (cd)} \\times \\cos\\theta}{d^{2}}'} />

  <h2>④ ニット(nit)= 目に「見える明るさ」</h2>
  <p>
    最後は<strong>ニット(輝度)</strong>。面に届いた光(ルクス)のうち、<strong>目やカメラに向かって
    戻ってくる明るさ</strong>です。同じ照度でも、<strong>白い紙は明るく、黒い紙は暗く</strong>見えますよね。
    その「見え方」を決めるのが、面の<strong>反射率 ρ(アルベド・第5章)</strong>です。
  </p>
  <Formula tex={'\\text{輝度 (nit)} = \\dfrac{\\rho \\times \\text{照度 (lx)}}{\\pi}'} />
  <p>
    ニットは<strong>ディスプレイの明るさ</strong>の単位としても有名です。「このHDRテレビは1000ニット」
    と言えば、画面が<strong>光源としてどれだけ強く光れるか</strong>を指します。
  </p>

  <p>
    下のデモは、この章の<strong>心臓部</strong>。光度(cd)から、距離と傾きで<strong>照度(lx)</strong>が決まり、
    反射率で<strong>輝度(nit)</strong>になるまでの流れを、一度に触れます。距離・傾き・反射率を動かして、
    左の「届く光」と右の「見える明るさ」がどう変わるか確かめてください。
  </p>

  <IlluminanceDemo />

  <KeyCard title="単位の関係マップ" icon="🗺️">
    <p><b>ルーメン</b>(出る総量)<b> ÷ 立体角 →</b> <b>カンデラ</b>(ある向きの強さ)</p>
    <p><b>カンデラ</b> <b>× cosθ ÷ d² →</b> <b>ルクス</b>(面に届く量)</p>
    <p><b>ルクス</b> <b>× 反射率 ÷ π →</b> <b>ニット</b>(目に見える明るさ)</p>
  </KeyCard>

  <h2>⑤ ケルビン(K)= 明るさではなく「白の色み」</h2>
  <p>
    ここまでの4つは<strong>光の量</strong>の単位でした。<strong>ケルビン(色温度)</strong>は毛色が違って、
    <strong>「白」がどんな色みか</strong>を表します。ろうそくの<strong>暖かいオレンジ</strong>から、
    晴天の空の<strong>青白さ</strong>まで。量とは<strong>別の軸</strong>だと考えてください。
  </p>
  <p>
    下のスライダーで、同じ「白い壁」が光の色温度でどう見えるか体験してください。プリセットのボタンで、
    身近な光源に一発で合わせられます。
  </p>

  <ColorTempDemo />

  <KeyCard title="ここだけ押さえればOK">
    <p>・光の量の単位は、光の<strong>旅の段階</strong>で変わるだけ:出る(lm)→ 向き(cd)→ 届く(lx)→ 見える(nit)。</p>
    <p>・cd→lx は<strong>逆2乗(第4章)+ 余弦則(第5章)</strong>そのもの。新しい話ではない。</p>
    <p>・<strong>ニット</strong>は面の明るさ・画面の明るさ。<strong>ケルビン</strong>は量ではなく色み。</p>
  </KeyCard>

  <details>
    <summary>もっと知りたい人へ:CGの「0〜1」と実際の単位の関係</summary>
    <p>
      このサイトのデモでは明るさを<strong>0〜1(第1章)</strong>で扱ってきました。現実のニットは
      数千にもなり、0〜1には収まりません。そこで実際のレンダリングでは、物理的な明るさ(ニット相当)で
      計算し、最後に<strong>トーンマッピング(第12章)</strong>で画面に収まる 0〜1 へ圧縮します。
      つまり「単位のある物理量で計算 → 見せるときに 0〜1 へ」という二段構え。この章の単位は、その
      <strong>計算側の言葉</strong>にあたります。
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
  .journey {
    display: flex;
    align-items: stretch;
    justify-content: center;
    gap: 0.4rem;
    flex-wrap: wrap;
    margin: 1.2rem 0;
  }
  .journey .step {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.15rem;
    background: var(--bg-2);
    border: 1px solid var(--border-strong);
    border-radius: var(--radius-sm);
    padding: 0.5rem 0.7rem;
    min-width: 96px;
  }
  .journey .step b {
    color: var(--accent);
    font-size: 0.95rem;
  }
  .journey .step span {
    font-size: 0.72rem;
    color: var(--text-2);
  }
  .journey .sep {
    align-self: center;
    color: var(--text-2);
  }
  ul {
    color: var(--text-1);
  }
  li {
    margin: 0.3rem 0;
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
