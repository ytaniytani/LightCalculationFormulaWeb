# ライト計算式ラボ（Light Calculation Formula Web）

ゲームのリアルタイムCGで使う **ライティング計算**（Lambert・スペキュラー・PBRのBRDF・間接光まで）を、
**中学数学から** スライダーを触りながら学べるインタラクティブ学習サイト。

数式は「読めればOK」。まず動かして、意味はあとから——という順で、数学が苦手な人でも一段ずつ登れる設計です。

## 現在の状態（M1: 基盤）

再利用コンポーネントと中核デモを先行実装しています。

- 学習マップ（トップページ）
- **第2章 カーブと角度** — べき乗 `y = xⁿ` のカーブをスライダーで変形（+微分・積分の直感）
- **第3章 ベクトル** — 内積 `dot(N, L)` を2本の矢印をドラッグして体感（本サイト最重要デモ）
- **第5章 拡散反射** — `max(0, dot(N, L))` をそのままGLSLで実装した3D Lambertプレビュー

全体の仕様は [`docs/SPEC.md`](docs/SPEC.md) を参照。

## 技術構成

- Vite + TypeScript + **Svelte 5**（runes）
- 3D: **Three.js** + カスタムGLSLシェーダー（教える式をそのままシェーダーに書く方針）
- 数式: **KaTeX**
- グラフ: Canvas 2D の自作軽量コンポーネント
- デザイン: ダークトーン基調
- ホスティング: GitHub Pages（`main` への push で自動デプロイ）

## 開発

```bash
npm install       # 依存インストール
npm run dev       # 開発サーバ（http://localhost:5173）
npm run build     # 型チェック + 本番ビルド（dist/）
npm run preview   # 本番ビルドのプレビュー
npm run check     # 型チェックのみ
```

## ディレクトリ構成

```
src/
├── App.svelte                 極小ハッシュルーター
├── app.css                    デザイントークン（ダークトーン）
├── lib/
│   ├── math/vec.ts            ベクトル/内積などの数学ヘルパー
│   ├── content/chapters.ts    学習マップ用の章メタデータ
│   ├── components/            Slider / Graph2D / Formula / KeyCard / DifficultyBadge
│   ├── demos/                 DotProduct / PowCurve / LambertSphere
│   ├── three/                 ShaderPreview（Three.js ラッパ）
│   └── pages/                 HomePage / ChapterPage / chapters/*
docs/SPEC.md                   仕様書
```
