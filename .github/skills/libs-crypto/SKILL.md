---
name: libs-crypto
description: "このプロジェクトの libs/crypto を使ってメールアドレスなどの機密値を暗号化・復号するときに使用する。AppCrypto、AES-256-GCM、CRYPTO_KEY、CRYPTO_HEX_IV、暗号化済みメールアドレスを扱う作業が対象。"
argument-hint: "暗号化または復号したい値と用途"
user-invocable: true
---

# `libs/crypto` スキル

このスキルは、[`libs/crypto/crypto.ts`](../../../libs/crypto/crypto.ts) が公開する `AppCrypto` の利用方法を、機密値を扱う実装に適用するためのガイドです。

## 基本的な使い方

```ts
import { AppCrypto } from "@/libs/crypto/crypto";

const encrypted = AppCrypto.encrypt(emailRaw);
const plainText = AppCrypto.decrypt(encrypted);
```

`AppCrypto` は AES-256-GCM を使用します。`encrypt` の戻り値は `認証タグ:暗号文` の hex 文字列です。現在の保存済みデータとの互換性を保つため、暗号化形式を変更しないでください。

## メールアドレスの扱い

ユーザー登録時など、平文メールアドレスを新規保存するときは `encrypt` を使います。

```ts
const email = AppCrypto.encrypt(emailRaw);
```

DB のメールアドレス検索では、保存時と同じ暗号化処理を使う必要があります。認証済み API では、`AppAPI.session.getEmail()` がすでに暗号化済みの値を返すため、再暗号化せずそのまま `AppDB.user.email.get(email)` などへ渡します。

## 環境変数

`AppCrypto` の import 時に [`app/env.ts`](../../../app/env.ts) が次を検証します。

- `CRYPTO_KEY`: AES-256 用の 32 byte、64 桁 hex
- `CRYPTO_HEX_IV`: AES-GCM 用の 12 byte、24 桁 hex。現在の実装では暗号化・復号に共通して使われるため、変更すると既存データを復号できなくなります。

値が未設定または形式不正の場合、[`app/env.ts`](../../../app/env.ts) の検証によりアプリケーションの起動・モジュール読み込み時にエラーになります。

## セキュリティ上の注意

- `AppCrypto` はサーバー側だけで使い、Client Component やブラウザへ秘密鍵を送らない。
- 暗号文、平文、秘密鍵をログや API レスポンスへ不用意に出さない。
- 外部入力を `decrypt` に直接渡さない。復号に失敗すると例外になるため、入力の出所とエラー処理を明確にする。
- 暗号化方式、秘密鍵、IV の形式を独自に変更しない。既存 DB の値と互換性がなくなる。
- `libs/crypto/crypto.ts` を変更する場合は、保存済みメールアドレスの読み書きと認証フローへの影響を確認する。
