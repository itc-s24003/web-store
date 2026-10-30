"use client";


import { AppDB_Types } from "@/libs/db";
import { AppView } from "@/libs/element/layout";
import { Content } from "@/libs/element/layout/content";
import { ContentWrapper } from "@/libs/element/layout/contentWrapper";
import { Header } from "@/libs/element/layout/header";
import { Navigation } from "@/libs/element/layout/navigation";
import { CheckCircle2, Clock3, PackageCheck, ReceiptText, XCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";


type PageView_Props = {
    store: AppDB_Types["store"]["model"],
    languages: AppDB_Types["language"]["model"][],
    order: AppDB_Types["order"]["model"]
}

export function PageView({ store, languages, order }: PageView_Props) {
    const total = order.cartItems.reduce((sum, item) => sum + item.product.price * item.count, 0);
    const status = order.isCanceled
        ? { label: "キャンセル済み", icon: <XCircle size={16} aria-hidden="true" />, className: "bg-(--error)/12 text-(--error)" }
        : order.isReceived
            ? { label: "受け取り済み", icon: <CheckCircle2 size={16} aria-hidden="true" />, className: "bg-(--success)/12 text-(--success)" }
            : order.isReady
                ? { label: "準備完了", icon: <PackageCheck size={16} aria-hidden="true" />, className: "bg-(--app-theme)/12 text-(--app-theme)" }
                : { label: "準備中", icon: <Clock3 size={16} aria-hidden="true" />, className: "bg-(--app-theme-sub)/10 text-(--app-theme-sub)" };

    return (
        <AppView>
            <Header languages={languages} userLanguageId={null} title={store.name} />
            <ContentWrapper>
                <Content>
                    <div className="mx-auto flex w-full max-w-2xl flex-col gap-4 py-5">
                        <Link href="/order" className="w-fit text-sm font-semibold text-(--app-theme) hover:underline">
                            ← 注文履歴に戻る
                        </Link>

                        <section className="overflow-hidden rounded-2xl border border-(--container-background-sub)/70 bg-(--container-background) shadow-sm">
                            <div className="flex items-start justify-between gap-3 border-b border-(--container-background-sub)/60 px-4 py-5 sm:px-5">
                                <div>
                                    <p className="text-xs font-bold tracking-[0.18em] text-(--text-color-sub)">ORDER DETAIL</p>
                                    <h1 className="mt-1 text-2xl font-bold tracking-tight text-(--text-color)">注文 #{order.index}</h1>
                                </div>
                                <span className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ${status.className}`}>
                                    {status.icon}
                                    {status.label}
                                </span>
                            </div>
                            <div className="grid grid-cols-2 gap-4 px-4 py-4 sm:px-5">
                                <div>
                                    <p className="text-xs text-(--text-color-sub)">注文日時</p>
                                    <time dateTime={new Date(order.requestedAt).toISOString()} className="mt-1 block text-sm font-semibold text-(--text-color)">
                                        {new Date(order.requestedAt).toLocaleString("ja-JP")}
                                    </time>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-(--text-color-sub)">商品数</p>
                                    <p className="mt-1 text-sm font-semibold text-(--text-color)">{order.cartItems.reduce((sum, item) => sum + item.count, 0)}点</p>
                                </div>
                            </div>
                        </section>

                        <section className="overflow-hidden rounded-2xl border border-(--container-background-sub)/70 bg-(--container-background) shadow-sm">
                            <div className="flex items-center gap-2 border-b border-(--container-background-sub)/60 px-4 py-4 sm:px-5">
                                <ReceiptText size={18} className="text-(--app-theme)" aria-hidden="true" />
                                <h2 className="font-bold text-(--text-color)">注文内容</h2>
                            </div>
                            <div className="flex flex-col gap-3 bg-(--background) p-4 sm:px-5">
                                {order.cartItems.map((item) => {
                                    const subtotal = item.product.price * item.count;
                                    return (
                                        <div key={item.id} className="flex items-center gap-3 rounded-xl bg-(--container-background) p-3">
                                            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-(--container-background-sub)">
                                                <Image src={item.product.img?.url ?? "/picture.png"} alt={item.product.name} fill sizes="64px" className="object-cover" />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="font-bold text-(--text-color)">{item.product.name}</p>
                                                <p className="mt-1 text-sm text-(--text-color-sub)">¥{item.product.price.toLocaleString("ja-JP")} × {item.count}</p>
                                            </div>
                                            <p className="shrink-0 text-sm font-bold text-(--text-color)">¥{subtotal.toLocaleString("ja-JP")}</p>
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="flex items-center justify-between border-t border-(--container-background-sub)/60 px-4 py-4 sm:px-5">
                                <span className="font-semibold text-(--text-color-sub)">合計金額</span>
                                <span className="text-2xl font-bold text-(--app-theme)">¥{total.toLocaleString("ja-JP")}</span>
                            </div>
                        </section>
                    </div>
                </Content>
                <Navigation />
            </ContentWrapper>
        </AppView>
    )
}