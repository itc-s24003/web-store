"use client";


import { AppDB_Types } from "@/libs/db";
import { EditorLayout, EditorLayout_Props } from "./_editor";
import { useState } from "react";
import { Display_Product } from "@/libs/element/display/product";
import { API_Client } from "@/app/api/app/client";
import { useAPI } from "@/libs/element/state/useAPI";
import { Button } from "@/libs/element/button";
import { Select } from "@/libs/element/form/template/select";
import { ArrowLeft, ImageIcon, PackagePlus, Pencil, Save, Trash2 } from "lucide-react";
import Image from "next/image";
import { Input } from "@/libs/element/form/template/input";
import { Label } from "@/libs/element/form/template/label";
import { Textarea } from "@/libs/element/form/template/textarea";
import { Option } from "@/libs/element/form/template/select/option";

type Editor_Product_Props = {
    groups: AppDB_Types["productGroup"]["edit"][],
    products: AppDB_Types["product"]["edit"][],
    onChangeData: (product: AppDB_Types["product"]["edit"][]) => void
} & EditorLayout_Props;

export function Editor_Product({ groups, products, onChangeData, ...props }: Editor_Product_Props) {
    const [target, setTarget] = useState<AppDB_Types["product"]["edit"] | null>(null);
    const [showImagePicker, setShowImagePicker] = useState<boolean>(false);


    const [groupId, setGroupId] = useState<string | null>(groups[0]?.id ?? null);
    const add = useAPI(async () => {
        if (!groupId) return;
        const product = await API_Client.staff.admin.product.add({
            name: "新しい商品",
            description: "",
            price: 0,
            groupId: groupId,
        }).catch(() => null);
        if (product?.body.success) {
            onChangeData([...products, product.body.data]);
        }
    })

    const save = useAPI(async () => {
        if (!target) return;
        const res = await API_Client.staff.admin.product.update(target.id, {
            name: target.name,
            description: target.description,
            price: target.price,
            groupId: target.groupId,
            showStockDetail: target.showStockDetail,
            stock: target.stock,
            imgId: target.img?.id ?? null
        }).catch(() => null);
        if (res?.body.success) {
            onChangeData(products.map((p) => p.id === target.id ? { ...p, ...target } : p));
        }
    })

    const remove = useAPI(async (id: string) => {
        const res = await API_Client.staff.admin.product.remove(id).catch(() => null);
        if (res?.body.success) {
            onChangeData(products.filter((p) => p.id !== id));
            setTarget(null);
        }
    })
    

    const filteredProducts = groupId ? products.filter((p) => p.groupId === groupId) : products;
    
    
    return (
        <EditorLayout {...props} showImagePicker={showImagePicker} onSelectImage={(img) => {
            if (target) setTarget({ ...target, img: img });
            setShowImagePicker(false);
        }} onCancel={() => {
            if (target) setTarget({ ...target, img: null });
            setShowImagePicker(false);
        }}>
            {
                target ? (
                    <div className="mx-auto flex w-full max-w-3xl flex-col gap-5 py-4">
                        <div className="flex items-center justify-between">
                            <Button
                                onClick={() => setTarget(null)}
                                className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-(--text-color-sub) transition-colors hover:bg-(--container-background-sub)/40"
                            >
                                <ArrowLeft size={18} />
                                商品一覧に戻る
                            </Button>
                            
                        </div>
                        <div className="overflow-hidden rounded-2xl border border-(--container-background-sub) bg-(--container-background) shadow-lg">
                            <div className="border-b border-(--container-background-sub) bg-(--app-theme-sub) px-5 py-4 text-(--app-theme-text)">
                                <p className="text-xs font-semibold uppercase tracking-[0.18em] opacity-70">Product editor</p>
                                <h2 className="mt-1 text-xl font-bold">{target.name || "名前未設定の商品"}</h2>
                            </div>
                            <div className="grid gap-6 p-5 md:grid-cols-[240px_1fr] md:p-7">
                                <div>
                                    <button
                                        type="button"
                                        onClick={() => setShowImagePicker(true)}
                                        className="group relative block w-full overflow-hidden rounded-xl border border-(--container-background-sub) bg-(--background) text-left shadow-sm"
                                        aria-label="商品画像を変更"
                                    >
                                        <Image src={target.img?.url || "/picture.png"} alt="" width={300} height={300} className="aspect-square w-full object-cover transition-transform group-hover:scale-105"/>
                                        <span className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-2 bg-(--app-theme-sub)/85 px-2 py-3 text-sm font-semibold text-(--app-theme-text) opacity-0 transition-opacity group-hover:opacity-100">
                                            <ImageIcon size={16} />
                                            画像を変更
                                        </span>
                                    </button>
                                    <p className="mt-2 text-center text-xs text-(--text-color-sub)">画像をクリックして変更</p>
                                </div>
                                <div className="flex flex-col gap-4">
                                    <Label className="gap-1">
                                        商品名
                                        <Input
                                            type="text" value={target.name} className="text-base"
                                            onChange={(e) => setTarget({ ...target, name: e.target.value })}
                                        />
                                    </Label>
                                    <Label className="gap-1">
                                        説明
                                        <Textarea
                                            value={target.description} rows={4} className="w-full resize-y text-base"
                                            onChange={(e) => setTarget({ ...target, description: e.target.value })}
                                        />
                                    </Label>
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <Label className="gap-1">
                                            価格（円）
                                            <Input type="number" min="0" value={target.price} className="text-base"
                                                onChange={(e) => setTarget({ ...target, price: parseFloat(e.target.value) })}
                                            />
                                        </Label>
                                        <Label className="gap-1">
                                            在庫数
                                            <Input
                                                type="number" min="0" value={target.stock} className="text-base"
                                                onChange={(e) => setTarget({ ...target, stock: parseInt(e.target.value) })}
                                            />
                                        </Label>
                                    </div>
                                    <label className="flex cursor-pointer items-center justify-between rounded-lg border border-(--container-background-sub) bg-(--background) px-4 py-3 text-sm font-medium text-(--text-color)">
                                        <span>
                                            <span className="block font-semibold">在庫数を表示</span>
                                            <span className="mt-0.5 block text-xs font-normal text-(--text-color-sub)">購入者に在庫数を公開します</span>
                                        </span>
                                        <input type="checkbox" checked={target.showStockDetail} className="size-5 accent-(--primary)" onChange={(e) => {
                                            setTarget({ ...target, showStockDetail: e.target.checked });
                                        }} />
                                    </label>
                                    <div className="mt-1 flex flex-col gap-2 border-t border-(--container-background-sub) pt-4 sm:flex-row">
                                        <Button onClick={() => save.request()} className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-(--primary) px-4 py-3 font-semibold text-(--app-theme-text) shadow-sm transition-opacity hover:opacity-90">
                                            <Save size={18} />
                                            {save.waiting ? "保存中..." : "変更を保存"}
                                        </Button>
                                        <Button onClick={() => remove.request(target.id)} className="inline-flex items-center justify-center gap-2 rounded-lg border border-(--error)/30 px-4 py-3 font-semibold text-(--error) transition-colors hover:bg-(--error)/10">
                                            <Trash2 size={18} />
                                            {remove.waiting ? "削除中..." : "削除"}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 py-4">
                        <div className="flex flex-col justify-between gap-4 rounded-2xl bg-(--app-theme-sub) p-5 text-(--app-theme-text) shadow-md sm:flex-row sm:items-center sm:p-6">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.18em] opacity-70">Product management</p>
                                <h2 className="mt-1 text-2xl font-bold">商品管理</h2>
                                <p className="mt-1 text-sm opacity-80">商品情報や在庫を管理できます</p>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <PackagePlus size={20} />
                                <span>{filteredProducts.length} 件の商品</span>
                            </div>
                        </div>
                        <div className="flex flex-col gap-3 rounded-xl border border-(--container-background-sub) bg-(--container-background) p-4 shadow-sm sm:flex-row sm:items-center">
                            <div className="flex-1">
                                <p className="text-sm font-bold text-(--text-color)">新しい商品を追加</p>
                                <p className="mt-0.5 text-xs text-(--text-color-sub)">追加先のグループを選択してください</p>
                            </div>
                            <Select value={groupId ?? ""} onChange={(e) => setGroupId(e.target.value)} className="w-full sm:w-56">
                                <Option value={""}>グループを選択</Option>
                                {
                                    groups.map((g) => (
                                        <Option key={g.id} value={g.id}>{g.name}</Option>
                                    ))
                                }
                            </Select>
                            <Button onClick={() => add.request()} disabled={!groupId || add.waiting} className="inline-flex items-center justify-center gap-2 rounded-lg bg-(--primary) px-4 py-2 font-semibold text-(--app-theme-text) transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50">
                                <PackagePlus size={18} />
                                {add.waiting ? "追加中..." : "商品を追加"}
                            </Button>
                        </div>
                        {filteredProducts.length > 0 ? (
                            <div className="grid gap-4 md:grid-cols-2">
                                {
                                    filteredProducts.map((p) => (
                                        <Display_Product key={p.id} imgSrc={p.img?.url} name={p.name} price={p.price} description={p.description} onClick={() => setTarget(p)} className="w-full max-w-none cursor-pointer transition-all hover:-translate-y-0.5 hover:border-(--primary) hover:shadow-lg">
                                        </Display_Product>
                                    ))
                                }
                            </div>
                        ) : (
                            <div className="rounded-2xl border border-dashed border-(--container-background-sub) bg-(--container-background) px-6 py-12 text-center">
                                <PackagePlus className="mx-auto text-(--text-color-sub)" size={32} />
                                <p className="mt-3 font-semibold text-(--text-color)">商品がありません</p>
                                <p className="mt-1 text-sm text-(--text-color-sub)">上のフォームから商品を追加してください</p>
                            </div>
                        )}
                    </div>
                )
            }
        </EditorLayout>
    )
}