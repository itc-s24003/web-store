"use client"


import { AppDB_Types } from "@/libs/db";
import { AppView } from "@/libs/element/layout";
import { Content } from "@/libs/element/layout/content";
import { ContentWrapper } from "@/libs/element/layout/contentWrapper";
import { Header } from "@/libs/element/layout/header";
import { Navigation } from "@/libs/element/layout/navigation";
import { CheckCircle2, Clock3, PackageCheck, ReceiptText } from "lucide-react";
import Image from "next/image";

type PageView_Props = {
    store: AppDB_Types["store"]["model"],
    languages: AppDB_Types["language"]["model"][],
    orders: AppDB_Types["order"]["model"][]
}

export function PageView({ store, languages, orders }: PageView_Props) {
    return (
        <AppView>
            <Header languages={languages} userLanguageId={""} title={store.name} />
            <ContentWrapper>
                <Content>
                    <div className="mx-auto flex w-full max-w-2xl flex-col gap-4 py-5">
                    <div className="flex items-end justify-between px-1">
                        <div>
                            <p className="text-xs font-bold tracking-[0.18em] text-(--app-theme-sub)/65">ORDER HISTORY</p>
                            <h1 className="mt-1 text-2xl font-bold tracking-tight text-(--text-color)">注文履歴</h1>
                        </div>
                        <span className="rounded-full bg-(--container-background) px-3 py-1 text-sm font-semibold text-(--text-color-sub)">
                            {orders.length}件
                        </span>
                    </div>

                    {
                        orders.length === 0 ? (
                            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-(--container-background-sub) bg-(--container-background) px-6 py-16 text-center shadow-sm">
                                <ReceiptText size={42} strokeWidth={1.5} className="text-(--app-theme-sub)/45" />
                                <h2 className="mt-4 text-lg font-bold text-(--text-color)">注文履歴はありません</h2>
                                <p className="mt-1 text-sm text-(--text-color-sub)">注文すると、ここに履歴が表示されます。</p>
                            </div>
                        ) : orders.map((order) => {
                            const total = order.cartItems.reduce((acc, item) => acc + (item.product.price * item.count), 0);
                            const status = order.isReceived
                                ? { label: "受け取り済み", icon: <CheckCircle2 size={15} />, className: "bg-(--success)/12 text-(--success)" }
                                : order.isReady
                                    ? { label: "準備完了", icon: <PackageCheck size={15} />, className: "bg-(--app-theme)/12 text-(--app-theme)" }
                                    : { label: "準備中", icon: <Clock3 size={15} />, className: "bg-(--app-theme-sub)/10 text-(--app-theme-sub)" };

                            return (
                                <article key={order.id} className="overflow-hidden rounded-2xl border border-(--container-background-sub)/70 bg-(--container-background) shadow-sm">
                                    <div className="flex items-start justify-between gap-3 border-b border-(--container-background-sub)/60 px-4 py-4 sm:px-5">
                                        <div>
                                            <p className="text-xs font-semibold tracking-wider text-(--text-color-sub)">ORDER</p>
                                            <h2 className="mt-0.5 text-xl font-bold text-(--text-color)">#{order.index}</h2>
                                        </div>
                                        <span className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ${status.className}`}>
                                            {status.icon}
                                            {status.label}
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3 px-4 py-3 text-sm sm:px-5">
                                        <div>
                                            <p className="text-xs text-(--text-color-sub)">注文日時</p>
                                            <time dateTime={new Date(order.requestedAt).toISOString()} className="mt-0.5 block font-medium text-(--text-color)">
                                                {new Date(order.requestedAt).toLocaleString()}
                                            </time>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-(--text-color-sub)">合計金額</p>
                                            <p className="mt-0.5 text-lg font-bold text-(--app-theme)">¥{total.toLocaleString()}</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2 bg-(--background) px-4 py-3 sm:px-5">
                                        {
                                            order.cartItems.map((item) => (
                                                <div key={item.id} className="flex items-center gap-3 rounded-xl bg-(--container-background) p-2.5">
                                                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-(--container-background-sub)">
                                                        <Image src={item.product.img?.url ?? "/picture.png"} alt={item.product.name} fill sizes="56px" className="object-cover" />
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <p className="truncate font-bold text-(--text-color)">{item.product.name}</p>
                                                        <p className="mt-1 text-sm text-(--text-color-sub)">数量 {item.count}</p>
                                                    </div>
                                                    <p className="text-sm font-semibold text-(--text-color)">¥{(item.product.price * item.count).toLocaleString()}</p>
                                                </div>
                                            ))
                                        }
                                    </div>
                                    </article>
                                )
                            })
                        }
                    </div>
                </Content>
                <Navigation />
            </ContentWrapper>
        </AppView>
    )
}