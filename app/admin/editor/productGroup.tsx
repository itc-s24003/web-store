import { AppDB_Types } from "@/libs/db";
import { EditorLayout, EditorLayout_Props } from "./_editor";
import { useState } from "react";
import Image from "next/image";
import { useAPI } from "@/libs/element/state/useAPI";
import { API_Client } from "@/app/api/app/client";
import { Label } from "@/libs/element/form/template/label";
import { Input } from "@/libs/element/form/template/input";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/libs/element/button";
import { Display_ProductGroup } from "@/libs/element/display/productGroup";


type Editor_ProductGroup_Props = {
    productGroups: AppDB_Types["productGroup"]["edit"][],
    onChangeData: (productGroups: AppDB_Types["productGroup"]["edit"][]) => void
} & EditorLayout_Props;

export function Editor_ProductGroup({ productGroups, onChangeData, ...props }: Editor_ProductGroup_Props) {
    const [createMode, setCreateMode] = useState<boolean>(false);
    const [showImagePicker, setShowImagePicker] = useState<boolean>(false);
    const [target, setTarget] = useState<AppDB_Types["productGroup"]["edit"] | null>(null);

    
    const add = useAPI(async () => {
        const productGroup = await API_Client.staff.admin.productGroup.add({
            name: "新しい商品グループ",
            imgId: null,
            showTop: false
        }).catch(() => null);
        if (productGroup?.body.success) {
            onChangeData([...productGroups, productGroup.body.data]);
        }
    })

    const save = useAPI(async () => {
        if (!target) return;
        const res = await API_Client.staff.admin.productGroup.update(target.id, {
            name: target.name,
            imgId: target.img?.id ?? null,
            showTop: target.showTop
        }).catch(() => null);
        if (res?.body.success) {
            onChangeData(productGroups.map((pg) => pg.id === target.id ? { ...pg, ...target } : pg));
        }
    })

    const remove = useAPI(async (id: string) => {
        const res = await API_Client.staff.admin.productGroup.remove(id).catch(() => null);
        if (res?.body.success) {
            onChangeData(productGroups.filter((pg) => pg.id !== id));
            setTarget(null);
        }
        setTarget(null);
    })
    
    return (
        <EditorLayout {...props}
            onSelectImage={(img) => {
                if (target) setTarget({ ...target, img: img });
                setShowImagePicker(false);
            }}
            onCancel={() => {
                if (target) setTarget({ ...target, img: null });
                setShowImagePicker(false);
            }}
            showImagePicker={showImagePicker}
        >
            {
                target ? (
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-full">
                            <Button onClick={() => setTarget(null)}>
                                <ArrowLeft />
                            </Button>
                        </div>
                        <div className="p-4 rounded-xl border shrink-1 size-fit">
                            <Image src={target.img?.url || "/picture.png"} alt={""} width={300} height={300} className="aspect-square object-cover" onClick={() => setShowImagePicker(true)}/>
                            <div className="flex flex-col gap-2 pt-2">
                                <Label>
                                    商品グループ名
                                    <Input
                                        className="text-lg"
                                        value={target.name} onChange={(e) => {
                                        setTarget({ ...target, name: e.target.value });
                                    }} />
                                </Label>
                                <Label>
                                    トップに表示する
                                    <input type="checkbox" checked={target.showTop} onChange={(e) => {
                                        setTarget({ ...target, showTop: e.target.checked });
                                    }} />
                                </Label>
                                <Button onClick={() => save.request()} className="bg-(--primary) text-white p-2 rounded-md">
                                    {
                                        save.waiting ? "保存中..." : "保存"
                                    }
                                </Button>
                                <Button onClick={() => remove.request(target.id)} className="bg-(--error) text-white p-2 rounded-md">
                                    {
                                        remove.waiting ? "削除中..." : "削除"
                                    }
                                </Button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col gap-2">
                        <Display_ProductGroup name={"新しい商品グループ"} onClick={() => add.request()}>
                            クリックして新しい商品グループを作成
                        </Display_ProductGroup>
                        {
                            productGroups.map((pg) => (
                                <Display_ProductGroup key={pg.id} imgSrc={pg.img?.url} name={pg.name} onClick={() => setTarget(pg)}/>
                            ))
                        }
                    </div>
                )
            }
        </EditorLayout>
    )
}
