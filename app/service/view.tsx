"use client"


import { AppDB_Types } from "@/libs/db"
import { Button } from "@/libs/element/button"
import { AppView } from "@/libs/element/layout"
import { Content } from "@/libs/element/layout/content"
import { ContentWrapper } from "@/libs/element/layout/contentWrapper"
import { Header } from "@/libs/element/layout/header"
import { useAPI_UserDetailMin } from "@/libs/element/state/appAPI/userAPI_UserDetailMin"
import { useAPI } from "@/libs/element/state/useAPI"
import { useEffect, useState } from "react"
import { API_Client } from "../api/app/client"
import { useSocket } from "@/libs/element/state/useSocket"
import { CheckCircle2, Clock3, PackageCheck, RefreshCw, ShoppingBag } from "lucide-react"

type PageView_Props = {
    store: AppDB_Types["store"]["model"],
    languages: AppDB_Types["language"]["model"][]
}

export function PageView({ store, languages }: PageView_Props) {
    const user = useAPI_UserDetailMin();
    const [key, setKey] = useState<string | null>(null);
    const [filter, setFilter] = useState<"all" | "preparing" | "ready">("all");
    const get = useAPI(async () => {
        const res = await API_Client.user.userVerifyKey.get();
        if (res?.body.success) {
            setKey(res.body.data.key);
        }
    });
    useEffect(() => {
        get.request();
    }, [])

    


    const [orders, setOrders] = useState<AppDB_Types["order"]["model"][]>([]);
    const getOrders = useAPI(async () => {
        const res = await API_Client.staff.order.getAll();
        if (res?.body.success) {
            setOrders(res.body.data);
        }
    });

    const socket = useSocket((data) => {
        void data;
        getOrders.request();
    }, key ?? undefined, user.user?.id)

    useEffect(() => {
        if (socket.isVerified) {
            getOrders.request();
        }
    }, [socket.isVerified])

    const updateOrder = useAPI(async (id: string) => {
        const res = await API_Client.staff.order.update(id, { isReady: true });
        if (res?.body.success) {
            setOrders((current) => current.map((order) => (
                order.id === id ? { ...order, isReady: true } : order
            )));
        }
    });

    const preparingCount = orders.filter((order) => !order.isReady).length;
    const readyCount = orders.filter((order) => order.isReady).length;
    const filteredOrders = orders.filter((order) => (
        filter === "all" ||
        (filter === "preparing" && !order.isReady) ||
        (filter === "ready" && order.isReady)
    ));
    const totalPrice = orders.reduce((total, order) => total + order.cartItems.reduce(
        (orderTotal, item) => orderTotal + item.product.price * item.count,
        0
    ), 0);

    return (
        <AppView>
            <Header languages={languages} userLanguageId={null} title={store.name} />
            <ContentWrapper>
                <Content>
                    <div className="mx-auto flex w-full max-w-4xl flex-col gap-5 py-5">
                        <section className="overflow-hidden rounded-3xl bg-(--app-theme-sub) p-5 text-(--app-theme-text) shadow-lg sm:p-6">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <p className="text-xs font-bold tracking-[0.2em] opacity-70">SERVICE DESK</p>
                                    <h1 className="mt-2 text-2xl font-bold tracking-tight">オーダー一覧</h1>
                                    <p className="mt-1 text-sm opacity-75">注文を確認して、調理状況を更新できます</p>
                                </div>
                                <div className="rounded-2xl bg-(--app-theme-text)/10 p-3">
                                    <ShoppingBag size={25} aria-hidden="true" />
                                </div>
                            </div>
                            <div className="mt-6 grid grid-cols-3 gap-2 sm:gap-3">
                                <div className="rounded-2xl bg-(--app-theme-text)/10 px-3 py-3 sm:px-4">
                                    <p className="text-xs opacity-70">受付中</p>
                                    <p className="mt-1 text-xl font-bold sm:text-2xl">{orders.length}<span className="ml-1 text-xs font-medium">件</span></p>
                                </div>
                                <div className="rounded-2xl bg-(--warning)/20 px-3 py-3 sm:px-4">
                                    <p className="text-xs opacity-80">準備中</p>
                                    <p className="mt-1 text-xl font-bold sm:text-2xl">{preparingCount}<span className="ml-1 text-xs font-medium">件</span></p>
                                </div>
                                <div className="rounded-2xl bg-(--success)/20 px-3 py-3 sm:px-4">
                                    <p className="text-xs opacity-80">準備完了</p>
                                    <p className="mt-1 text-xl font-bold sm:text-2xl">{readyCount}<span className="ml-1 text-xs font-medium">件</span></p>
                                </div>
                            </div>
                        </section>

                        <div className="flex items-center justify-between gap-3">
                            <div>
                                <h2 className="text-lg font-bold text-(--text-color)">注文を管理</h2>
                                <p className="mt-0.5 text-sm text-(--text-color-sub)">売上合計 ¥{totalPrice.toLocaleString("ja-JP")}</p>
                            </div>
                            <Button
                                aria-label="注文を更新"
                                className="flex h-10 w-10 items-center justify-center rounded-full bg-(--container-background) text-(--app-theme-sub) shadow-sm ring-1 ring-(--container-background-sub) transition-transform hover:scale-105 active:scale-95"
                                onClick={() => getOrders.request()}
                            >
                                <RefreshCw size={17} className={getOrders.waiting ? "animate-spin" : ""} aria-hidden="true" />
                            </Button>
                        </div>

                        <div className="grid grid-cols-3 rounded-xl bg-(--container-background) p-1 shadow-sm ring-1 ring-(--container-background-sub)/60">
                            {([
                                ["all", "すべて", orders.length],
                                ["preparing", "準備中", preparingCount],
                                ["ready", "準備完了", readyCount]
                            ] as const).map(([value, label, count]) => (
                                <button
                                    key={value}
                                    type="button"
                                    className={`rounded-lg px-2 py-2 text-sm font-bold transition-colors ${filter === value ? "bg-(--app-theme-sub) text-(--app-theme-text)" : "text-(--text-color-sub) hover:bg-(--background)"}`}
                                    onClick={() => setFilter(value)}
                                >
                                    {label}<span className="ml-1 text-xs opacity-70">{count}</span>
                                </button>
                            ))}
                        </div>

                        {filteredOrders.length === 0 ? (
                            <div className="flex flex-col items-center rounded-2xl border border-dashed border-(--container-background-sub) bg-(--container-background)/70 px-6 py-14 text-center">
                                <div className="rounded-full bg-(--success)/15 p-4 text-(--success)">
                                    <CheckCircle2 size={32} aria-hidden="true" />
                                </div>
                                <h2 className="mt-4 text-lg font-bold text-(--text-color)">該当する注文はありません</h2>
                                <p className="mt-1 text-sm text-(--text-color-sub)">新しい注文が入るとここに表示されます</p>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-3">
                                {filteredOrders.map((order) => {
                                    const itemCount = order.cartItems.reduce((count, item) => count + item.count, 0);
                                    const orderTotal = order.cartItems.reduce((total, item) => total + item.product.price * item.count, 0);
                                    return (
                                        <article key={order.id} className="overflow-hidden rounded-2xl bg-(--container-background) shadow-sm ring-1 ring-(--container-background-sub)/60">
                                            <div className="flex items-center justify-between gap-3 border-b border-(--container-background-sub)/60 px-4 py-4 sm:px-5">
                                                <div>
                                                    <p className="text-xs font-bold tracking-[0.16em] text-(--text-color-sub)">ORDER</p>
                                                    <div className="mt-1 flex items-center gap-2">
                                                        <h3 className="text-xl font-bold text-(--text-color)">#{order.index}</h3>
                                                        <span className="text-xs text-(--text-color-sub)">
                                                            {new Date(order.requestedAt).toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" })}
                                                        </span>
                                                    </div>
                                                </div>
                                                <span className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ${order.isReady ? "bg-(--success)/12 text-(--success)" : "bg-(--warning)/15 text-(--warning)"}`}>
                                                    {order.isReady ? <PackageCheck size={14} aria-hidden="true" /> : <Clock3 size={14} aria-hidden="true" />}
                                                    {order.isReady ? "準備完了" : "準備中"}
                                                </span>
                                            </div>
                                            <div className="px-4 py-4 sm:px-5">
                                                <div className="flex flex-col gap-2">
                                                    {order.cartItems.map((item) => (
                                                        <div key={item.id} className="flex items-center justify-between gap-3 text-sm">
                                                            <span className="min-w-0 truncate font-medium text-(--text-color)">
                                                                {item.product.name}<span className="ml-2 text-(--text-color-sub)">× {item.count}</span>
                                                            </span>
                                                            <span className="shrink-0 font-semibold text-(--text-color-sub)">¥{(item.product.price * item.count).toLocaleString("ja-JP")}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="mt-4 flex items-end justify-between border-t border-(--container-background-sub)/60 pt-3">
                                                    <span className="text-sm text-(--text-color-sub)">{itemCount}点</span>
                                                    <span className="text-xl font-bold text-(--text-color)">¥{orderTotal.toLocaleString("ja-JP")}</span>
                                                </div>
                                                {!order.isReady && (
                                                    <Button
                                                        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-(--primary) px-4 py-3 text-sm font-bold text-(--background) shadow-sm transition-transform hover:scale-[1.01] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
                                                        disabled={updateOrder.waiting}
                                                        onClick={() => updateOrder.request(order.id)}
                                                    >
                                                        <CheckCircle2 size={17} aria-hidden="true" />準備完了にする
                                                    </Button>
                                                )}
                                            </div>
                                        </article>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </Content>
            </ContentWrapper>
        </AppView>
    )
}