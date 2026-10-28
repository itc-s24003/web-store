"use client"


import { AppDB_Types } from "@/libs/db";
import { Button } from "@/libs/element/button";
import { Display_Product } from "@/libs/element/display/product";
import { AppView } from "@/libs/element/layout";
import { Content } from "@/libs/element/layout/content";
import { ContentWrapper } from "@/libs/element/layout/contentWrapper";
import { Header } from "@/libs/element/layout/header";
import { Navigation } from "@/libs/element/layout/navigation";
import { useAPI } from "@/libs/element/state/useAPI";
import { LoaderCircle, Minus, Plus, Trash } from "lucide-react";
import { API_Client } from "../api/app/client";
import { useEffect, useState } from "react";
import { useServiceWorker } from "@/libs/element/state/useServiceWorker";

type PageView_Props = {
    languages: AppDB_Types["language"]["model"][],
    cartItems: AppDB_Types["cartItem"]["model"][],
}

export function PageView({ languages, cartItems }: PageView_Props) {
    const [initData, setInitData] = useState(cartItems);
    const [allCartItems, setAllCartItems] = useState<AppDB_Types["cartItem"]["model"][]>(cartItems);
    
    
    const total = allCartItems.reduce((acc, item) => acc + (item.product.price * item.count), 0);

    if (initData !== cartItems) {
        setInitData(cartItems);
        setAllCartItems(cartItems);
    }


    const get = useAPI(async () => {
        const res = await API_Client.user.cartItem.get();
        if (res?.body.success) {
            setAllCartItems(res.body.data);
        }
    })
    
    const { dataQueue, clearQueue } = useServiceWorker();
    useEffect(() => {
        if (dataQueue.length > 0) {
            dataQueue.forEach((data) => {
                if (data.type === "update" && data.data.target === "cart") {
                    get.request();
                }
            });
            clearQueue();
        }
    }, [dataQueue, clearQueue, get]);
    
    
    
    const order = useAPI(async () => {
        const res = await API_Client.user.order.add(allCartItems.map((item) => item.id));
        if (res?.body.success) {
            setAllCartItems([]);
        }
    })
    
    
    return (
        <AppView>
            <Header languages={languages} userLanguageId={""} title={""} />
            <ContentWrapper>
                <Content >
                    <div className="flex flex-col gap-2 py-2 px-4 bg-(--container-background) rounded-b-md md:mx-auto md:max-w-lg md:min-w-lg">
                        <div className="flex items-center justify-between border-b text-2xl font-bold">
                            <span>小計</span>
                            <span>¥{total}</span>
                        </div>
                        <Button
                            className="w-full p-3 rounded-md bg-(--app-theme) text-(--app-theme-text) text-lg font-bold"
                            onClick={() => order.request()}
                        >
                            {
                                order.waiting ?
                                <LoaderCircle className="animate-spin" /> :
                                "オーダーを確定"
                            }
                        </Button>
                    </div>
                    <div className="flex flex-col gap-2 py-2 md:flex-row md:flex-wrap md:justify-center">
                        {
                            allCartItems.map((item) => (
                                <span key={item.id} className="w-full md:size-fit flex justify-center">
                                    <CartItem
                                        cartItem={item}
                                        onUpdate={(count) => {
                                            setAllCartItems((prev) => prev.map((i) => i.id === item.id ? { ...i, count } : i));
                                        }}
                                        onRemove={(itemId) => {
                                            setAllCartItems((prev) => prev.filter((item) => item.id !== itemId));
                                        }}
                                    />
                                </span>
                            ))
                        }
                    </div>
                </Content>
                <Navigation />
            </ContentWrapper>
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
        <Display_Product name={cartItem.product.name} imgSrc={cartItem.product.img?.url} price={cartItem.product.price} className="flex-1">




            <div className="flex-1 flex flex-col justify-end gap-2">
                

                <div className="flex gap-4 items-center flex-wrap">



                    <div
                        className={
                            [
                                "flex items-center justify-between size-fit gap-4 rounded-full  border border-3 ",
                                "border-(--app-theme-sub) transition-colors",
                                update.waiting || remove.waiting ? "bg-(--app-theme-sub) text-(--app-theme-text-sub)" : "bg-(--container-background) text-(--text-color)"
                            ].join(" ")
                        }
                    >
                        <Button
                            className="p-1 rounded-full hover:bg-(--app-theme-sub)/20"
                            onClick={() => {
                                if (cartItem.count > 1) {
                                    update.request(cartItem.count - 1);
                                } else {
                                    remove.request();
                                }
                            }}
                        >
                            {
                                cartItem.count > 1 ? <Minus /> : <Trash />
                            }
                        </Button>
                        <span className="border-b">
                            {cartItem.count}
                        </span>
                        <Button
                            className="p-1 rounded-full hover:bg-(--app-theme-sub)/20"
                            onClick={() => {
                                update.request(cartItem.count + 1);
                            }}
                        >
                            <Plus />
                        </Button>
                    </div>
                    

                    <Button
                        className={
                            [
                                "flex p-1 rounded-full border border-3 border(--app-theme-sub) transition-colors",
                                remove.waiting ? "bg-(--app-theme-sub) text-(--app-theme-text-sub)" : "bg-(--container-background) text-(--text-color)"
                            ].join(" ")
                        }
                        onClick={() => {
                            remove.request();
                        }}
                    >
                        <Trash />削除
                    </Button>


                </div>



            </div>
            
            
            
        </Display_Product>
    )
}
