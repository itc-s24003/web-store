"use client";

import { AppDB_Types } from "@/libs/db";
import { AppView } from "@/libs/element/layout";
import { Content } from "@/libs/element/layout/content";
import { ContentWrapper } from "@/libs/element/layout/contentWrapper";
import { Header } from "@/libs/element/layout/header";
import { Navigation } from "@/libs/element/layout/navigation";
import { useState } from "react";
import { Editor_ProductGroup } from "./editor/productGroup";
import { Editor_Product } from "./editor/product";

type PageView_Props = {
    languages: AppDB_Types["language"]["model"][],
    images: AppDB_Types["image"]["model"][],
    productGroups: AppDB_Types["productGroup"]["edit"][],
    products: AppDB_Types["product"]["edit"][],
}

type EditorId = "store" | "language" | "productGroup" | "product" | "serviceKey" | "user";

export function PageView({ languages, images, productGroups, products }: PageView_Props) {
    const [allLanguages, setAllLanguages] = useState<AppDB_Types["language"]["model"][]>(languages);
    const [allImages, setAllImages] = useState<AppDB_Types["image"]["model"][]>(images);
    const [allProductGroups, setAllProductGroups] = useState<AppDB_Types["productGroup"]["edit"][]>(productGroups);
    const [allProducts, setAllProducts] = useState<AppDB_Types["product"]["edit"][]>(products);

    const [editorId, setEditorId] = useState<EditorId>("productGroup");
    
    return (
        <AppView>
            <Header languages={languages} userLanguageId={""} title={""} />
            <ContentWrapper>
                <Content>
                    <select className="p-2 border outline-none w-full" value={editorId} onChange={(e) => setEditorId(e.target.value as EditorId)}>
                        <option value="store">ストア</option>
                        <option value="language">言語</option>
                        <option value="productGroup">商品グループ</option>
                        <option value="product">商品</option>
                        <option value="serviceKey">サービスキー</option>
                        <option value="user">ユーザー</option>
                    </select>
                    <Editor_ProductGroup
                        hidden={editorId !== "productGroup"}
                        images={allImages} productGroups={allProductGroups} onChangeData={(groups) => {
                            setAllProductGroups(groups);
                        }}
                    />
                    <Editor_Product
                        hidden={editorId !== "product"}
                        groups={allProductGroups}
                        images={allImages} products={allProducts} onChangeData={(products) => {
                            setAllProducts(products);
                        }}
                    />
                    
                </Content>
                <Navigation />
            </ContentWrapper>
        </AppView>
    )
}