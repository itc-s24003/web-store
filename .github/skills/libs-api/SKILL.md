---
name: libs-api
description: "このプロジェクトの libs/api を使って Route Handler の認証・権限確認・エラーレスポンスを実装するときに使用する。AppAPI、セッション、管理者・スタッフ権限、ロック状態、NextResponse を扱う作業が対象。"
argument-hint: "実装または確認したい API 共通処理"
user-invocable: true
---

# `libs/api` スキル

このスキルは、[`libs/api/api.ts`](../../../libs/api/api.ts) が公開する `AppAPI` の利用方法を、Route Handler の実装に適用するためのガイドです。

## 利用する API

```ts
import { AppAPI } from "@/libs/api/api";
```

### セッション

認証が必要な API では、DB 操作より先に `getEmail()` を呼びます。

```ts
const email = await AppAPI.session.getEmail();
if (!email) return AppAPI.response.errorResponse.Unauthorized;
```

`getEmail()` は NextAuth のサーバーセッションからメールアドレスを取得し、暗号化済みの値を返します。セッションまたはメールアドレスがない場合は `null` です。戻り値は `AppDB.user.email.get` や `AppDB.permission.get` など、暗号化済みメールアドレスを受け取る関数へそのまま渡します。

### 権限とロック状態

```ts
const permission = await AppAPI.permission.get(email);
if (!permission) return AppAPI.response.errorResponse.Unauthorized;
if (permission.isLock) return AppAPI.response.errorResponse.Forbidden;
```

`get(email)` はユーザーが存在する場合に `isAdmin`、`isStaff`、`lockTime`、現在時刻を基準にした `isLock` を返し、存在しない場合は `null` を返します。管理者 API では `isAdmin`、スタッフ API では `isStaff` を明示的に確認してください。

### エラーレスポンス

```ts
return AppAPI.response.errorResponse.Unauthorized;
```

| 名前 | HTTP ステータス | 用途 |
| --- | ---: | --- |
| `BadRequest` | 400 | リクエスト形式・内容が不正 |
| `Unauthorized` | 401 | 未認証、対象ユーザーなし |
| `Forbidden` | 403 | 権限不足、ロック中 |
| `NotFound` | 404 | 対象リソースが存在しない |
| `ServerError` | 500 | サーバー側の予期しないエラー |

## Route Handler の手順

1. `AppAPI.session.getEmail()` で認証を確認する。
2. 必要に応じて `AppAPI.permission.get(email)` で権限とロック状態を確認する。
3. リクエストの JSON、パラメータ、検索値を検証する。プロジェクトで `zod` を使う場合は、スキーマ検証後の値だけを渡す。
4. 検証済みの値で `AppDB` を呼び出す。
5. 成功時は `NextResponse.json`、失敗時は適切な `errorResponse` を返す。

```ts
import { AppAPI } from "@/libs/api/api";
import { AppDB } from "@/libs/db";
import { NextResponse } from "next/server";

export async function GET() {
    const email = await AppAPI.session.getEmail();
    if (!email) return AppAPI.response.errorResponse.Unauthorized;

    const user = await AppDB.user.email.get(email);
    if (!user) return AppAPI.response.errorResponse.NotFound;

    return NextResponse.json({
        success: true,
        data: user
    });
}
```

## 守ること

- `libs/api` はサーバー側だけで使い、Client Component に import しない。
- 認証が必要な API で `getEmail()` の `null` を成功処理しない。
- 外部入力を検証してから DB 操作を呼び出す。
- DB 操作の例外を空配列や成功レスポンスに変換しない。必要なら `try/catch` で既存 API のパターンに従った `ServerError` などへ明示的に変換する。
- 平文メールアドレスを DB のメールアドレス検索へ渡さない。`AppAPI.session.getEmail()` の戻り値を使う。
