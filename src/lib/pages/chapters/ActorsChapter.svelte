<script lang="ts">
  import ActorsVectorDemo from '../../demos/ActorsVectorDemo.svelte';
  import AttenuationDemo from '../../demos/AttenuationDemo.svelte';
  import Formula from '../../components/Formula.svelte';
  import KeyCard from '../../components/KeyCard.svelte';
</script>

<section>
  <h2>ライティングの「登場人物」を覚える</h2>
  <p class="prereq">
    この章で使う数学:<a href="#/chapter/vectors">ベクトル・内積(第3章)</a>
  </p>
  <p>
    ここから先の式には、いつも同じ<strong>矢印(ベクトル)</strong>たちが出てきます。
    先に顔ぶれを覚えてしまえば、あとの式は「この矢印とこの矢印の内積か」と読めるようになります。
    全部、面の上の1点から生えている矢印です。
  </p>

  <ul class="cast">
    <li><b style="color:#6fb3ff">N</b>(Normal / 法線)= その面が<strong>どっちを向いているか</strong>。面に垂直な矢印。</li>
    <li><b style="color:#ffcc66">L</b>(Light)= その点から見て<strong>ライトのある方向</strong>。</li>
    <li><b style="color:#7ee0b0">V</b>(View)= その点から見て<strong>カメラ(目)のある方向</strong>。</li>
    <li><b style="color:#c59bff">H</b>(Half)= <strong>L と V のちょうど中間</strong>の向き。第6章のスペキュラーで活躍。</li>
    <li><b style="color:#ff9a5a">R</b>(Reflect)= L が面で<strong>跳ね返った</strong>向き。鏡の反射。</li>
  </ul>

  <p>
    下の3Dデモで、ライトを動かしてみてください。<b style="color:#c59bff">H</b> は L と V の間に、
    <b style="color:#ff9a5a">R</b> は鏡のように反対側に、それぞれ自動でついてきます。
    チェックボックスで矢印を絞ると見やすくなります。
  </p>

  <ActorsVectorDemo />

  <h3>H と R は「作る」もの</h3>
  <p>
    N・L・V は入力として与えられますが、H と R はそこから<strong>計算で作ります</strong>。
    どちらも前章までの道具(足し算・正規化・内積)だけでできています。
  </p>
  <Formula tex={'\\mathbf{H} = \\text{正規化}(\\mathbf{L} + \\mathbf{V})'} />
  <Formula tex={'\\mathbf{R} = 2(\\mathbf{N}\\cdot\\mathbf{L})\\,\\mathbf{N} - \\mathbf{L}'} />
  <p>
    R の式は少しゴツく見えますが、意味は「鏡で跳ね返した向き」だけ。式は読めればOKで、暗記は不要です。
  </p>

  <h2>ライトの種類と、距離による減衰</h2>
  <p>
    ライトにはいくつか種類があります。よく使うのは3つ:
  </p>
  <ul class="cast">
    <li><strong>ディレクショナル</strong>=太陽のような平行光。向きだけを持ち、距離で暗くならない。</li>
    <li><strong>ポイント</strong>=電球のように一点から全方向へ。距離が離れると暗くなる。</li>
    <li><strong>スポット</strong>=懐中電灯のように円錐状に絞った光。</li>
  </ul>
  <p>
    ポイントライトの「距離が離れると暗くなる」具合は、下のカーブで体感できます。
  </p>

  <AttenuationDemo />

  <KeyCard title="ここだけ押さえればOK">
    <p>・登場人物は <b style="color:#6fb3ff">N</b>・<b style="color:#ffcc66">L</b>・<b style="color:#7ee0b0">V</b>・<b style="color:#c59bff">H</b>・<b style="color:#ff9a5a">R</b> の5本の矢印。</p>
    <p>・H と R は N・L・V から作る。式は読めればOK。</p>
    <p>・ポイントライトは距離の<strong>2乗</strong>で暗くなる(逆2乗の法則)。太陽光は距離を気にしない。</p>
  </KeyCard>
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
  .cast {
    list-style: none;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
    color: var(--text-1);
  }
  .cast li {
    background: var(--bg-2);
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    padding: 0.45rem 0.8rem;
  }
  .cast b {
    font-family: var(--font-mono);
    margin-right: 0.3rem;
  }
</style>
