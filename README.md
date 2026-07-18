# ライト計算式ラボ（Light Calculation Formula Web）

ゲームのリアルタイムCGで使う **ライティング計算**（Lambert・スペキュラー・PBRのBRDF・間接光まで）を、
**中学数学から** スライダーを触りながら学べるインタラクティブ学習サイト。

数式は「読めればOK」。まず動かして、意味はあとから——という順で、数学が苦手な人でも一段ずつ登れる設計です。

## 現在の状態（全12章 公開）

第0〜11章を通しで公開しています。数の復習から直接光（Lambert・スペキュラー・PBR/BRDF）、
間接光（スカイライト・SH）まで、スライダーと3Dプレビューで触りながら学べます。

**準備（数学）**
- **第0章 イントロダクション** — ゴールのPBR球を先に見る／サイトの歩き方
- **第1章 数のきほん復習** — 0〜1の明るさ、関数=入力→出力の箱
- **第2章 カーブと角度** — べき乗 `y = xⁿ`（+微分・積分の直感）
- **第3章 ベクトル** — 内積 `dot(N, L)` を矢印ドラッグで体感（最重要デモ）

**直接光**
- **第4章 ライティングの登場人物** — N/L/V/H/R の3D矢印、ライトの減衰
- **第5章 拡散反射** — `max(0, dot(N, L))` の3D Lambert
- **第6章 鏡面反射** — Phong / Blinn-Phong と shininess
- **第7章 PBRの考え方** — メタリック/ラフネス、フレネル
- **第8章 BRDFとCook-Torrance** — BRDFの定義、D/F/G 個別可視化

**間接光**
- **第9章 間接光 入門** — 直接光のみ／間接光ありの比較、スカイライト
- **第10章 ライトプローブとSH** — 周囲光を数個の係数に要約するSHの直感

**発展**
- **第11章 発展** — スペキュラIBL・トーンマッピング・影などの概念地図

全体の仕様は [`docs/SPEC.md`](docs/SPEC.md) を参照。

3Dプレビューの中核は、教える式をそのままGLSLに書いた共有 PBR シェーダー
（[`src/lib/three/pbr.ts`](src/lib/three/pbr.ts)）。Cook-Torrance の直接光 + 半球ライトの間接光を、
第0・7・8・9章で uniform を変えて共有しています。

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
