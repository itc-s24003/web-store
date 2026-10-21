---
name: client-api-reference
description: "Use when calling this project's typed API from client code, adding or changing API_Client wrappers, using api_client_req, handling API response types, or synchronizing client calls with Route Handler maps."
argument-hint: "Describe the client API call or wrapper you need"
---

# Client API Reference

このスキルは、ブラウザ側から `app/api/app` の API を呼び出すときに使用する。Route Handler の実装・認証・権限・Zod・DB 操作は [`server-api-reference`](../server-api-reference/SKILL.md) を使用する。

## クライアントの構成

- 共通リクエスト関数は [`app/api/app/client.ts`](../../../app/api/app/client.ts) の `api_client_req`。
- クライアントの入口は `API_Client.staff` と `API_Client.user`。
- 各機能の `client.ts` は対応する `route.ts` の map 型を import している。
- API の JSON レスポンスは原則 `success: true, data` または `success: false, error` の判別共用体である。
- 現在のパスとサーバー側の実装例は [`server-api-reference`](../server-api-reference/SKILL.md) を参照する。

## 既存ラッパーを使う

まず `API_Client` の名前空間と各機能の `client.ts` を確認し、ラッパーがある場合はそれを使う。引数の型は Route Handler の map 型から取得される。

```ts
import { API_Client } from "@/app/api/app/client";

const result = await API_Client.staff.admin.product.add({
    name,
    description,
    price,
    groupId,
});

if (!result) {
    // fetch または JSON 解析に失敗
    return;
}

if (!result.body.success) {
    // API が返したエラー
    console.error(result.body.error);
    return;
}

const product = result.body.data;
```

代表的なラッパーは次のとおり。

- `API_Client.staff.admin.image.getAll()` / `.add(file)` / `.deleteImage(id)`
- `API_Client.staff.admin.product.add(body)` / `.get(id)` / `.update(id, body)` / `.remove(id)`
- `API_Client.staff.admin.productGroup.add(body)` / `.update(id, body)` / `.remove(id)`
- `API_Client.staff.admin.serviceKey.get()` / `.create(name)` / `.remove(id)`
- `API_Client.staff.admin.store.update(body)`
- `API_Client.staff.admin.user.get(id)` / `.update(id, body)`
- `API_Client.staff.order.update(id, body)`
- `API_Client.staff.userVerifyKey.__key.user.get(key)`
- `API_Client.user.user.get()` / `API_Client.user.userVerifyKey.get()`

## `api_client_req` を直接使う

対応するラッパーがない API は、map 型、HTTP メソッド、クエリパラメータ、ボディの順に渡す。

```ts
import { api_client_req } from "@/app/api/app/client";
import type { AppAPI_verify_ServiceKey_Map } from "@/app/api/app/verify/serviceKey/route";

const result = await api_client_req<AppAPI_verify_ServiceKey_Map, "POST">(
    "/api/app/verify/serviceKey",
    "POST",
    { key },
    undefined,
);

if (!result) {
    // 通信または JSON 解析に失敗
    return;
}

if (!result.body.success) {
    console.error(result.body.error);
    return;
}

// result.body.data を利用する
```

`params` は URL の query string に変換され、`FormData` は JSON 化されずそのまま送信される。返り値は `Promise<{ status: number; body: response } | undefined>` で、`undefined` を成功レスポンスとして扱わないこと。

## ラッパーを追加・変更するとき

1. 対応する Route Handler の map 型と実際の HTTP メソッドを確認する。
2. 同じ機能の `client.ts` に `api_client_req` を使うラッパーを追加する。
3. 動的な `id` や `key` は URL に埋め込み、必要な query parameter は `params` に渡す。
4. `FormData` はそのまま body に渡し、JSON body は既存ラッパーと同じ形式にする。
5. 親の client から export される名前空間を更新する。
6. `undefined`、HTTP ステータス、`body.success`、`body.error` を個別に扱い、通信失敗や API エラーを成功形に変換しない。

## 注意事項

- `api_client_req` は自動で `Content-Type` を設定しない。
- クライアント側の型は Route Handler の map 型から取得し、別の重複した request/response 型を作らない。
- クライアントに実装が残っていても、Route Handler の map と実際の export に存在しないメソッドがあり得る。新規コードでは Route Handler を正とし、利用前に確認する。
