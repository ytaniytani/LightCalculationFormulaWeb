<script lang="ts">
  import SpecularDemo from '../../demos/SpecularDemo.svelte';
  import Formula from '../../components/Formula.svelte';
  import KeyCard from '../../components/KeyCard.svelte';
</script>

<section>
  <h2>鏡面反射(スペキュラー):つるっとした「てかり」の正体</h2>
  <p class="prereq">
    この章で使う数学:<a href="#/chapter/curves">pow(第2章)</a>、<a href="#/chapter/vectors">内積(第3章)</a>、<a href="#/chapter/actors">R・H(第4章)</a>
  </p>
  <p>
    前章の拡散反射(Lambert)は「光をまんべんなく散らす」ざらざら面でした。今度は、
    プラスチックや金属のように<strong>特定の方向へ強く跳ね返す</strong>てかり——
    <strong>鏡面反射(スペキュラー)</strong>です。ハイライト(光の点)が見える、あれです。
  </p>

  <h3>Phong:反射方向 R と視線 V を比べる</h3>
  <p>
    いちばん古典的な Phong の考え方はシンプル。「ライトが<strong>鏡のように跳ね返った向き R</strong>」と
    「<strong>目のある向き V</strong>」が一致するほど、強いてかりが見える、というものです。
  </p>
  <Formula tex={'\\text{てかり} = \\max(0,\\ \\mathbf{R}\\cdot\\mathbf{V})^{\\,\\text{shininess}}'} />
  <p>
    <code>R·V</code> は第3章の内積(向きの一致度)。それを <code>pow(…, shininess)</code> で
    <strong>鋭く絞る</strong>と、点のようなハイライトになります。ここで第2章の pow が効いてきます。
  </p>

  <h3>Blinn-Phong:ハーフベクトル H を使う改良版</h3>
  <p>
    Blinn-Phong は、R の代わりに<strong>ハーフベクトル H</strong>(L と V の中間・第4章)を使います。
    面の法線 N と H が近いほど、てかる、という考え方です。
  </p>
  <Formula tex={'\\text{てかり} = \\max(0,\\ \\mathbf{N}\\cdot\\mathbf{H})^{\\,\\text{shininess}}'} />
  <p>
    R を毎回作るより計算が軽く、見た目も自然(とくに浅い角度で)なので、ゲームでは
    Blinn-Phong が長く定番でした。この H を使う発想は、のちの PBR(第8章)にもそのまま受け継がれます。
  </p>

  <p>
    下のデモで <strong>shininess</strong> を動かして、ハイライトが絞られていくのを見てください。
    Blinn と Phong を切り替えて、同じ設定でもてかりの大きさが少し違うことも確かめられます。
  </p>

  <SpecularDemo />

  <KeyCard title="ここだけ押さえればOK">
    <p>・てかり = 「一致度の内積」を <code>pow</code> で<strong>鋭く絞った</strong>もの。</p>
    <p>・Phong は <code>R·V</code>、Blinn-Phong は <code>N·H</code>。H を使うほうが軽くて自然。</p>
    <p>・shininess が大きい = てかりが小さく強い。第2章の pow の話そのもの。</p>
  </KeyCard>

  <details>
    <summary>もっと知りたい人へ:なぜ Blinn のほうが「正しく」見えるのか</summary>
    <p>
      光をすれすれの角度(グレージング)で見ると、Phong はハイライトが不自然に途切れがちですが、
      Blinn-Phong は横に伸びた楕円状のハイライトになり、実測にも近いことが知られています。
      PBR ではこの「H と N の関係でハイライト形状を決める」考え方を、物理的に整えた
      <strong>GGX 分布</strong>(第8章の D 項)へと発展させます。
    </p>
  </details>
</section>

<style>
  h2 {
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
