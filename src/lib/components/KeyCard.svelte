<script lang="ts">
  // 要点カード。各節の「ここだけ押さえればOK」をまとめる箱。
  interface Props {
    title?: string;
    icon?: string;
    children?: import('svelte').Snippet;
  }
  let { title = 'ここが要点', icon = '💡', children }: Props = $props();
</script>

<aside class="keycard">
  <div class="head">
    <span class="icon">{icon}</span>
    <span class="title">{title}</span>
  </div>
  <div class="body">
    {@render children?.()}
  </div>
</aside>

<style>
  .keycard {
    border: 1px solid var(--border-strong);
    border-left: 4px solid var(--accent);
    background: linear-gradient(180deg, var(--bg-2), var(--bg-1));
    border-radius: var(--radius-sm);
    padding: 0.9rem 1.1rem;
    margin: 1.4rem 0;
  }
  .head {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: 700;
    margin-bottom: 0.4rem;
    color: var(--accent);
  }
  .body :global(p) {
    margin: 0.3rem 0;
    color: var(--text-1);
  }
</style>
