"use client"


import { AppDB_Types } from "@/libs/db"
import { Button } from "@/libs/element/button"
import { AppView } from "@/libs/element/layout"
import { Content } from "@/libs/element/layout/content"
import { ContentWrapper } from "@/libs/element/layout/contentWrapper"
import { Header } from "@/libs/element/layout/header"
import { Navigation } from "@/libs/element/layout/navigation"
import { Popup } from "@/libs/element/popup"
import { useAPI } from "@/libs/element/state/useAPI"
import { useCamera } from "@/libs/element/state/useCamera"
import { useQR_Reader } from "@/libs/element/state/useQR_Reader"
import { useVideo } from "@/libs/element/state/useVideo"
import { CheckCircle2, Clock3, PackageCheck, QrCode, ScanLine, ShoppingBag } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { API_Client } from "../api/app/client"

type PageViewProps = {
    store: AppDB_Types["store"]["model"],
    languages: AppDB_Types["language"]["model"][],
    orders: AppDB_Types["order"]["model"][]
}

export function PageView({ store, languages, orders: o }: PageViewProps) {
    const [showQR_Reader, setShowQR_Reader] = useState(false);
    
    const video = useRef<HTMLVideoElement>(null);
    const canvas = useRef<HTMLCanvasElement>(null);
    const [size, setSize] = useState(0);
    const camera = useCamera();
    const qr = useQR_Reader(canvas, (code) => {
        setShowQR_Reader(false);
        camera.stopCamera();
    }, true);
    useVideo(video, (video) => {
        const minSize = Math.min(video.videoWidth, video.videoHeight);
        setSize(minSize);
        
        if (canvas.current) {
            const ctx = canvas.current.getContext("2d");
            const px = (video.videoWidth - minSize) / 2;
            const py = (video.videoHeight - minSize) / 2;
            if (ctx) {
                ctx.drawImage(video, px, py, minSize, minSize, 0, 0, minSize, minSize);
                qr.readQRCode();
            }
        }
    });
    useEffect(() => {
        if (video.current && camera.media) {
            video.current.srcObject = camera.media;
            video.current.play();
        }
    }, [camera]);




    const [orders, setOrders] = useState<AppDB_Types["order"]["model"][]>(o);
    const get = useAPI(async (key: string) => {
        const res = await API_Client.staff.userVerifyKey.__key.order.get(key);
        if (res?.body.success) {
            setOrders(res.body.data);
        }
    });

    useEffect(() => {
        if (qr.qrText) {
            get.request(qr.qrText);
        }
    }, [qr.qrText]);
    
    
    const allTotalPrice = orders.reduce((acc, order) => {
        const totalPrice = order.cartItems.reduce((acc, item) => acc + (item.product.price * item.count), 0);
        return acc + totalPrice;
    }, 0);
    
    return (
        <AppView>
            <Header languages={languages} userLanguageId={null} title={store.name} />
            <ContentWrapper>
                <Content>
                    <div className="mx-auto flex w-full max-w-3xl flex-col gap-5 py-5">
                        <section className="rounded-2xl bg-(--app-theme-sub) p-5 text-(--app-theme-text) shadow-lg">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <p className="text-sm font-medium tracking-wide opacity-75">STAFF DASHBOARD</p>
                                    <h1 className="mt-1 text-2xl font-bold tracking-tight">受け取り管理</h1>
                                    <p className="mt-1 text-sm opacity-75">QRコードを読み取って注文を確認できます</p>
                                </div>
                                <div className="rounded-xl bg-(--app-theme-text)/10 p-3">
                                    <ShoppingBag size={25} aria-hidden="true" />
                                </div>
                            </div>
                            <div className="mt-5 grid grid-cols-2 gap-3">
                                <div className="rounded-xl bg-(--app-theme-text)/10 px-4 py-3">
                                    <div className="flex items-center gap-2 text-sm opacity-75">
                                        <Clock3 size={15} aria-hidden="true" />
                                        未受け取り
                                    </div>
                                    <p className="mt-1 text-2xl font-bold">{orders.length}<span className="ml-1 text-sm font-medium">件</span></p>
                                </div>
                                <div className="rounded-xl bg-(--app-theme-text)/10 px-4 py-3">
                                    <div className="flex items-center gap-2 text-sm opacity-75">
                                        <PackageCheck size={15} aria-hidden="true" />
                                        合計金額
                                    </div>
                                    <p className="mt-1 text-2xl font-bold">¥{allTotalPrice.toLocaleString("ja-JP")}</p>
                                </div>
                            </div>
                        </section>

                        <div className="flex flex-col gap-3 sm:flex-row">
                            <Button
                                hidden={orders.length === 0}
                                className="flex min-h-14 flex-1 items-center justify-center gap-2 rounded-xl bg-(--container-background) px-4 py-3 text-base font-bold text-(--text-color) shadow-sm ring-1 ring-(--container-background-sub) transition-transform hover:scale-[1.01] active:scale-[0.99]"
                                onClick={() => {
                                    orders.forEach((order) => {
                                        API_Client.staff.order.update(order.id, { isReceived: true });
                                    });
                                    setOrders([]);
                                }}
                            >
                                <CheckCircle2 size={21} className="text-(--success)" aria-hidden="true" />すべて受け取り済みにする
                            </Button>
                            <Button
                                className="flex min-h-14 flex-1 items-center justify-center gap-2 rounded-xl bg-(--primary) px-4 py-3 text-base font-bold text-(--background) shadow-md transition-transform hover:scale-[1.01] active:scale-[0.99]"
                                onClick={() => {
                                    setShowQR_Reader(true)
                                    camera.startCamera();
                                    qr.clearResult();
                                }}
                            >
                                <QrCode size={21} aria-hidden="true" />QRを読み取る
                            </Button>
                        </div>

                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-bold text-(--text-color)">注文一覧</h2>
                                <p className="text-sm text-(--text-color-sub)">受け取り前の注文を表示しています</p>
                            </div>
                            <span className="rounded-full bg-(--container-background) px-3 py-1 text-sm font-semibold text-(--text-color-sub)">
                                {orders.length}件
                            </span>
                        </div>

                        {orders.length === 0 ? (
                            <div className="flex flex-col items-center rounded-2xl border border-dashed border-(--container-background-sub) bg-(--container-background)/70 px-6 py-12 text-center">
                                <div className="rounded-full bg-(--success)/15 p-4 text-(--success)">
                                    <CheckCircle2 size={32} aria-hidden="true" />
                                </div>
                                <h2 className="mt-4 text-lg font-bold text-(--text-color)">すべて受け取り済みです</h2>
                                <p className="mt-1 text-sm text-(--text-color-sub)">新しい注文はQRコードから確認できます</p>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-3">
                                {orders.map((order) => {
                                    const totalPrice = order.cartItems.reduce((acc, item) => acc + (item.product.price * item.count), 0);
                                    return (
                                        <article key={order.id} className="overflow-hidden rounded-2xl bg-(--container-background) shadow-sm ring-1 ring-(--container-background-sub)/60">
                                            <div className="flex items-center justify-between border-b border-(--container-background-sub)/60 px-5 py-4">
                                                <div>
                                                    <p className="text-xs font-semibold tracking-wider text-(--text-color-sub)">ORDER</p>
                                                    <h3 className="mt-0.5 text-xl font-bold text-(--text-color)">#{order.index}</h3>
                                                </div>
                                                <span className="inline-flex items-center gap-1.5 rounded-full bg-(--warning)/15 px-3 py-1.5 text-xs font-bold text-(--warning)">
                                                    <Clock3 size={14} aria-hidden="true" />
                                                    未受け取り
                                                </span>
                                            </div>
                                            <div className="px-5 py-4">
                                                <div className="flex items-end justify-between">
                                                    <span className="text-sm text-(--text-color-sub)">合計金額</span>
                                                    <span className="text-2xl font-bold text-(--text-color)">¥{totalPrice.toLocaleString("ja-JP")}</span>
                                                </div>
                                                <details className="group mt-4 border-t border-(--container-background-sub)/60 pt-3">
                                                    <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-semibold text-(--text-color-sub)">
                                                        <span className="flex items-center gap-2"><ShoppingBag size={16} aria-hidden="true" />注文内容（{order.cartItems.length}品）</span>
                                                        <span className="transition-transform group-open:rotate-180">⌄</span>
                                                    </summary>
                                                    <div className="mt-3 flex flex-col gap-2">
                                                        {order.cartItems.map((item) => (
                                                            <div key={item.id} className="flex items-center justify-between text-sm text-(--text-color-sub)">
                                                                <span>{item.product.name} <span className="text-xs">× {item.count}</span></span>
                                                                <span className="font-semibold text-(--text-color)">¥{(item.product.price * item.count).toLocaleString("ja-JP")}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </details>
                                            </div>
                                        </article>
                                    )
                                })}
                            </div>
                        )}

                    </div>
                </Content>
                <Navigation />
                <Popup hidden={!showQR_Reader} className="z-50 flex flex-col gap-5 bg-(--app-theme-sub)/95 px-6">
                    <div className="w-full max-w-sm text-center text-(--app-theme-text)">
                        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-(--primary)">
                            <ScanLine size={25} aria-hidden="true" />
                        </div>
                        <h2 className="text-xl font-bold">QRコードを読み取る</h2>
                        <p className="mt-1 text-sm opacity-75">注文者のQRコードを枠内に合わせてください</p>
                    </div>
                    <div className="relative overflow-hidden rounded-2xl bg-(--container-background) p-3 shadow-2xl">
                        <video ref={video} autoPlay playsInline className="absolute h-0 w-0 opacity-0" hidden/>
                        <canvas ref={canvas} width={size} height={size} className="h-auto w-full max-w-sm rounded-xl"/>
                    </div>
                    <Button
                        className="w-full max-w-sm rounded-xl bg-(--container-background) px-4 py-3 text-base font-bold text-(--text-color) shadow-md"
                        onClick={() => {
                            setShowQR_Reader(false);
                            camera.stopCamera();
                            qr.clearResult()
                        }}
                    >
                        閉じる
                    </Button>
                </Popup>
            </ContentWrapper>
        </AppView>
    )
}