import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

// GitHub Pages ではリポジトリ名がサブパスになるため、本番ビルドのみ base を付ける。
// 例: https://<user>.github.io/LightCalculationFormulaWeb/
export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? '/LightCalculationFormulaWeb/' : '/',
  plugins: [svelte()],
  build: {
    // 重い依存を別チャンクに分け、キャッシュ効率と初回ロードを改善する
    rollupOptions: {
      output: {
        manualChunks: {
          three: ['three'],
          katex: ['katex'],
        },
      },
    },
  },
}));
