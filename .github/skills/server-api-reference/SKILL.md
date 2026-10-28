---
name: server-api-reference
description: "Use when implementing or changing this project's server-side API, App Router Route Handlers, API paths, request/response types, authentication, staff/admin permissions, validation, or database operations."
argument-hint: "Describe the server API feature or endpoint you need"
---

# Server API Reference

このスキルは、`app/api/app` 配下の Route Handler を実装・変更するときに使用する。クライアントから API を呼び出す方法は [`client-api-reference`](../client-api-reference/SKILL.md) を使用する。

## API の構成

- Route Handler は `app/api/app/**/route.ts` にある。
- 共通の API 型は [`app/api/app/api.d.ts`](../../../app/api/app/api.d.ts) の `app_api_map_gen`、`app_api_response`、`api_url_param_id` などを使う。
- 認証・権限・標準エラーレスポンスは [`libs/api/`](../../../libs/api/) の `AppAPI` を使う。
- DB 操作は [`libs/db/`](../../../libs/db/) の `AppDB` を使い、Route Handler から Prisma を直接操作しない。

## サーバー API パス一覧

パスはプロジェクトルートからの URL。`[id]` と `[key]` は動的パラメータである。

### スタッフ・管理者 API

| パス | メソッド | 用途 |
| --- | --- | --- |
| `/api/app/staff/admin/image` | `GET` | 画像一覧 |
| `/api/app/staff/admin/image` | `POST` | `multipart/form-data` の `file` で画像を登録 |
| `/api/app/staff/admin/image/[id]` | `DELETE` | 画像を削除 |
| `/api/app/staff/admin/product` | `POST` | 商品を登録。`name`、`description`、`price`、`groupId` |
| `/api/app/staff/admin/product/[id]` | `GET` | 商品詳細 |
| `/api/app/staff/admin/product/[id]` | `PATCH` | 商品を更新 |
| `/api/app/staff/admin/product/[id]` | `DELETE` | 商品を削除 |
| `/api/app/staff/admin/productGroup` | `POST` | 商品グループを登録。`name`、`description`、`showTop`、`imgId` |
| `/api/app/staff/admin/productGroup/[id]` | `PATCH` | 商品グループを更新 |
| `/api/app/staff/admin/productGroup/[id]` | `DELETE` | 商品グループを削除 |
| `/api/app/staff/admin/serviceKey` | `GET` | サービスキー一覧 |
| `/api/app/staff/admin/serviceKey` | `POST` | サービスキーを作成。`name` |
| `/api/app/staff/admin/serviceKey/[id]` | `DELETE` | サービスキーを削除 |
| `/api/app/staff/admin/store` | `PATCH` | 店舗情報を更新 |
| `/api/app/staff/admin/user/[id]` | `GET` | ユーザー詳細 |
| `/api/app/staff/admin/user/[id]` | `PATCH` | ユーザーを更新 |
| `/api/app/staff/order/[id]` | `PATCH` | 注文を更新 |
| `/api/app/staff/userVerifyKey/[key]/user` | `GET` | ユーザー確認キーに紐づくユーザーを取得 |

### ログインユーザー API

| パス | メソッド | 用途 |
| --- | --- | --- |
| `/api/app/user/user` | `GET` | ログインユーザー情報を取得 |
| `/api/app/user/userVerifyKey` | `GET` | ログインユーザーの確認キーを取得 |
| `/api/app/user/cartItem` | `POST` | カート項目を登録 |
| `/api/app/user/cartItem/[id]` | `PATCH` | カート項目を更新 |
| `/api/app/user/cartItem/[id]` | `DELETE` | カート項目を削除 |

### 確認 API

| パス | メソッド | 用途 |
| --- | --- | --- |
| `/api/app/verify/serviceKey?key=...` | `POST` | サービスキーを検証 |
| `/api/app/verify/systemKey?key=...` | `POST` | システムキーを検証 |
| `/api/app/verify/userVerifyKey?key=...` | `POST` | ユーザー確認キーを検証 |

## サーバー側の実装例

### 型定義・認証・Zod 検証・DB 登録

管理者 API では、リクエスト型を `app_api_map_gen` で定義し、セッション、権限、ロック状態、JSON body の順に確認する。

```ts
import { AppAPI } from "@/libs/api";
import { AppDB, AppDB_Types } from "@/libs/db";
import { app_api_map_gen, app_api_response, app_api_response_error } from "../../../api";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

export type AppAPI_staff_admin_Product_Map = app_api_map_gen<{
    POST: {
        req: {
            params: undefined,
            body: {
                name: string,
                description: string,
                price: number,
                groupId: string
            }
        },
        res: app_api_response<AppDB_Types["product"]["detail"]>
    }
}>;

const POST_BODY = z.object({
    groupId: z.ulid(),
    name: z.string().max(16),
    description: z.string().max(128),
    price: z.int().min(0)
}) satisfies z.ZodType<
    AppAPI_staff_admin_Product_Map["POST"]["req"]["body"]
>;

export async function POST(req: NextRequest) {
    const email = await AppAPI.session.getEmail();
    if (!email) return AppAPI.response.errorResponse.Unauthorized;

    const permission = await AppAPI.permission.get(email);
    if (!permission) return AppAPI.response.errorResponse.Unauthorized;
    if (!permission.isAdmin || permission.isLock) {
        return AppAPI.response.errorResponse.Forbidden;
    }

    const body = POST_BODY.safeParse(await req.json().catch(() => null));
    if (!body.success) {
        return NextResponse.json<app_api_response_error>({
            success: false,
            error: body.error.issues.map(issue => issue.message).join(", ")
        }, { status: 400 });
    }

    const product = await AppDB.product.add(
        body.data.groupId,
        body.data.name,
        body.data.description,
        body.data.price
    ).catch(() => null);
    if (!product) return AppAPI.response.errorResponse.ServerError;

    return NextResponse.json<AppAPI_staff_admin_Product_Map["POST"]["res"]>({
        success: true,
        data: product
    });
}
```

### 動的パラメータを使う更新

動的セグメントは `api_url_param_id` で型付けし、`await p.params` から取得してから Zod で検証する。

```ts
import { api_url_param_id, app_api_map_gen, app_api_response } from "@/app/api/app/api";
import { AppAPI } from "@/libs/api";
import { AppDB, AppDB_Types } from "@/libs/db";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

export type AppAPI_staff_admin_Product__id__Map = app_api_map_gen<{
    PATCH: {
        req: { params: undefined, body: AppDB_Types["product"]["update"] },
        res: app_api_response<undefined>
    }
}>;

const PATCH_BODY = z.object({
    name: z.string().max(16).optional(),
    description: z.string().max(128).optional(),
    price: z.int().min(0).optional()
}) satisfies z.ZodType<
    AppAPI_staff_admin_Product__id__Map["PATCH"]["req"]["body"]
>;

export async function PATCH(req: NextRequest, p: api_url_param_id) {
    const email = await AppAPI.session.getEmail();
    if (!email) return AppAPI.response.errorResponse.Unauthorized;

    const permission = await AppAPI.permission.get(email);
    if (!permission) return AppAPI.response.errorResponse.Unauthorized;
    if (permission.isLock || !permission.isAdmin) {
        return AppAPI.response.errorResponse.Forbidden;
    }

    const { id } = await p.params;
    const parsedId = z.string().min(1).safeParse(id);
    if (!parsedId.success) return AppAPI.response.errorResponse.BadRequest;

    const body = PATCH_BODY.safeParse(await req.json().catch(() => null));
    if (!body.success) return AppAPI.response.errorResponse.BadRequest;

    try {
        await AppDB.product.update(parsedId.data, body.data);
    } catch {
        return AppAPI.response.errorResponse.ServerError;
    }

    return NextResponse.json<AppAPI_staff_admin_Product__id__Map["PATCH"]["res"]>({
        success: true,
        data: undefined
    });
}
```

## Route Handler を追加・変更するとき

1. 対応するディレクトリに `route.ts` を置き、Next.js の HTTP メソッド関数を export する。
2. `app_api_map_gen` でリクエストの `params`、`body` とレスポンス型を先に定義する。
3. JSON body は既存実装と同じく Zod で検証し、型定義とスキーマを一致させる。
4. `AppAPI.session.getEmail()`、`AppAPI.permission.get()`、`AppAPI.response.errorResponse` で認証・権限・標準エラーを処理する。
5. DB 操作は `AppDB` の既存メソッドを使い、予期しない失敗は `ServerError` として明示的に返す。
6. クライアントラッパーが必要な場合は [`client-api-reference`](../client-api-reference/SKILL.md) の手順に従う。

## 注意事項

- `api_url_param_id` の `params` は Promise である。`await p.params` を忘れない。
- `api_client_req` は自動で `Content-Type` を設定しない。クライアント側の仕様は [`client-api-reference`](../client-api-reference/SKILL.md) を参照する。
- 独自の認証判定、成功形のエラー返却、Route Handler からの Prisma 直接操作を追加しない。
