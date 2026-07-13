<script lang="ts">
  import DotProductDemo from '../../demos/DotProductDemo.svelte';
  import Formula from '../../components/Formula.svelte';
  import KeyCard from '../../components/KeyCard.svelte';
</script>

<section>
  <h2>内積(dot):2つの矢印が「どれだけ同じ向きか」</h2>
  <p>
    このサイトで<strong>いちばん大事な道具</strong>が内積です。むずかしい話は抜きにして、まずは
    「<strong>2本の矢印が、どれだけ同じ方向を向いているかを 1つの数字にしたもの</strong>」だと思ってください。
  </p>

  <ul class="facts">
    <li>2本が<strong>同じ向き</strong> → 内積は <strong style="color:var(--accent-3)">1</strong></li>
    <li>2本が<strong>直角(90°)</strong> → 内積は <strong>0</strong></li>
    <li>2本が<strong>反対向き</strong> → 内積は <strong style="color:var(--danger)">-1</strong></li>
  </ul>

  <p>下のデモで、青い矢印 <strong>N</strong> と黄色い矢印 <strong>L</strong> の先をドラッグしてみてください。角度と内積の数字がどう変わるか、体で覚えるのが目標です。</p>

  <DotProductDemo />

  <h3>式の読み方</h3>
  <p>成分(x, y)で書くと、内積はたったこれだけ。かけ算して足すだけです。</p>
  <Formula tex={'\\mathbf{N}\\cdot\\mathbf{L} = N_x L_x + N_y L_y'} />
  <p>
    そして、2本の矢印の長さを1にそろえておく(=<strong>正規化</strong>する)と、内積はちょうど
    「なす角のコサイン」になります。角度の話(第2章)とここでつながります。
  </p>
  <Formula tex={'\\mathbf{N}\\cdot\\mathbf{L} = \\cos\\theta \\quad (\\text{長さが1のとき})'} />

  <KeyCard title="つまずいたらここに戻る">
    <p>内積は「向きの一致度メーター(-1〜1)」。</p>
    <p>次の章で出てくる明るさの計算は、これの <code>max(0, ...)</code> を取るだけです。</p>
  </KeyCard>
</section>

<style>
  h2 {
    margin-top: 0;
  }
  .facts {
    list-style: none;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
    color: var(--text-1);
  }
  .facts li {
    background: var(--bg-2);
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    padding: 0.4rem 0.8rem;
  }
</style>
