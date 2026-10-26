import { AppDB_Types } from "@/libs/db";
import { Button } from "@/libs/element/button";
import { Picker_Image } from "@/libs/element/form/picker/image";
import { Popup } from "@/libs/element/popup";
import React from "react";

export type EditorLayout_Props = {
    images: AppDB_Types["image"]["model"][],
    onUploadImage?: (file: File) => void,
    onSelectImage?: (image: AppDB_Types["image"]["model"]) => void,
    showImagePicker?: boolean,
    onCancel?: () => void
} & React.JSX.IntrinsicElements["div"]

export function EditorLayout({
    className, children,
    images, onUploadImage, onSelectImage, showImagePicker, onCancel,
    ...props
}: EditorLayout_Props) {
    return (
        <div
            className={
                [
                    "flex flex-col",
                    className
                ].join(" ")
            }
            {...props}
        >
            {children}
            <Popup hidden={!showImagePicker}>
                <Picker_Image images={images} onUpload={onUploadImage} onSelected={onSelectImage} onCancel={onCancel}
                    className="w-full h-full bg-black/50" 
                />
            </Popup>
        </div>
    )
}



type EditorContentWrapper_Props = {
    waiting?: boolean,
    
    canSave?: boolean,
    onSave?: () => void,

    canRemove?: boolean,
    onRemove?: () => void
} & React.JSX.IntrinsicElements["div"];

export function EditorContentWrapper({
    className, waiting, canSave, onSave, canRemove, onRemove,
    children, ...props
}: EditorContentWrapper_Props) {
    return (
        <div
            className={
                [
                    "p-4",
                    className
                ].join(" ")
            }
            {...props}
        >
            {children}
            <div>
                <Button>
                    保存
                </Button>
                <Button>
                    削除
                </Button>
            </div>
        </div>
    )
}