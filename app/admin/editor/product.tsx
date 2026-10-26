"use client";


import { AppDB_Types } from "@/libs/db";
import { EditorLayout, EditorLayout_Props } from "./_editor";
import { useState } from "react";
import { Display_Product } from "@/libs/element/display/product";
import { API_Client } from "@/app/api/app/client";
import { useAPI } from "@/libs/element/state/useAPI";
import { Button } from "@/libs/element/button";
import { Select } from "@/libs/element/form/template/select";
import { ArrowLeft } from "lucide-react";
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
                    <div className="flex flex-col items-center gap-2 py-2">
                        <div className="w-full">
                            <Button onClick={() => setTarget(null)}>
                                <ArrowLeft />
                            </Button>
                        </div>
                        <div className="p-4 rounded-xl border shrink-1 size-fit">
                            <Image src={target.img?.url || "/picture.png"} alt={""} width={300} height={300} className="aspect-square object-cover" onClick={() => setShowImagePicker(true)}/>
                            <div className="flex flex-col gap-2 pt-2">
                                <Label>
                                    商品名
                                    <Input
                                        type="text" value={target.name} className="text-lg"
                                        onChange={(e) => setTarget({ ...target, name: e.target.value })}
                                    />
                                </Label>
                                <Label>
                                    説明
                                    <Textarea
                                        value={target.description} className="w-full text-lg"
                                        onChange={(e) => setTarget({ ...target, description: e.target.value })}
                                    />
                                </Label>
                                <Label>
                                    価格
                                    <Input type="number" value={target.price} className="text-lg"
                                        onChange={(e) => setTarget({ ...target, price: parseFloat(e.target.value) })}
                                    />
                                </Label>
                                <Label>
                                    在庫表示
                                    <input type="checkbox" checked={target.showStockDetail} onChange={(e) => {
                                        setTarget({ ...target, showStockDetail: e.target.checked });
                                    }} />
                                </Label>
                                <Label>
                                    在庫数
                                    <Input
                                        type="number" value={target.stock} className="text-lg"
                                        onChange={(e) => setTarget({ ...target, stock: parseInt(e.target.value) })}
                                    />
                                </Label>
                                <Button onClick={() => save.request()} className="bg-(--primary) p-2 rounded-md">
                                    {
                                        save.waiting ? "保存中..." : "保存"
                                    }
                                </Button>
                                <Button onClick={() => remove.request(target.id)} className="bg-(--error) p-2 rounded-md">
                                    {
                                        remove.waiting ? "削除中..." : "削除"
                                    }
                                </Button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col gap-2 py-2">
                        <Display_Product key={"new"} name={"新しい商品"}>
                            <Select value={groupId ?? ""} onChange={(e) => setGroupId(e.target.value)}>
                                <Option value={""}>グループを選択</Option>
                                {
                                    groups.map((g) => (
                                        <Option key={g.id} value={g.id} onClick={() => setGroupId(g.id)}>{g.name}</Option>
                                    ))
                                }
                            </Select>
                            <Button onClick={() => add.request()} className="bg-(--primary) p-2 rounded-md">
                                {
                                    add.waiting ? "追加中..." : "追加"
                                }
                            </Button>
                        </Display_Product>
                        {
                            filteredProducts.map((p) => (
                                <Display_Product key={p.id} imgSrc={p.img?.url} name={p.name} price={p.price} description={p.description} onClick={() => setTarget(p)}>
                                </Display_Product>
                            ))
                        }
                    </div>
                )
            }
        </EditorLayout>
    )
}