# プロジェクト定義

## ファイル構成

```text
.
├── app/                         # Next.js の画面、API、認証
│   ├── api/                     # Route Handler と API クライアント
│   │   └── app/
│   ├── auth/                    # 認証 Route Handler
│   ├── layout.tsx               # ルートレイアウト
│   ├── page.tsx                 # ルートページ
│   └── globals.css              # グローバルスタイル
├── libs/                        # サーバー側の共通処理
│   ├── api/                     # API 認証、権限、レスポンス
│   ├── crypto/                  # 暗号化・復号
│   ├── db/                      # DB アクセス層
│   └── generated/               # 自動生成ファイル
├── prisma/                      # Prisma スキーマとマイグレーション
├── public/                      # 静的ファイル
├── .github/
│   ├── skills/                  # プロジェクト固有のスキル
│   │   └── <skill-name>/SKILL.md
│   └── copilot-instructins.md   # プロジェクト共通定義
├── next.config.ts               # Next.js 設定
├── tsconfig.json                # TypeScript 設定
└── package.json                 # パッケージ・スクリプト定義
```

### API ディレクトリ構成

```text
app/api/app/
├── api.d.ts                     # API map と共通レスポンス型
├── client.ts                    # API クライアントの共通処理・入口
├── staff/                       # スタッフ・管理者向け API
├── user/                        # ログインユーザー向け API
└── verify/                      # 検証 API
```

API 機能は機能名のディレクトリに配置し、必要に応じて `route.ts` と `client.ts` を同じディレクトリに置く。動的 URL セグメントは `[id]`、`[key]` の形式で表す。

### DB ディレクトリ構成

```text
libs/db/
├── db.ts                        # DB クライアント
├── index.ts                     # DB アクセス層の公開入口
└── <model>/
    ├── index.ts                 # モデル操作
    ├── type.d.ts                # モデル固有の型
    └── <concern>.ts             # メール・ID などの補助操作
```

## 命名規則

- ディレクトリ名と URL パスは、小文字の `camelCase` を使用する。
- 動的 URL セグメントは `[id]`、`[key]` のように角括弧で囲む。
- React コンポーネント、型、インターフェース、名前空間は `PascalCase` を使用する。
- 変数、関数、メソッド、オブジェクトプロパティは `camelCase` を使用する。
- 定数は `UPPER_SNAKE_CASE` を使用する。
- 真偽値は `is`、`has`、`can`、`should` のいずれかで始める。
- TypeScript ファイル名は、通常のモジュールに `camelCase.ts`、型定義に `type.d.ts` を使用する。
- Next.js の規約ファイルは `page.tsx`、`layout.tsx`、`route.ts`、`error.tsx` などの固定名を使用する。
- API の共通型定義は `api.d.ts`、API クライアントの共通処理は `client.ts` とする。
- 各ディレクトリの公開入口は `index.ts` とする。
- スキルのディレクトリ名は小文字の `kebab-case`、定義ファイル名は `SKILL.md` とする。
- Prisma のスキーマは `prisma/schema.prisma`、マイグレーションは `prisma/migrations/` に配置する。
