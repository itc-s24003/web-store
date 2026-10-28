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
import { Barcode, QrCode } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { API_Client } from "../api/app/client"

type PageViewProps = {
    store: AppDB_Types["store"]["model"],
    languages: AppDB_Types["language"]["model"][]
}

export function PageView({ store, languages }: PageViewProps) {
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




    const [orders, setOrders] = useState<AppDB_Types["order"]["model"][]>([]);
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
                    <div className="flex-1 flex flex-col gap-2 py-2">
                        {
                            orders.map((order) => {
                                const totalPrice = order.cartItems.reduce((acc, item) => acc + (item.product.price * item.count), 0);
                                return (
                                    <div key={order.id} className="flex flex-col gap-2 py-2 px-4 bg-(--container-background) rounded-md md:mx-auto md:max-w-lg md:min-w-lg">
                                        <div className="flex items-center justify-between border-b text-2xl font-bold">
                                            <span>注文番号</span>
                                            <span>{order.index}</span>
                                        </div>
                                        <div className="flex items-center justify-between border-b text-2xl font-bold">
                                            <span>合計金額</span>
                                            <span>¥{totalPrice}</span>
                                        </div>
                                        <div className="flex items-center justify-between border-b text-2xl font-bold">
                                            <span>受け取り済み</span>
                                            <span>{order.isReceived ? "はい" : "いいえ"}</span>
                                        </div>
                                        <details>
                                            <summary className="text-2xl font-bold">
                                                注文内容
                                            </summary>
                                            {
                                                order.cartItems.map((item) => (
                                                    <div key={item.id} className="flex items-center justify-between border-b text-2xl font-bold">
                                                        <span>{item.product.name} x {item.count}</span>
                                                        <span>¥{item.product.price * item.count}</span>
                                                    </div>
                                                ))
                                            }
                                        </details>
                                    </div>
                                )
                            })
                        }
                    </div>
                    <div>
                        <div className="flex items-center justify-between border-b text-2xl font-bold">
                            <span>合計金額</span>
                            <span>¥{allTotalPrice}</span>
                        </div>
                    </div>
                    <div className="flex justify-center gap-2 py-2">
                        <Button
                            className="flex items-center p-2 bg-white rounded-lg text-xl font-bold gap-1"
                            onClick={() => {
                                setShowQR_Reader(true)
                                camera.startCamera();
                                qr.clearResult();
                            }}
                        >
                            <QrCode />QRを読み取る
                        </Button>
                        <Button
                            hidden={orders.length === 0}
                            className="flex items-center p-2 bg-white rounded-lg text-xl font-bold gap-1"
                            onClick={() => {
                                orders.forEach((order) => {
                                    API_Client.staff.order.update(order.id, { isReceived: true });
                                });
                                setOrders([]);
                            }}
                        >
                            受け取り済みにする
                        </Button>
                    </div>
                </Content>
                <Navigation />
                <Popup hidden={!showQR_Reader} className="flex flex-col gap-4 bg-black/50">
                    <video ref={video} autoPlay playsInline className="bg-white rounded-lg opacity-0 absolute" hidden/>
                    <canvas ref={canvas} width={size} height={size}/>
                    <Button
                        className="p-2 rounded-lg text-lg font-bold bg-(--container-background)"
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