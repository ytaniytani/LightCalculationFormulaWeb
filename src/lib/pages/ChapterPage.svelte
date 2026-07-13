<script lang="ts">
  import { chapters, chapterById } from '../content/chapters';
  import DifficultyBadge from '../components/DifficultyBadge.svelte';
  import CurvesChapter from './chapters/CurvesChapter.svelte';
  import VectorsChapter from './chapters/VectorsChapter.svelte';
  import DiffuseChapter from './chapters/DiffuseChapter.svelte';

  let { id }: { id: string } = $props();

  const chapter = $derived(chapterById(id));

  // 実装済み章のコンテンツを id で解決
  const contentMap: Record<string, typeof CurvesChapter> = {
    curves: CurvesChapter,
    vectors: VectorsChapter,
    diffuse: DiffuseChapter,
  };
  const Content = $derived(contentMap[id]);

  // 前後の「実装済み」章へのナビ
  const readyList = chapters.filter((c) => c.status === 'ready');
  const idx = $derived(readyList.findIndex((c) => c.id === id));
  const prev = $derived(idx > 0 ? readyList[idx - 1] : undefined);
  const next = $derived(idx >= 0 && idx < readyList.length - 1 ? readyList[idx + 1] : undefined);
</script>

<div class="chapter">
  <header class="head">
    <a class="back" href="#/">← 学習マップ</a>
    {#if chapter}
      <div class="titlebar">
        <div>
          <span class="no">第{chapter.no}章</span>
          <h1>{chapter.title}</h1>
        </div>
        <DifficultyBadge level={chapter.difficulty} />
      </div>
    {/if}
  </header>

  <article>
    {#if Content}
      <Content />
    {:else}
      <div class="missing">
        <h2>この章はまだ準備中です</h2>
        <p>M1(基盤)では第2・3・5章の中核デモを先行実装しています。</p>
        <a href="#/">← 学習マップに戻る</a>
      </div>
    {/if}
  </article>

  <nav class="pager">
    {#if prev}
      <a href={'#/chapter/' + prev.id}>← 第{prev.no}章 {prev.title}</a>
    {:else}
      <span></span>
    {/if}
    {#if next}
      <a href={'#/chapter/' + next.id}>第{next.no}章 {next.title} →</a>
    {/if}
  </nav>
</div>

<style>
  .chapter {
    max-width: 820px;
    margin: 0 auto;
    padding: 1.5rem 1.2rem 4rem;
  }
  .back {
    font-size: 0.9rem;
    color: var(--text-2);
  }
  .titlebar {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    gap: 1rem;
    margin: 0.8rem 0 1.5rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid var(--border);
  }
  .no {
    font-family: var(--font-mono);
    color: var(--text-2);
    font-size: 0.85rem;
  }
  .titlebar h1 {
    margin: 0.2rem 0 0;
    font-size: 1.8rem;
  }
  article {
    font-size: 1.02rem;
  }
  article :global(p) {
    color: var(--text-1);
  }
  article :global(h2) {
    font-size: 1.4rem;
    margin-top: 2rem;
  }
  article :global(h3) {
    font-size: 1.15rem;
    margin-top: 1.8rem;
    color: var(--accent-2);
  }
  .missing {
    text-align: center;
    padding: 3rem 1rem;
    color: var(--text-2);
  }
  .pager {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    margin-top: 3rem;
    padding-top: 1.5rem;
    border-top: 1px solid var(--border);
  }
  .pager a {
    font-size: 0.92rem;
  }
</style>
