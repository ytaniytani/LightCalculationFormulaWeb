// 学習マップ用の章メタデータ。仕様書(docs/SPEC.md)の目次と対応。
// difficulty: 1=★☆☆(中学数学復習) 2=★★☆(このサイトで学ぶ数学) 3=★★★(CG応用)
// status: 'ready'=実装済み(リンク可能) / 'planned'=予定(未実装)

export type Difficulty = 1 | 2 | 3;

export interface Chapter {
  id: string;
  no: number;
  title: string;
  summary: string;
  difficulty: Difficulty;
  group: '準備(数学)' | '直接光' | '間接光' | '発展';
  status: 'ready' | 'planned';
}

export const chapters: Chapter[] = [
  {
    id: 'intro',
    no: 0,
    title: 'イントロダクション',
    summary: 'ライティングとは「光がどう跳ね返って目に届くか」の計算。ゴールの絵を先に見る。',
    difficulty: 1,
    group: '準備(数学)',
    status: 'ready',
  },
  {
    id: 'numbers',
    no: 1,
    title: '数のきほん復習',
    summary: '0〜1の明るさ、マイナス、座標、グラフの読み方、関数=入力→出力の箱。',
    difficulty: 1,
    group: '準備(数学)',
    status: 'ready',
  },
  {
    id: 'curves',
    no: 2,
    title: 'カーブと角度',
    summary: 'べき乗(pow)でカーブが鋭くなる感覚、sin/cos、微分・積分の直感。',
    difficulty: 2,
    group: '準備(数学)',
    status: 'ready',
  },
  {
    id: 'vectors',
    no: 3,
    title: 'ベクトル',
    summary: '向きと長さの矢印、正規化、そして本サイト最重要の内積(dot)。',
    difficulty: 2,
    group: '準備(数学)',
    status: 'ready',
  },
  {
    id: 'actors',
    no: 4,
    title: 'ライティングの登場人物',
    summary: '法線N・ライトL・視線V・ハーフH・反射R。ライトの種類と減衰。',
    difficulty: 3,
    group: '直接光',
    status: 'ready',
  },
  {
    id: 'diffuse',
    no: 5,
    title: '拡散反射(Diffuse)',
    summary: 'Lambert = max(0, dot(N, L))。面が光に正対するほど明るい。',
    difficulty: 3,
    group: '直接光',
    status: 'ready',
  },
  {
    id: 'specular',
    no: 6,
    title: '鏡面反射(Specular)',
    summary: 'Phong / Blinn-Phong。ハイライトが絞られる仕組み。',
    difficulty: 3,
    group: '直接光',
    status: 'ready',
  },
  {
    id: 'pbr',
    no: 7,
    title: 'PBRの考え方',
    summary: 'エネルギー保存、マイクロファセット、フレネル、メタリック/ラフネス。',
    difficulty: 3,
    group: '直接光',
    status: 'ready',
  },
  {
    id: 'brdf',
    no: 8,
    title: 'BRDFとCook-Torrance',
    summary: 'BRDF=2方向を入れると反射率を返す箱。D・F・Gを1項ずつ。',
    difficulty: 3,
    group: '直接光',
    status: 'ready',
  },
  {
    id: 'indirect',
    no: 9,
    title: '間接光 入門',
    summary: '直接光だけだとのっぺりする理由。アンビエントとスカイライト。',
    difficulty: 3,
    group: '間接光',
    status: 'ready',
  },
  {
    id: 'sh',
    no: 10,
    title: 'ライトプローブとSH',
    summary: '周囲の光を数個の係数に「要約」する球面調和関数の直感。',
    difficulty: 3,
    group: '間接光',
    status: 'ready',
  },
  {
    id: 'advanced',
    no: 11,
    title: '発展',
    summary: 'スペキュラIBL、トーンマッピング、影の基礎など。',
    difficulty: 3,
    group: '発展',
    status: 'ready',
  },
];

export function chapterById(id: string): Chapter | undefined {
  return chapters.find((c) => c.id === id);
}
