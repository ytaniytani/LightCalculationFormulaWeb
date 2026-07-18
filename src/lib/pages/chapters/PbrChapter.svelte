<script lang="ts">
  import MetalRoughDemo from '../../demos/MetalRoughDemo.svelte';
  import FresnelDemo from '../../demos/FresnelDemo.svelte';
  import KeyCard from '../../components/KeyCard.svelte';
</script>

<section>
  <h2>PBR:なぜ「物理ベース」が主流になったのか</h2>
  <p class="prereq">
    この章で使う数学:<a href="#/chapter/curves">pow(第2章)</a>、<a href="#/chapter/vectors">内積・lerp(第3章)</a>
  </p>
  <p>
    <strong>PBR(Physically Based Rendering / 物理ベースレンダリング)</strong>とは、
    「<strong>できるだけ現実の光の振る舞いに沿って</strong>反射を計算しよう」という考え方です。
    昔は職人が material ごとに手作業で数字を調整していましたが、それだと照明が変わると破綻しました。
    PBR では<strong>物理のルールを守る</strong>ので、どんな照明に置いても自然に見えます。
  </p>

  <h3>柱その1:エネルギー保存則</h3>
  <p>
    いちばん大事なルールは「<strong>入ってきた光より多くの光は返せない</strong>」。当たり前ですが、
    昔の式はこれを破って“盛れて”しまうことがありました。PBR では拡散と鏡面が予算を奪い合い、
    合計が1を超えないように作ります。だから金属(反射が強い)は拡散色を持たないのです。
  </p>

  <h3>柱その2:マイクロファセット(微小な鏡の集まり)</h3>
  <p>
    表面を拡大すると、無数の<strong>小さな鏡(マイクロファセット)</strong>が向きバラバラに並んでいる、
    と考えます。鏡たちの向きが<strong>そろっている</strong>とハイライトは鋭く(つるつる)、
    <strong>バラバラ</strong>だとハイライトはぼやけて広がります(ざらざら)。
    この「そろい具合」を1つの数字にしたのが <strong>ラフネス(ざらつき)</strong>です。
  </p>

  <h3>柱その3:メタリック/ラフネス ワークフロー</h3>
  <p>
    現代のPBRは、材質をたった2つのツマミで表すのが主流です:
  </p>
  <ul>
    <li><strong>メタリック</strong>:金属か、そうでないか(0〜1)。</li>
    <li><strong>ラフネス</strong>:表面がざらざらか、つるつるか(0〜1)。</li>
  </ul>
  <p>下のデモで、この2つだけでどれだけ多彩な材質が作れるかを試してください。</p>

  <MetalRoughDemo />

  <h2>柱その4:フレネル ——「すれすれは鏡」</h2>
  <p>
    もうひとつ、現実の反射には大事なクセがあります。<strong>浅い角度(すれすれ)から見るほど、
    反射が強くなる</strong>——これが<strong>フレネル</strong>です。水面を真上から見ると底が見え、
    遠くの水面は空を映して鏡になる、あの現象です。
  </p>
  <p>
    これを軽い式で近似したのが <strong>Schlick 近似</strong>。<code>F0</code>(正面での反射率)を起点に、
    角度が浅くなるほど1(完全な鏡)へ向かって持ち上がります。
  </p>

  <FresnelDemo />

  <KeyCard title="ここだけ押さえればOK">
    <p>・PBR = <strong>物理のルール(エネルギー保存)を守って</strong>反射を計算する考え方。</p>
    <p>・表面は<strong>小さな鏡の集まり</strong>。そのそろい具合が<strong>ラフネス</strong>。</p>
    <p>・材質は<strong>メタリック</strong>と<strong>ラフネス</strong>の2ツマミでほぼ表せる。</p>
    <p>・<strong>フレネル</strong>=すれすれの角度ほど反射が強い。F0 は正面の反射率(非金属≈0.04)。</p>
  </KeyCard>

  <p class="next">
    ここまでの「マイクロファセット」「フレネル」「エネルギー保存」を1本の式にまとめたのが、
    次章の <a href="#/chapter/brdf">Cook-Torrance BRDF</a> です。
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
  ul {
    color: var(--text-1);
  }
  li {
    margin: 0.3rem 0;
  }
  .next {
    margin-top: 1.5rem;
  }
</style>
