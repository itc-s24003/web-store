---
name: color-definitions
description: "このプロジェクトの app/globals.css に定義された色を Tailwind CSS で使用するときに使用する。Tailwind の背景色、文字色、primary、secondary の選択や UI 実装を扱う。"
argument-hint: "使用する UI の部位または色の用途"
user-invocable: true
---

# プロジェクトの色定義

このスキルは、[`app/globals.css`](../../../app/globals.css) の `:root` に定義された色を Tailwind CSS のユーティリティクラスで再利用するためのリファレンスです。UI を実装・変更するときは、まず用途に合う既存の CSS カスタムプロパティを確認し、固定色を追加する前にこの定義を再利用してください。

## 使用できる色

| CSS カスタムプロパティ | 値 | 用途 |
| --- | --- | --- |
| `--background` | `#ebebeb` | 基本の背景色 |
| `--background-sub` | `#959596` | 補助的な背景色。現在の `body` の背景に使用 |
| `--container-background` | `#f9fafb` | コンテナの基本背景色 |
| `--container-background-sub` | `#d1d5db` | コンテナの補助的な背景色 |
| `--text-color` | `#171717` | 基本の文字色。現在の `body` の文字色に使用 |
| `--text-color-sub` | `#525252` | 補助的な文字色 |
| `--app-theme` | `#db5921` | アプリ固有のテーマ色 |
| `--app-theme-sub` | `#152938` | アプリ固有の補助テーマ色 |
| `--app-theme-text` | `#ffffff` | アプリ固有のテーマ上の文字色 |
| `--app-theme-text-sub` | `#ffffff` | アプリ固有の補助テーマ上の文字色 |
| `--primary` | `#2b67fe` | 主要な UI 要素の色 |
| `--secondary` | `#737373` | 補助的な UI 要素の色 |
| `--success` | `#10b981` | 成功状態の表示 |
| `--warning` | `#f59e0b` | 警告状態の表示 |
| `--error` | `#ef4444` | エラー状態の表示 |

`container` は既存の CSS カスタムプロパティ名に含まれる綴りです。既存のスタイルと互換性を保つため、参照時は `--container-background` と `--container-background-sub` をそのまま使用してください。

## Tailwind での使用方法

`@theme` の定義は現在コメントアウトされているため、CSS カスタムプロパティは Tailwind v4 の CSS 変数向け任意値構文で参照します。背景、文字、境界線など用途に応じたユーティリティクラスの値に `(--変数名)` を指定してください。

```tsx
<div className="bg-(--container-background) text-(--text-color)">
  ...
</div>

<div className="bg-(--container-background-sub) text-(--text-color-sub)">
  ...
</div>

<div className="border border-(--container-background-sub)">
  ...
</div>
```

アプリ固有のテーマ色を背景に使う場合は、前景色に `--app-theme-text` または `--app-theme-text-sub` を組み合わせます。ボタンなどの主要・補助 UI には `--primary`・`--secondary`、状態表示には `--success`・`--warning`・`--error` を使用します。前景色には背景や文字色の変数を組み合わせて、コントラストを維持してください。

```tsx
<button className="bg-(--primary) text-(--background)">
  送信
</button>

<header className="bg-(--app-theme-sub) text-(--app-theme-text)">
  ...
</header>

<p className="text-(--error)">入力内容を確認してください。</p>
```

## 実装時のルール

- 色の用途が既存の定義に該当する場合は、`bg-white` や `text-black`、`#ffffff` などの固定色を直接記述しない。
- 背景には `bg-(--background)` などの `background` 系、文字には `text-(--text-color)` などの `text-color` 系を使用する。
- コンテナには `--container-background` 系、アプリ固有の要素には `--app-theme` 系を使用する。
- `--app-theme` 系を背景に使う場合は、対応する `--app-theme-text` 系を前景色に使用する。
- 主要・補助 UI には `bg-(--primary)` や `bg-(--secondary)`、状態表示には `bg-(--success)`・`text-(--warning)` などの状態色を使用する。
- 同じ CSS カスタムプロパティを、背景なら `bg-(--...)`、文字なら `text-(--...)`、境界線なら `border-(--...)` のように用途に合うユーティリティで参照する。
- 既存の色の意味を変更したり新しい色を追加したりする場合は、[`app/globals.css`](../../../app/globals.css) と利用箇所を同時に確認する。
- ダークモード用の定義は現在コメントアウトされているため、利用可能な色として扱わない。
