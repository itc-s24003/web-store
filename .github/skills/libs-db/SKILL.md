---
name: libs-db
description: "このプロジェクトの libs/db と AppDB を使って Prisma の DB 操作を実装・修正するときに使用する。カート、ユーザー、AppDB_Types、トランザクションを扱う作業が対象。"
argument-hint: "操作したい DB 名前空間またはモデル"
user-invocable: true
---

# `libs/db` スキル

このスキルは、[`libs/db/index.ts`](../../../libs/db/index.ts) が公開する `AppDB` と `AppDB_Types` の利用方法を、DB 操作の実装に適用するためのガイドです。

## 基本方針

```ts
import { AppDB, AppDB_Types } from "@/libs/db";

const user = await AppDB.user.get(userId);
type User = AppDB_Types["user"]["model"];
```

- Route Handler から Prisma クライアントを直接呼ばず、まず `AppDB` の既存関数を再利用する。
- 共通処理が不足している場合は、該当する `libs/db/<namespace>` に関数を追加して `AppDB` から公開する。
- DB 関数の `select` と `type.d.ts` の Prisma 型を一致させる。
- DB 例外や対象不在を成功レスポンスへ変換しない。
- `libs/db` と `libs/db/db.ts` はサーバー側だけで使う。

## 現在の名前空間

| 名前空間 | 主な関数 | 用途 |
| --- | --- | --- |
| `cartItem` | `update`, `email.add`, `email.remove`, `email.update`, `email.getAll` | 未注文カートの操作 |
| `user` | `get`, `getDetailMin`, `email.login`, `email.get`, `email.getDetailMin` | ユーザー操作 |

注文、商品、画像、サービスキー、確認キーなどの名前空間は、現在の `AppDB` には公開されていません。実装する場合は、対応する `libs/db` モジュールと `AppDB` への公開を追加してください。

## 関数リファレンス

### カート

- `AppDB.cartItem.email.add(email, productId, count)`: 同じ商品があれば数量を加算し、なければ作成する。
- `AppDB.cartItem.email.remove(email, id)`: ユーザーのカート項目を削除する。
- `AppDB.cartItem.email.update(email, id, data)`: ユーザー自身の未注文項目を更新する。
- `AppDB.cartItem.email.getAll(email)`: ユーザーの未注文項目を取得する。
- `AppDB.cartItem.update(id, data)`: 未注文項目を更新する。呼び出し側で対象ユーザーを確認済みの場合に使う。

`count` は 1 以上でなければなりません。`add` は不正な数量で例外を投げます。`update` を呼ぶ前にも、外部入力の `count` を呼び出し側で検証してください。

### ユーザー

- `AppDB.user.get(id)` / `getDetailMin(id)`: ID でユーザーを取得する。
- `AppDB.user.email.login(emailRaw)`: **平文**メールアドレスを受け取り、暗号化してユーザーを作成または存在確認する。
- `AppDB.user.email.get(email)` / `getDetailMin(email)`: **暗号化済み**メールアドレスでユーザーを取得する。

`email.login` 以外のメールアドレス条件検索では、`AppAPI.session.getEmail()` の戻り値など暗号化済みの値を使います。

## 型

現在公開されている型は次のように参照します。

```ts
import { AppDB_Types } from "@/libs/db";

type CartItem = AppDB_Types["cartItem"]["model"];
type CartItemUpdate = AppDB_Types["cartItem"]["update"];
type User = AppDB_Types["user"]["model"];
type UserDetailMin = AppDB_Types["user"]["detailMin"];
```

- `cartItem`: `model`, `update`
- `user`: `model`, `detailMin`

型は各モジュールの `type.d.ts` にある Prisma `select` 形状から定義されています。

## Prisma 生成物

`libs/generated/prisma` は `prisma generate` の生成物です。直接編集せず、通常は共有済みの `AppDB` または [`libs/db/db.ts`](../../../libs/db/db.ts) の `db` を使います。スキーマ変更は [`prisma/schema.prisma`](../../../prisma/schema.prisma) を変更して生成し、取得形状の変更は対応する `type.d.ts` と DB 関数で行います。Prisma の設定は [`prisma7.config.ts`](../../../prisma7.config.ts) に従います。

## 実装後の確認

- サーバー専用モジュールを Client Component に import していない。
- 既存の `AppDB` 関数を再利用できるのに直接 Prisma クエリを書いていない。
- メールアドレス検索に平文を渡していない。
- 外部入力を検証してから DB 関数を呼んでいる。
- `AppDB_Types` と DB 関数の `select` が一致している。
- DB 例外を成功レスポンスに変換していない。
- `git diff --check` と対象範囲の lint または型チェックが通る。
