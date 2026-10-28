"use client"


import { API_Client } from "@/app/api/app/client";
import { AppDB_Types } from "@/libs/db";
import { Button } from "@/libs/element/button";
import { Display_Product } from "@/libs/element/display/product";
import { Select } from "@/libs/element/form/template/select";
import { Option } from "@/libs/element/form/template/select/option";
import { AppView } from "@/libs/element/layout";
import { Content } from "@/libs/element/layout/content";
import { ContentWrapper } from "@/libs/element/layout/contentWrapper";
import { Header } from "@/libs/element/layout/header";
import { Navigation } from "@/libs/element/layout/navigation";
import { useAPI } from "@/libs/element/state/useAPI";
import Link from "next/link";
import { useState } from "react";

type PageView_Props = {
    languages: AppDB_Types["language"]["model"][],
    productGroup: AppDB_Types["productGroup"]["detail"]
}

export function PageView({ languages, productGroup }: PageView_Props) {
    return (
        <AppView>
            <Header
                languages={languages}
                userLanguageId=""
                title={"オンラインストア"} toast={3}
            />
            <ContentWrapper>
                <Content>
                    <div className="flex flex-col gap-2 py-2 sm:flex-row sm:flex-wrap items-center sm:justify-center">
                        {
                            productGroup.products.map((p) => (
                                <span key={p.id} className="w-full sm:size-fit flex justify-center">
                                    <ProductView key={p.id} product={p} className="flex-1"/>
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



type ProductView_Props = {
    product: AppDB_Types["product"]["model"]
} & React.JSX.IntrinsicElements["div"]

function ProductView({ product, ...props }: ProductView_Props) {
    const [count, setCount] = useState<number>(1);
    const addCart = useAPI(async () => {
        const res = await API_Client.user.cartItem.add({
            productId: product.id,
            count
        })
    })
    
    
    return (
        <Display_Product key={product.id} name={product.name} imgSrc={product.img?.url} price={product.price} {...props}>
            <div className="flex-1 flex flex-col gap-2 justify-end">
                <Select value={count} onChange={(e) => setCount(Number(e.target.value))} className="text-lg">
                    {
                        Array.from({ length: 5 }, (_, i) => i + 1).map((n) => (
                            <Option key={n} value={n}>x{n}</Option>
                        ))
                    }
                </Select>
                <Button onClick={() => addCart.request()} className="rounded-full w-full bg-(--app-theme) text-(--app-theme-text)">
                    <div className="bg-white/5 p-2 rounded-full">
                        {
                            addCart.waiting ? "追加中..." : "カートに追加"
                        }
                    </div>
                </Button>
            </div>
        </Display_Product>
    )
}