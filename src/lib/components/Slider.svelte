<script lang="ts">
  // 共通パラメータスライダー。
  // - 値・範囲・現在値を表示
  // - ダブルクリックで初期値(reset)に戻る
  // - キーボード操作は input[type=range] 標準で可能
  interface Props {
    label: string;
    value: number;
    min: number;
    max: number;
    step?: number;
    reset?: number;
    unit?: string;
    digits?: number;
    accent?: string;
  }

  let {
    label,
    value = $bindable(),
    min,
    max,
    step = 0.01,
    reset,
    unit = '',
    digits = 2,
    accent = 'var(--accent-2)',
  }: Props = $props();

  function onDblClick() {
    if (reset !== undefined) value = reset;
  }

  const display = $derived(
    Number.isInteger(step) ? value.toFixed(0) : value.toFixed(digits)
  );
</script>

<div class="slider" style="--slider-accent:{accent}">
  <div class="row">
    <label for={'sld-' + label}>{label}</label>
    <output>{display}{unit}</output>
  </div>
  <input
    id={'sld-' + label}
    type="range"
    {min}
    {max}
    {step}
    bind:value
    ondblclick={onDblClick}
    title={reset !== undefined ? 'ダブルクリックで初期値に戻す' : ''}
  />
</div>

<style>
  .slider {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
    margin: 0.6rem 0;
  }
  .row {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
  }
  label {
    font-size: 0.9rem;
    color: var(--text-1);
  }
  output {
    font-family: var(--font-mono);
    font-size: 0.95rem;
    color: var(--slider-accent);
    font-variant-numeric: tabular-nums;
  }
  input[type='range'] {
    -webkit-appearance: none;
    appearance: none;
    width: 100%;
    height: 6px;
    border-radius: 999px;
    background: var(--bg-3);
    outline: none;
    cursor: pointer;
  }
  input[type='range']::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: var(--slider-accent);
    border: 2px solid var(--bg-0);
    box-shadow: 0 0 0 1px var(--slider-accent);
  }
  input[type='range']::-moz-range-thumb {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: var(--slider-accent);
    border: 2px solid var(--bg-0);
  }
  input[type='range']:focus-visible {
    box-shadow: 0 0 0 3px rgba(111, 179, 255, 0.4);
  }
</style>
