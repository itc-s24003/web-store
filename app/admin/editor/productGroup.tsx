import { AppDB_Types } from "@/libs/db";
import { EditorLayout, EditorLayout_Props } from "./_editor";
import { useState } from "react";
import Image from "next/image";
import { useAPI } from "@/libs/element/state/useAPI";
import { API_Client } from "@/app/api/app/client";
import { Label } from "@/libs/element/form/template/label";
import { Input } from "@/libs/element/form/template/input";
import { ArrowLeft, ImageIcon, PackagePlus, Pencil, Save, Trash2 } from "lucide-react";
import { Button } from "@/libs/element/button";
import { Display_ProductGroup } from "@/libs/element/display/productGroup";


type Editor_ProductGroup_Props = {
    productGroups: AppDB_Types["productGroup"]["edit"][],
    onChangeData: (productGroups: AppDB_Types["productGroup"]["edit"][]) => void
} & EditorLayout_Props;

export function Editor_ProductGroup({ productGroups, onChangeData, ...props }: Editor_ProductGroup_Props) {
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
                    <div className="mx-auto flex w-full max-w-3xl flex-col gap-5 py-4">
                        <div className="flex items-center justify-between">
                            <Button
                                onClick={() => setTarget(null)}
                                className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-(--text-color-sub) transition-colors hover:bg-(--container-background-sub)/40"
                            >
                                <ArrowLeft size={18} />
                                商品グループ一覧に戻る
                            </Button>
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-(--primary)/10 px-3 py-1 text-xs font-semibold text-(--primary)">
                                <Pencil size={14} />
                                グループを編集
                            </span>
                        </div>
                        <div className="overflow-hidden rounded-2xl border border-(--container-background-sub) bg-(--container-background) shadow-lg">
                            <div className="border-b border-(--container-background-sub) bg-(--app-theme-sub) px-5 py-4 text-(--app-theme-text)">
                                <p className="text-xs font-semibold uppercase tracking-[0.18em] opacity-70">Group editor</p>
                                <h2 className="mt-1 text-xl font-bold">{target.name || "名前未設定のグループ"}</h2>
                            </div>
                            <div className="grid gap-6 p-5 md:grid-cols-[240px_1fr] md:p-7">
                                <div>
                                    <button
                                        type="button"
                                        onClick={() => setShowImagePicker(true)}
                                        className="group relative block w-full overflow-hidden rounded-xl border border-(--container-background-sub) bg-(--background) text-left shadow-sm"
                                        aria-label="商品グループ画像を変更"
                                    >
                                        <Image
                                            src={target.img?.url || "/picture.png"}
                                            alt=""
                                            width={300}
                                            height={300}
                                            className="aspect-square w-full object-cover transition-transform group-hover:scale-105"
                                        />
                                        <span className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-2 bg-(--app-theme-sub)/85 px-2 py-3 text-sm font-semibold text-(--app-theme-text) opacity-0 transition-opacity group-hover:opacity-100">
                                            <ImageIcon size={16} />
                                            画像を変更
                                        </span>
                                    </button>
                                    <p className="mt-2 text-center text-xs text-(--text-color-sub)">画像をクリックして変更</p>
                                </div>
                                <div className="flex flex-col gap-4">
                                    <Label className="gap-1">
                                        商品グループ名
                                        <Input
                                            className="text-base"
                                            value={target.name}
                                            onChange={(e) => setTarget({ ...target, name: e.target.value })}
                                        />
                                    </Label>
                                    <label className="flex cursor-pointer items-center justify-between rounded-lg border border-(--container-background-sub) bg-(--background) px-4 py-3 text-sm font-medium text-(--text-color)">
                                        <span>
                                            <span className="block font-semibold">トップに表示</span>
                                            <span className="mt-0.5 block text-xs font-normal text-(--text-color-sub)">ショップのトップ画面に表示します</span>
                                        </span>
                                        <input
                                            type="checkbox"
                                            checked={target.showTop}
                                            onChange={(e) => setTarget({ ...target, showTop: e.target.checked })}
                                            className="size-5 accent-(--primary)"
                                        />
                                    </label>
                                    <div className="mt-1 flex flex-col gap-2 border-t border-(--container-background-sub) pt-4 sm:flex-row">
                                        <Button
                                            onClick={() => save.request()}
                                            disabled={save.waiting}
                                            className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-(--primary) px-4 py-3 font-semibold text-(--app-theme-text) shadow-sm transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            <Save size={18} />
                                            {save.waiting ? "保存中..." : "変更を保存"}
                                        </Button>
                                        <Button
                                            onClick={() => remove.request(target.id)}
                                            disabled={remove.waiting}
                                            className="inline-flex items-center justify-center gap-2 rounded-lg border border-(--error)/30 px-4 py-3 font-semibold text-(--error) transition-colors hover:bg-(--error)/10 disabled:cursor-not-allowed disabled:opacity-50"
                                        >
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
                                <p className="text-xs font-semibold uppercase tracking-[0.18em] opacity-70">Group management</p>
                                <h2 className="mt-1 text-2xl font-bold">商品グループ管理</h2>
                                <p className="mt-1 text-sm opacity-80">商品を整理するグループを管理できます</p>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <PackagePlus size={20} />
                                <span>{productGroups.length} 件のグループ</span>
                            </div>
                        </div>
                        <div className="flex flex-col gap-3 rounded-xl border border-(--container-background-sub) bg-(--container-background) p-4 shadow-sm sm:flex-row sm:items-center">
                            <div className="flex-1">
                                <p className="text-sm font-bold text-(--text-color)">新しい商品グループを追加</p>
                                <p className="mt-0.5 text-xs text-(--text-color-sub)">商品を分類するグループを作成してください</p>
                            </div>
                            <Button onClick={() => add.request()} disabled={add.waiting} className="inline-flex items-center justify-center gap-2 rounded-lg bg-(--primary) px-4 py-2 font-semibold text-(--app-theme-text) transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50">
                                <PackagePlus size={18} />
                                {add.waiting ? "追加中..." : "グループを追加"}
                            </Button>
                        </div>
                        {productGroups.length > 0 ? (
                            <div className="grid gap-4 md:grid-cols-2">
                                {
                                    productGroups.map((pg) => (
                                        <Display_ProductGroup
                                            key={pg.id}
                                            imgSrc={pg.img?.url}
                                            name={pg.name}
                                            onClick={() => setTarget(pg)}
                                            className="w-full min-w-0 max-w-none cursor-pointer border-(--container-background-sub) p-3 shadow-md transition-all hover:-translate-y-0.5 hover:border-(--primary) hover:shadow-lg"
                                        />
                                    ))
                                }
                            </div>
                        ) : (
                            <div className="rounded-2xl border border-dashed border-(--container-background-sub) bg-(--container-background) px-6 py-12 text-center">
                                <PackagePlus className="mx-auto text-(--text-color-sub)" size={32} />
                                <p className="mt-3 font-semibold text-(--text-color)">商品グループがありません</p>
                                <p className="mt-1 text-sm text-(--text-color-sub)">上のフォームからグループを追加してください</p>
                            </div>
                        )}
                    </div>
                )
            }
        </EditorLayout>
    )
}
