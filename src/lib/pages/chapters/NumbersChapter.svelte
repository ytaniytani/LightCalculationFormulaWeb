<script lang="ts">
  import BrightnessDemo from '../../demos/BrightnessDemo.svelte';
  import FunctionBoxDemo from '../../demos/FunctionBoxDemo.svelte';
  import Formula from '../../components/Formula.svelte';
  import KeyCard from '../../components/KeyCard.svelte';
</script>

<section>
  <p class="skip">
    💡 中学数学がだいたい思い出せる人は、この章は<strong>飛ばしてOK</strong>です。
    「関数って何だっけ?」という人だけ、ゆっくり読んでください。
  </p>

  <h2>1. 0〜1の世界 — 明るさは「割合」で表す</h2>
  <p>
    CGでは、明るさも色も <strong>0(なし)〜1(最大)</strong> の数字で表します。
    0.5 なら 50%、つまり「半分の明るさ」。テストの点数を100点満点で言うか、割合で言うかの違いだけです。
  </p>

  <BrightnessDemo />

  <KeyCard title="ここだけ押さえればOK">
    <p>・CGの明るさ・色は <strong>0〜1</strong>。0=真っ黒、1=最大、0.5=半分。</p>
    <p>・「%を100で割った値」と同じ。難しく考えなくて大丈夫。</p>
  </KeyCard>

  <h2>2. マイナスの数 — 「反対向き」の道具</h2>
  <p>
    温度計の -3℃ のように、マイナスは「<strong>反対側</strong>」を表す道具です。CGでは、
    のちほど<strong>ベクトル(矢印)</strong>の向きや、<strong>内積</strong>の「反対を向いている」を
    表すときに、この「反対向き=マイナス」がそのまま効いてきます(第3章)。
  </p>

  <h2>3. 座標とグラフ — 横を入れると縦が出てくる</h2>
  <p>
    方眼紙の点は <Formula tex={'(x,\\ y)'} display={false} /> の2つの数字で位置が決まります。
    グラフは「横軸(x)にある値を入れると、縦軸(y)の値が返ってくる」しくみを絵にしたもの。
    このサイトのグラフは、ほぼ全部この読み方で読めます。
  </p>

  <h2>4. 関数 = 入力→出力の箱(いちばん大事)</h2>
  <p>
    「関数」という言葉に身構える必要はありません。正体は
    <strong>「値を入れると値が返ってくる機械(箱)」</strong>です。
    たとえば <Formula tex={'y = 2x'} display={false} /> は「入れた数を2倍して返す箱」。
  </p>

  <FunctionBoxDemo />

  <KeyCard title="つまずいたらここに戻る" icon="🧰">
    <p>このあと出てくる式は、どれも「何かを入れると、明るさや反射の割合が返ってくる箱」です。</p>
    <p><strong>関数=箱</strong>。この一言さえ握っておけば、記号が増えても迷子になりません。</p>
  </KeyCard>

  <h2>5. 直角三角形と斜めの長さ(三平方の定理)</h2>
  <p>
    最後にひとつだけ。直角三角形で、タテとヨコの長さが分かると<strong>斜めの長さ</strong>が計算できます。
  </p>
  <Formula tex={'(\\text{斜め})^2 = (\\text{タテ})^2 + (\\text{ヨコ})^2'} />
  <p>
    これは第3章で「<strong>ベクトル(矢印)の長さ</strong>」を測るときに、そのまま再利用します。
    いまは「斜めの長さも計算できるんだったな」と思い出せれば十分です。
  </p>
</section>

<style>
  h2 {
    margin-top: 2.2rem;
  }
  h2:first-of-type {
    margin-top: 0.5rem;
  }
  .skip {
    font-size: 0.9rem;
    color: var(--text-1);
    background: var(--bg-2);
    border: 1px dashed var(--border-strong);
    border-radius: var(--radius-sm);
    padding: 0.6rem 0.9rem;
  }
</style>
