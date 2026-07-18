<script lang="ts">
  import GGXCurveDemo from '../../demos/GGXCurveDemo.svelte';
  import CookTorranceDemo from '../../demos/CookTorranceDemo.svelte';
  import Formula from '../../components/Formula.svelte';
  import KeyCard from '../../components/KeyCard.svelte';
</script>

<section>
  <h2>そもそも BRDF とは何か</h2>
  <p class="prereq">
    この章で使う数学:<a href="#/chapter/numbers">関数=箱(第1章)</a>、<a href="#/chapter/curves">積分・pow(第2章)</a>、<a href="#/chapter/vectors">内積(第3章)</a>
  </p>
  <p>
    名前がいかついので身構えますが、正体はシンプルです。BRDF は
    <strong>「光が入ってくる方向」と「こちらが見ている方向」の2つを入れると、
    その面が光を<u>どれだけの割合そっちへ跳ね返すか</u>を返す“関数(箱)”</strong>にすぎません。
    第1章でやった「入力→出力の箱」そのものです。
  </p>

  <div class="decode">
    <div><b>B</b>i-directional</div><div>双方向 = 入る方向と出る方向の2つ</div>
    <div><b>R</b>eflectance</div><div>反射率 = 跳ね返す割合</div>
    <div><b>D</b>istribution</div><div>分布 = 方向ごとの散らばり</div>
    <div><b>F</b>unction</div><div>関数 = 入れると出てくる箱</div>
  </div>

  <p>
    じつは、あなたはもう BRDF に出会っています。第5章の <strong>Lambert</strong> も、第6章の
    <strong>Phong</strong> も、簡単な BRDF の一種でした(どちらも「入射方向と視線方向から反射量を返す箱」)。
    PBR は、この箱を<strong>エネルギー保存などの物理ルールを守って</strong>作り直したものです。
  </p>

  <h3>面の明るさは「全方向の光 × BRDF」を足し合わせたもの</h3>
  <p>
    ある点の最終的な明るさは、「その点に届く<strong>あらゆる方向</strong>の光 × BRDF × cos(傾き)」を
    <strong>全部足し合わせた</strong>もの。この“全部足す”が第2章の<strong>積分</strong>(記号 ∫)です。
  </p>
  <Formula tex={'\\text{明るさ} = \\int_{\\text{全方向}} \\text{BRDF} \\times \\text{光} \\times \\cos\\theta \\; d\\omega'} />
  <p>
    直接光は「光源のある<strong>1方向ぶんだけ</strong>」足せばいいので簡単です。でも間接光は
    <strong>全方向</strong>を足すので大変——これが、のちの第9〜10章(スカイライト・SH)が
    「<strong>全方向の光を要約する</strong>」話になる理由の伏線です。式は読めればOK、
    「∫ は“ぜんぶ足す”の印」とだけ覚えておけば十分です。
  </p>

  <h2>Cook-Torrance:鏡面反射の設計図</h2>
  <p>
    その BRDF の“鏡面反射版”を物理ベースで設計した代表例が <strong>Cook-Torrance</strong> です。
    見た目はゴツいですが、3つの部品 <strong>D・F・G</strong> の掛け算を、明るさの帳尻を合わせる分母で
    割っているだけです。
  </p>
  <Formula tex={'f = \\dfrac{D \\cdot F \\cdot G}{4\\,(\\mathbf{N}\\cdot\\mathbf{V})\\,(\\mathbf{N}\\cdot\\mathbf{L})}'} />

  <h3>D(法線分布):ハイライトの形</h3>
  <p>
    第7章の「小さな鏡がどれだけ N の向きにそろっているか」を数字にしたのが <strong>D 項(GGX)</strong>。
    ラフネスで、ハイライトの鋭さ/広がりが決まります。
  </p>
  <GGXCurveDemo />

  <h3>F(フレネル):すれすれは鏡</h3>
  <p>
    第7章でやった<strong>フレネル</strong>そのもの。浅い角度ほど反射が強くなります。金属と非金属の違いは、
    正面での反射率 <code>F0</code> の高さに表れます(非金属 ≈ 0.04、金属 = 0.5〜1.0)。
  </p>

  <h3>G(幾何減衰):ざらざらは暗くなる</h3>
  <p>
    ざらざら面では、小さな鏡どうしが<strong>互いに影を落とし合い、光をさえぎり</strong>ます。
    それを表すのが <strong>G 項(Smith)</strong>。これが無いと、ざらざら面が不自然に明るくなりすぎます。
  </p>

  <h3>分母:明るさの帳尻合わせ</h3>
  <p>
    最後の <code>4·(N·V)·(N·L)</code> は、D・F・G を掛けた結果の<strong>明るさを正しい大きさに整える</strong>
    ための割り算(正規化)です。導出は追いません。「役割は帳尻合わせ」とだけ理解すればOKです。
  </p>

  <h2>D・F・G を合体させて確かめる</h2>
  <p>
    下のデモで、D・F・G を1つずつ ON/OFF してみてください。それぞれを切ると絵がどう崩れるかで、
    各項の“担当”が体感できます。
  </p>

  <CookTorranceDemo />

  <KeyCard title="つまずいたらここに戻る" icon="🧩">
    <p><strong>BRDF = 2方向を入れると反射率を返す箱</strong>。Lambert も Phong もその仲間。</p>
    <p>Cook-Torrance は <strong>D(形)× F(すれすれ)× G(遮蔽)÷ 帳尻合わせ</strong>。</p>
    <p>D・F・G の名前が思い出せなくなったら:「かたち・ふち・かげ」でOK。</p>
  </KeyCard>

  <details>
    <summary>もっと知りたい人へ:各項の正確な式</summary>
    <Formula tex={'D_{GGX} = \\dfrac{\\alpha^2}{\\pi\\big((\\mathbf{N}\\cdot\\mathbf{H})^2(\\alpha^2-1)+1\\big)^2}, \\quad \\alpha = \\text{roughness}^2'} />
    <Formula tex={'F_{Schlick} = F_0 + (1-F_0)(1-\\mathbf{V}\\cdot\\mathbf{H})^5'} />
    <Formula tex={'G_{Smith} = G_1(\\mathbf{N}\\cdot\\mathbf{V})\\,G_1(\\mathbf{N}\\cdot\\mathbf{L})'} />
    <p>このサイトの3Dデモは、まさにこの式をそのまま GLSL シェーダーに書いて描いています。</p>
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
  .decode {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 0.3rem 1rem;
    background: var(--bg-2);
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    padding: 0.8rem 1rem;
    margin: 1rem 0;
    font-size: 0.92rem;
    color: var(--text-1);
  }
  .decode b {
    color: var(--accent-2);
    font-family: var(--font-mono);
    font-size: 1.05rem;
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
