<script lang="ts">
  // 極小のハッシュルーター(#/ と #/chapter/:id)。
  import HomePage from './lib/pages/HomePage.svelte';
  import ChapterPage from './lib/pages/ChapterPage.svelte';

  let route = $state(parse(location.hash));

  function parse(hash: string): { name: 'home' } | { name: 'chapter'; id: string } {
    const m = hash.match(/^#\/chapter\/([\w-]+)/);
    if (m) return { name: 'chapter', id: m[1] };
    return { name: 'home' };
  }

  function onHashChange() {
    route = parse(location.hash);
    window.scrollTo(0, 0);
  }

  $effect(() => {
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  });
</script>

<main>
  {#if route.name === 'chapter'}
    {#key route.id}
      <ChapterPage id={route.id} />
    {/key}
  {:else}
    <HomePage />
  {/if}
</main>

<style>
  main {
    min-height: 100vh;
  }
</style>
