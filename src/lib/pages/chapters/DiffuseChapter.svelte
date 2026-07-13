<script lang="ts">
  import LambertSphereDemo from '../../demos/LambertSphereDemo.svelte';
  import Formula from '../../components/Formula.svelte';
  import KeyCard from '../../components/KeyCard.svelte';
</script>

<section>
  <h2>拡散反射(Lambert):面が光に正対するほど明るい</h2>
  <p class="prereq">
    この章で使う数学:<a href="#/chapter/vectors">内積(第3章)</a>
  </p>

  <p>
    ざらざらした面(紙・石・木など)は、当たった光をあらゆる方向へまんべんなく散らします。これを
    <strong>拡散反射(ディフューズ)</strong>と呼びます。その明るさは、驚くほど簡単な式で決まります。
  </p>

  <Formula tex={'\\text{明るさ} = \\max(0,\\ \\mathbf{N}\\cdot\\mathbf{L})'} />

  <p>
    <strong>N</strong> は面の向き(法線)、<strong>L</strong> はライトの方向。前の章でやった<strong>内積</strong>そのものです。
    面が光に正面から向き合っているほど内積は 1 に近づき、明るくなります。横を向くと 0、裏を向くとマイナス
    ですが、「裏が光る」のはおかしいので <code>max(0, …)</code> で<strong>マイナスは0に切り捨て</strong>ます。
  </p>

  <p>
    下の3Dプレビューで、<strong>ライトの方位・仰角</strong>を動かしてみてください。球面のどこが明るくなるかが、
    内積の値そのままだと分かります。モデルを箱・筒・板に切り替えたり、ドラッグで回すこともできます。
  </p>

  <LambertSphereDemo />

  <KeyCard title="ここだけ押さえればOK">
    <p>・拡散反射の明るさ = <code>max(0, dot(N, L))</code>。内積を明るさに使っているだけ。</p>
    <p>・<strong>Half Lambert</strong> は影を柔らかく見せるための“絵作りの嘘”。物理的に正しくはないが、ゲームで多用される。</p>
    <p>・環境光(スカイライト)を少し足すと、影の中が真っ黒にならず自然になる。これは間接光の入口(第9章)。</p>
  </KeyCard>
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
</style>
