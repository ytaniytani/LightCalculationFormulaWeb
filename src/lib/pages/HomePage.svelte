<script lang="ts">
  import { chapters, type Chapter } from '../content/chapters';
  import DifficultyBadge from '../components/DifficultyBadge.svelte';

  const groups: Chapter['group'][] = ['準備(数学)', '直接光', '間接光', '光の単位', '発展'];
  const groupInfo: Record<Chapter['group'], { icon: string; desc: string }> = {
    '準備(数学)': { icon: '🧮', desc: '中学数学から。関数・カーブ・ベクトル・内積をゼロから。' },
    直接光: { icon: '💡', desc: 'ライトから直接届く光の反射。Lambert から PBR の BRDF まで。' },
    間接光: { icon: '🌤️', desc: '跳ね返って回り込む光。スカイライトと SH ライトプローブ。' },
    光の単位: { icon: '📏', desc: 'ルーメン・カンデラ・ルクス・ニット・ケルビン。現実の光の測り方。' },
    発展: { icon: '🚀', desc: 'スペキュラIBL・トーンマッピング・影の基礎など。' },
  };

  function byGroup(g: Chapter['group']) {
    return chapters.filter((c) => c.group === g);
  }
</script>

<div class="home">
  <header class="hero">
    <h1>ライト計算式ラボ</h1>
    <p class="lead">
      ゲームのリアルタイムCGで使う<strong>ライティング計算</strong>を、<strong>中学数学から</strong>、
      スライダーを触りながら学ぶサイト。数式は「読めればOK」。まず動かして、意味は後から。
    </p>
    <p class="note">
      🌙 数学が苦手でも大丈夫。★☆☆(中学の復習)→ ★★☆(ここで学ぶ数学)→ ★★★(CGの応用)の
      順に、一段ずつ登ります。<strong>「わかる」ところは飛ばしてOK</strong>。
    </p>
  </header>

  {#each groups as g}
    <section class="group">
      <div class="group-head">
        <span class="g-icon">{groupInfo[g].icon}</span>
        <div>
          <h2>{g}</h2>
          <p>{groupInfo[g].desc}</p>
        </div>
      </div>
      <div class="cards">
        {#each byGroup(g) as ch}
          {#if ch.status === 'ready'}
            <a class="card ready" href={'#/chapter/' + ch.id}>
              <div class="card-top">
                <span class="no">第{ch.no}章</span>
                <DifficultyBadge level={ch.difficulty} />
              </div>
              <h3>{ch.title}</h3>
              <p>{ch.summary}</p>
              <span class="cta">触ってみる →</span>
            </a>
          {:else}
            <div class="card planned" aria-disabled="true">
              <div class="card-top">
                <span class="no">第{ch.no}章</span>
                <DifficultyBadge level={ch.difficulty} />
              </div>
              <h3>{ch.title}</h3>
              <p>{ch.summary}</p>
              <span class="cta soon">準備中</span>
            </div>
          {/if}
        {/each}
      </div>
    </section>
  {/each}

  <footer class="foot">
    <p>
      全12章(第0〜11章)を公開中。数の復習から Lambert・スペキュラー・PBR/BRDF、
      間接光(スカイライト・SH)まで、通しで触れます。仕様は <code>docs/SPEC.md</code> を参照。
    </p>
  </footer>
</div>

<style>
  .home {
    max-width: 1040px;
    margin: 0 auto;
    padding: 2rem 1.2rem 4rem;
  }
  .hero {
    padding: 2rem 0 1rem;
    border-bottom: 1px solid var(--border);
    margin-bottom: 2rem;
  }
  .hero h1 {
    font-size: clamp(2rem, 5vw, 3rem);
    margin: 0 0 0.6rem;
    background: linear-gradient(90deg, var(--accent), var(--accent-2));
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }
  .lead {
    font-size: 1.15rem;
    color: var(--text-0);
    max-width: 60ch;
  }
  .note {
    color: var(--text-2);
    font-size: 0.95rem;
    max-width: 60ch;
  }
  .group {
    margin-bottom: 2.4rem;
  }
  .group-head {
    display: flex;
    gap: 0.8rem;
    align-items: center;
    margin-bottom: 1rem;
  }
  .g-icon {
    font-size: 1.8rem;
  }
  .group-head h2 {
    margin: 0;
    font-size: 1.3rem;
  }
  .group-head p {
    margin: 0.1rem 0 0;
    color: var(--text-2);
    font-size: 0.9rem;
  }
  .cards {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 1rem;
  }
  .card {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    background: var(--bg-1);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 1rem;
    color: inherit;
    text-decoration: none;
    transition: transform 0.12s ease, border-color 0.12s ease;
  }
  .card.ready:hover {
    transform: translateY(-3px);
    border-color: var(--accent-2);
    text-decoration: none;
  }
  .card.planned {
    opacity: 0.55;
  }
  .card-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 0.5rem;
  }
  .no {
    font-size: 0.8rem;
    color: var(--text-2);
    font-family: var(--font-mono);
  }
  .card h3 {
    margin: 0.2rem 0;
    font-size: 1.1rem;
  }
  .card p {
    margin: 0;
    font-size: 0.9rem;
    color: var(--text-1);
    flex: 1;
  }
  .cta {
    font-size: 0.85rem;
    color: var(--accent-2);
    font-weight: 700;
    margin-top: 0.3rem;
  }
  .cta.soon {
    color: var(--text-2);
  }
  .foot {
    margin-top: 2rem;
    padding-top: 1.5rem;
    border-top: 1px solid var(--border);
    color: var(--text-2);
    font-size: 0.9rem;
  }
</style>
