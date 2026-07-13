<script lang="ts">
  import type { Difficulty } from '../content/chapters';

  let { level }: { level: Difficulty } = $props();

  const labels: Record<Difficulty, string> = {
    1: '中学数学の復習',
    2: 'ここで学ぶ数学',
    3: 'CGの応用',
  };
  const stars: Record<Difficulty, string> = {
    1: '★☆☆',
    2: '★★☆',
    3: '★★★',
  };
</script>

<span class="badge" data-level={level} title={labels[level]}>
  <span class="stars">{stars[level]}</span>
  <span class="label">{labels[level]}</span>
</span>

<style>
  .badge {
    display: inline-flex;
    align-items: center;
    gap: 0.4em;
    font-size: 0.78rem;
    padding: 0.15em 0.6em;
    border-radius: 999px;
    border: 1px solid var(--border-strong);
    background: var(--bg-2);
    white-space: nowrap;
  }
  .stars {
    letter-spacing: 0.05em;
  }
  .badge[data-level='1'] .stars {
    color: var(--accent-3);
  }
  .badge[data-level='2'] .stars {
    color: var(--accent-2);
  }
  .badge[data-level='3'] .stars {
    color: var(--accent);
  }
  .label {
    color: var(--text-2);
  }
</style>
