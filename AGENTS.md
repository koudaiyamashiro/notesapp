# AGENTS.md

このリポジトリで作業するAIコーディングエージェント向けの最小ガイドです。詳細仕様は既存ドキュメントを参照し、ここには実行時に必要な要点のみ記載します。

## 目的と参照先
- プロジェクト目的と機能ロードマップ: [docs/project-context.md](docs/project-context.md)
- ベーステンプレート情報: [README.md](README.md)

## まず実行する確認コマンド
- 依存関係インストール: `npm install`
- フロント開発: `npm run dev`
- フロント検証: `npm run lint` と `npm run build`
- Amplify変更時の型検証: `cd amplify && npx tsc -p tsconfig.json --noEmit`

## アーキテクチャ要点
- フロント: React + Vite + Tailwind。
- 画面: `src/pages/` 配下（`Home.jsx`, `Assessment.jsx`, `Analysis.jsx`, `Result.jsx`）。
- UI部品: `src/components/`（結果画面専用は `src/components/result/`）。
- データ/ロジック:
  - 企業データ: `src/data/companies/`
  - 分析サービス: `src/services/careerAnalysisService.js`, `src/services/aiAnalysisService.js`
- バックエンド: Amplify Gen2 (`amplify/backend.ts`)。
  - Auth/Data/Function を定義
  - Lambda: `amplify/functions/generateCareerInsights/`

## 変更時の実務ルール
- 変更範囲に応じて必要最小限の検証を実行する。
  - UI/フロントのみ: `npm run lint` と `npm run build`
  - Amplify/Lambdaを触ったら: 上記に加えて `cd amplify && npx tsc -p tsconfig.json --noEmit`
- 既存UIパターンを優先して再利用する。
  - 結果画面は `src/components/result/` への分割方針を維持する。
- データ変換ロジックはページ層または service 層に寄せ、表示コンポーネントは可能な限り純粋に保つ。

## よくある落とし穴
- Lambdaの502はCORSだけでなくタイムアウトが原因のことがある。
  - `amplify/functions/generateCareerInsights/resource.ts` の `timeoutSeconds` と実ペイロードを確認する。
- Amplify function handler で `process.env` の型エラーが出る場合がある。
  - 既存ハンドラ実装の型宣言パターンに合わせる。
- 大規模UIリファクタ時は、同一コンポーネントの削除/再作成を同時並行で行わない。

## 非対象
- `dist/` や `node_modules/` は編集しない。
- 指示がない限り、機密情報や秘密鍵をコード・ログに出力しない。

## 出力スタイル
- 変更内容は「何を・なぜ」を短く説明する。
- ファイル参照はパスを明示する。
- 影響が大きい変更では、実施した検証コマンド結果を添える。
