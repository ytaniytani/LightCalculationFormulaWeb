<script lang="ts">
  // KaTeX で数式を表示する薄いラッパ。
  import katex from 'katex';

  interface Props {
    tex: string;
    display?: boolean;
  }
  let { tex, display = true }: Props = $props();

  const html = $derived(
    katex.renderToString(tex, {
      displayMode: display,
      throwOnError: false,
    })
  );
</script>

<!-- eslint-disable-next-line svelte/no-at-html-tags -->
<div class="formula" class:block={display}>{@html html}</div>

<style>
  .formula {
    overflow-x: auto;
    overflow-y: hidden;
    max-width: 100%;
  }
  .formula.block {
    padding: 0.6rem 0.2rem;
    text-align: center;
  }
</style>
