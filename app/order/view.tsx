"use client"


import { AppDB_Types } from "@/libs/db";
import { AppView } from "@/libs/element/layout";
import { Content } from "@/libs/element/layout/content";
import { ContentWrapper } from "@/libs/element/layout/contentWrapper";
import { Header } from "@/libs/element/layout/header";
import { Navigation } from "@/libs/element/layout/navigation";
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
                    <div className="flex flex-col gap-2 py-2">
                        {
                            orders.map((order) => {
                                const total = order.cartItems.reduce((acc, item) => acc + (item.product.price * item.count), 0);
                                
                                return (
                                    <div key={order.id} className="flex flex-col gap-2 p-4 bg-(--container-background) rounded-md">
                                        <div className="">
                                            <div className="flex items-center justify-between">
                                                <span className="text-2xl font-bold">注文番号: {order.index}</span>
                                                {
                                                    order.isReceived ? (
                                                        <span className="text-(--secondary) font-bold p-1 rounded-md">
                                                            受け取り済み
                                                        </span>
                                                    ) : order.isReady ? (
                                                        <span className="bg-(--app-theme) text-(--app-theme-text) font-bold p-1 rounded-md">
                                                            準備完了
                                                        </span>
                                                    ) : (
                                                        <span className="bg-(--app-theme-sub) text-(--app-theme-text) font-bold p-1 rounded-md">
                                                            準備中
                                                        </span>
                                                    )
                                                }
                                            </div>
                                            <div>合計金額: {total.toLocaleString()} 円</div>
                                            <div>注文日時: {new Date(order.requestedAt).toLocaleString()}</div>
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            {
                                                order.cartItems.map((item) => (
                                                    <div key={item.id} className="flex items-center gap-2 p-2 bg-(--app-theme-sub) text-(--app-theme-text) rounded-md">
                                                        <div key={item.id} className="flex items-center gap-2">
                                                            <div className="w-12 h-12 relative">
                                                                <Image src={item.product.img?.url ?? "/picture.png"} alt={""} width={50} height={50} className="w-full h-full object-cover rounded-md bg-(--container-background)" />
                                                            </div>
                                                            <div className="flex flex-col gap-1">
                                                                <div className="font-bold">{item.product.name}</div>
                                                                <div>数量: {item.count}</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    </div>
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