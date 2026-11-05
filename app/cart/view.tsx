"use client"


import { AppDB_Types } from "@/libs/db";
import { Button } from "@/libs/element/button";
import { AppView } from "@/libs/element/layout";
import { Content } from "@/libs/element/layout/content";
import { ContentWrapper } from "@/libs/element/layout/contentWrapper";
import { Header } from "@/libs/element/layout/header";
import { Navigation } from "@/libs/element/layout/navigation";
import { useAPI } from "@/libs/element/state/useAPI";
import { ArrowBigDown, BellRing, LoaderCircle, Minus, Plus, ReceiptText, ShoppingCart, Trash, X } from "lucide-react";
import { API_Client } from "../api/app/client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useWebPush } from "@/libs/element/state/useWebPush";
import { useAPI_UserDetailMin } from "@/libs/element/state/appAPI/userAPI_UserDetailMin";
import { Popup } from "@/libs/element/popup";

type PageView_Props = {
    store: AppDB_Types["store"]["model"],
    languages: AppDB_Types["language"]["model"][]
}

export function PageView({ store, languages }: PageView_Props) {
    const [allCartItems, setAllCartItems] = useState<AppDB_Types["cartItem"]["model"][]>([]);
    
    
    const total = allCartItems.reduce((acc, item) => acc + (item.product.price * item.count), 0);


    const get = useAPI(async () => {
        const res = await API_Client.user.cartItem.get();
        if (res?.body.success) {
            setAllCartItems(res.body.data);
        }
    })

    useEffect(() => {
        get.request();
    }, [])
    
    
    
    const order = useAPI(async () => {
        const res = await API_Client.user.order.add(allCartItems.filter(item => item.count <= item.product.stock).map((item) => item.id));
        if (res?.body.success) {
            get.request();
        }
    })


    const user = useAPI_UserDetailMin();
    const webpush = useWebPush(() => {
        window.location.reload();
    })

    const reqireRequestWebPush = !(user.user?.subscribe_hash && webpush.hash && webpush.hash === user.user.subscribe_hash) && !user.waiting && !webpush.waiting;
    const [showWebPushPopup, setShowWebPushPopup] = useState(false);
    
    return (
        <AppView>
            <Header languages={languages} userLanguageId={null} title={store.name} />
            <ContentWrapper>
                <Content>
                    <div className="mx-auto flex w-full max-w-2xl flex-col gap-4 py-5">
                        <div className="flex items-end justify-between px-1">
                            <div>
                                <p className="text-xs font-bold tracking-[0.18em] text-(--app-theme-sub)/65">YOUR CART</p>
                                <h1 className="mt-1 text-2xl font-bold tracking-tight text-(--text-color)">カート</h1>
                            </div>
                            <span className="rounded-full bg-(--container-background) px-3 py-1 text-sm font-semibold text-(--text-color-sub)">
                                {allCartItems.length}商品
                            </span>
                        </div>

                        {get.waiting ? (
                            <div className="flex flex-col items-center justify-center rounded-2xl border border-(--container-background-sub) bg-(--container-background) px-6 py-16 text-center shadow-sm">
                                <LoaderCircle size={42} strokeWidth={1.5} className="animate-spin text-(--app-theme-sub)/60" />
                                <h2 className="mt-4 text-lg font-bold text-(--text-color)">取得中...</h2>
                                <p className="mt-1 text-sm text-(--text-color-sub)">カートの内容を読み込んでいます。</p>
                            </div>
                        ) : allCartItems.length === 0 ? (
                            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-(--container-background-sub) bg-(--container-background) px-6 py-16 text-center shadow-sm">
                                <ReceiptText size={42} strokeWidth={1.5} className="text-(--app-theme-sub)/45" />
                                <h2 className="mt-4 text-lg font-bold text-(--text-color)">カートは空です</h2>
                                <p className="mt-1 text-sm text-(--text-color-sub)">商品を追加すると、ここに表示されます。</p>
                            </div>
                        ) : (
                            <>
                                <div className="overflow-hidden rounded-2xl border border-(--container-background-sub)/70 bg-(--container-background) shadow-sm">
                                    <div className="flex items-center justify-between border-b border-(--container-background-sub)/60 px-4 py-4 sm:px-5">
                                        <div className="flex items-center gap-2">
                                            <ShoppingCart size={19} className="text-(--app-theme)" />
                                            <h2 className="font-bold text-(--text-color)">注文内容</h2>
                                        </div>
                                        <Button
                                            className="flex items-center gap-1 rounded-full px-2 py-1 text-sm text-(--text-color-sub) hover:bg-(--app-theme)/10 hover:text-(--app-theme)"
                                            onClick={() => get.request()}
                                            disabled={get.waiting}
                                        >
                                            {
                                                get.waiting ? (
                                                    <LoaderCircle className="animate-spin"/>
                                                ) : (
                                                    "更新"
                                                )
                                            }
                                        </Button>
                                    </div>
                                    <div className="flex items-center justify-between px-4 py-4 sm:px-5">
                                        <span className="text-sm text-(--text-color-sub)">合計金額</span>
                                        <span className="text-2xl font-bold text-(--app-theme)">¥{total.toLocaleString()}</span>
                                    </div>
                                    <div className="px-4 pb-4 sm:px-5">
                                        <Button
                                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-(--app-theme) p-3 text-lg font-bold text-(--app-theme-text) transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                                            onClick={() => {
                                                if (reqireRequestWebPush) {
                                                    setShowWebPushPopup(true);
                                                }
                                                order.request()
                                            }}
                                            disabled={order.waiting}
                                        >
                                            {order.waiting ? <LoaderCircle size={21} className="animate-spin" /> : "オーダーを確定"}
                                        </Button>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-3">
                                    {allCartItems.map((item) => (
                                        <CartItem
                                            key={item.id}
                                            cartItem={item}
                                            onUpdate={(count) => {
                                                setAllCartItems((prev) => prev.map((i) => i.id === item.id ? { ...i, count } : i));
                                            }}
                                            onRemove={(itemId) => {
                                                setAllCartItems((prev) => prev.filter((item) => item.id !== itemId));
                                            }}
                                        />
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </Content>
                <Navigation />
            </ContentWrapper>
            <Popup hidden={!showWebPushPopup} className="z-50 bg-(--app-theme-sub)/70 px-5 backdrop-blur-sm">
                <div
                    className="relative w-full max-w-sm overflow-hidden rounded-3xl bg-(--container-background) shadow-2xl"
                >
                    <Button
                        hidden={webpush.subscribe.waiting}
                        className="absolute right-4 top-5 flex h-9 w-9 items-center justify-center rounded-full text-(--text-color-sub) transition-colors hover:bg-(--container-background-sub)/40"
                        onClick={() => setShowWebPushPopup(false)}
                    >
                        <X size={19} aria-hidden="true" />
                    </Button>
                    <div className="px-6 pb-6 pt-7 text-center">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-(--app-theme)/10 text-(--app-theme)">
                            <BellRing size={30} strokeWidth={1.8} aria-hidden="true" />
                        </div>
                        <h2 id="web-push-popup-title" className="mt-5 text-xl font-bold text-(--text-color)">通知を有効化</h2>
                        <p className="mt-2 text-sm leading-6 text-(--text-color-sub)">
                            注文の準備完了や受け取り可能になった際に、すぐにお知らせします。
                        </p>
                        <div className="mt-6 flex flex-col gap-2">
                            <Button
                                className="w-full rounded-xl bg-(--app-theme) px-4 py-3 text-base font-bold text-(--app-theme-text) transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                                onClick={async () => {
                                    await webpush.subscribe.request();
                                    setShowWebPushPopup(false);
                                }}
                            >
                                {webpush.subscribe.waiting ? "有効化中..." : "通知を有効化する"}
                            </Button>
                            <Button
                                hidden={webpush.subscribe.waiting}
                                className="w-full rounded-xl px-4 py-3 text-sm font-semibold text-(--text-color-sub) transition-colors hover:bg-(--container-background-sub)/30"
                                onClick={() => setShowWebPushPopup(false)}
                            >
                                後で設定する
                            </Button>
                        </div>
                    </div>
                </div>
            </Popup>
        </AppView>
    )
}



type CartItem_Props = {
    cartItem: AppDB_Types["cartItem"]["model"],
    onUpdate: (count: number) => void,
    onRemove: (itemId: string) => void,
}

function CartItem({ cartItem, onUpdate, onRemove }: CartItem_Props) {
    const update = useAPI(async (count: number) => {
        const res = await API_Client.user.cartItem.update(cartItem.id, { count });
        if (res?.body.success) {
            onUpdate(count);
        }
    })

    const remove = useAPI(async () => {
        const res = await API_Client.user.cartItem.remove(cartItem.id);
        if (res?.body.success) {
            onRemove(cartItem.id);
        }
    })
    
    
    return (
        <article className="overflow-hidden rounded-2xl border border-(--container-background-sub)/70 bg-(--container-background) shadow-sm">
            <div className="flex gap-3 p-3 sm:p-4">
                <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-(--container-background-sub) sm:h-28 sm:w-28">
                    <Image src={cartItem.product.img?.url ?? "/picture.png"} alt={cartItem.product.name} fill sizes="112px" className="object-cover" />
                </div>
                <div className="flex min-w-0 flex-1 flex-col gap-2">
                    <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                            <h2 className="truncate text-lg font-bold text-(--text-color)">{cartItem.product.name}</h2>
                            <p className="mt-1 text-sm text-(--text-color-sub)">¥{cartItem.product.price} / 個</p>

                            <p className="mt-1 text-sm text-(--text-color-sub)">
                                {
                                    cartItem.product.showStockDetail ? (
                                        `在庫: ${cartItem.product.stock}個`
                                    ) : (
                                        `予定在庫数: ${cartItem.product.stock}個`
                                    )
                                }
                                <span hidden={cartItem.count <= cartItem.product.stock} className="text-sm text-red-500">※在庫数が不足しています</span>
                            </p>
                        </div>
                        <p className="shrink-0 font-bold text-(--app-theme)">¥{(cartItem.product.price * cartItem.count).toLocaleString()}</p>
                    </div>
                    <div className="mt-auto flex items-center justify-between gap-2">
                        <div
                            className={[
                                "flex items-center gap-3 rounded-full border border-(--app-theme-sub) px-1 py-1 transition-colors",
                                update.waiting || remove.waiting ? "bg-(--app-theme-sub) text-(--app-theme-text-sub)" : "bg-(--background) text-(--text-color)"
                            ].join(" ")}
                        >
                        <Button
                            aria-label={cartItem.count > 1 ? "数量を1つ減らす" : "商品を削除"}
                            className="rounded-full p-1 hover:bg-(--app-theme-sub)/20"
                            onClick={() => {
                                if (cartItem.count > 1) {
                                    update.request(cartItem.count - 1);
                                } else {
                                    remove.request();
                                }
                            }}
                        >
                            {
                                cartItem.count > 1 ? <Minus size={17} /> : <Trash size={16} />
                            }
                        </Button>
                        <span className="min-w-5 text-center text-sm font-bold">
                            {cartItem.count}
                        </span>
                        <Button
                            aria-label="数量を1つ増やす"
                            className="rounded-full p-1 hover:bg-(--app-theme-sub)/20"
                            onClick={() => {
                                update.request(cartItem.count + 1);
                            }}
                        >
                            <Plus size={17} />
                        </Button>
                    </div>
                        <Button
                            className="flex items-center gap-1 rounded-full px-2 py-1 text-sm text-(--text-color-sub) hover:bg-(--error)/10 hover:text-(--error)"
                            onClick={() => remove.request()}
                        >
                            <Trash size={15} />削除
                        </Button>
                    </div>
                </div>
            </div>
        </article>
    )
}
