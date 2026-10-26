import { AppDB_Types } from "@/libs/db";
import { Button } from "@/libs/element/button";
import { X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

type Picker_Image_Props = {
    images: AppDB_Types["image"]["model"][],
    multiple?: boolean,

    onSelected?: (image: AppDB_Types["image"]["model"]) => void,
    onUpload?: (file: File) => void,

    onCancel?: () => void,
} & React.JSX.IntrinsicElements["div"];

export function Picker_Image({ images, onSelected, onUpload, onCancel, children, ...props }: Picker_Image_Props) {
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    
    return (
        <div {...props}>
            <div className="w-full flex justify-between lg:justify-start p-2 border-b">
                <Button
                    className="rounded-sm border p-1 px-3  bg-gray-200"
                    onClick={() => {
                        setSelectedIndex(null);
                        onCancel?.();
                    }}
                >
                    <X />
                </Button>
                <label
                    hidden={!onUpload || selectedIndex !== null}
                    className="text-center rounded-sm border p-1 px-3 cursor-pointer bg-gray-200"
                >
                    アップロード
                    <input
                        hidden
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                            if (e.target.files && e.target.files.length > 0) {
                                onUpload?.(e.target.files[0]);
                            }
                        }}
                    />
                </label>
                <Button
                    hidden={selectedIndex === null}
                    className="rounded-sm border p-1 px-3  bg-gray-200"
                    onClick={() => {
                        setSelectedIndex(null);
                        onSelected?.(images[selectedIndex!]);
                    }}
                >
                    選択
                </Button>
            </div>
            <div className="flex flex-wrap items-center justify-center">
                {
                    images.map((image, index) => (
                        <ImageItem
                            key={index}
                            image={image}
                            selected={selectedIndex === index}
                            onClick={() => {
                                if (selectedIndex === index) {
                                    setSelectedIndex(null);
                                } else {
                                    setSelectedIndex(index);
                                }
                            }}
                        />
                    ))
                }
            </div>
            {children}
        </div>
    )
}


type ImageItem_Props = {
    image: AppDB_Types["image"]["model"],
    selected?: boolean,
    onClick?: () => void
} & React.JSX.IntrinsicElements["label"];

function ImageItem({ image, selected, onClick, className, children, ...props }: ImageItem_Props) {
    return (
        <label
            className={
                [
                    "relative border aspect-square w-50 cursor-pointer p-1",
                    selected ? "bg-blue-500" : "bg-gray-700",
                    className
                ].join(" ")
            }
            onClick={onClick}
            {...props}
        >
            <Image src={image.url} alt={""} width={200} height={200} loading="lazy" className="aspect-square w-full h-full object-cover"/>
            {children}
        </label>
    )
}