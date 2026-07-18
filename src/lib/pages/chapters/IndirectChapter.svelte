<script lang="ts">
  import IndirectCompareDemo from '../../demos/IndirectCompareDemo.svelte';
  import SkylightDemo from '../../demos/SkylightDemo.svelte';
  import Formula from '../../components/Formula.svelte';
  import KeyCard from '../../components/KeyCard.svelte';
</script>

<section>
  <h2>なぜ直接光だけでは足りないのか</h2>
  <p class="prereq">
    この章で使う数学:<a href="#/chapter/vectors">lerp(第3章)</a>、<a href="#/chapter/actors">法線 N(第4章)</a>
  </p>
  <p>
    ここまでは「ライトから面へ<strong>直接</strong>届く光」だけを計算してきました。でも現実の光は、
    壁や床、地面で<strong>跳ね返って、影の中にも回り込み</strong>ます。この回り込む光が
    <strong>間接光(インダイレクトライト)</strong>です。
  </p>
  <p>
    下のデモで「間接光を足す」のチェックを外してみてください。直接光だけだと、影の側が
    <strong>真っ黒でのっぺり</strong>します。チェックを入れると、ぐっと自然になります。
  </p>

  <IndirectCompareDemo />

  <h2>いちばんざっくりした間接光:アンビエント(環境光)</h2>
  <p>
    もっとも安上がりな間接光は、<strong>全体に一定の明るさをただ足すだけ</strong>の
    <strong>アンビエント(環境光)</strong>です。上のデモの「間接光の量」がまさにそれ。
    安くて簡単ですが、どの向きの面も同じ色になるので<strong>平面的</strong>、という限界があります。
  </p>

  <h2>ひと工夫:スカイライト(半球ライト)</h2>
  <p>
    そこで、少しだけ賢くします。<strong>上を向いた面には空の色</strong>を、
    <strong>下を向いた面には地面の照り返しの色</strong>を乗せる——これが<strong>スカイライト
    (半球ライト)</strong>です。式はこれだけ:
  </p>
  <Formula tex={'\\text{環境光} = \\text{lerp}(\\text{地面色},\\ \\text{空色},\\ \\ \\tfrac{N_y + 1}{2})'} />
  <p>
    <code>N.y</code> は面の向き(法線)の縦成分。上向きなら +1、下向きなら −1。それを 0〜1 に直して、
    第3章の <strong>lerp(2色を混ぜる)</strong> に渡しているだけです。第4章の法線 N が、ここで再び活躍します。
  </p>

  <SkylightDemo />

  <KeyCard title="ここだけ押さえればOK">
    <p>・直接光だけだと影が真っ黒でのっぺり。<strong>間接光</strong>で影の中が満たされる。</p>
    <p>・<strong>アンビエント</strong>=一定の明るさを足すだけ。安いが平面的。</p>
    <p>・<strong>スカイライト</strong>=上に空色、下に地面色。<code>N.y</code> で lerp するだけで立体感が出る。</p>
  </KeyCard>

  <h2>なぜレイトレーシングを使わないのか</h2>
  <p>
    「跳ね返る光を厳密に計算するなら、光線を全方向に飛ばせばいいのでは?」——それが
    <strong>レイトレーシング</strong>です。物理的には正確ですが、リアルタイム(1秒に60回描く)には
    <strong>重すぎる</strong>ことが多い。そこでゲームでは、<strong>事前に計算した近似</strong>で
    「それっぽく」済ませます。スカイライトはその第一歩。
  </p>
  <p>
    次の第10章では、動くキャラクターにも周囲の間接光を安く適用する定番技術——
    <strong>ライトプローブと SH(球面調和関数)</strong>を扱います。そこでは
    「<strong>全方向の光を数個の数字に要約する</strong>」という、この章の続きの発想が出てきます。
  </p>
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
</style>
