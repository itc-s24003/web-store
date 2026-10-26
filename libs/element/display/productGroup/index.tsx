import Image from "next/image";
import React from "react";

type Display_ProductGroup_Props = {
    imgSrc?: string,
    name: string
} & React.JSX.IntrinsicElements["div"]

export function Display_ProductGroup({ imgSrc, name, children, ...props }: Display_ProductGroup_Props) {
    return (
        <div {...props} className={["flex gap-2 p-2 border rounded-md cursor-pointer", props.className].join(" ")}>
            <Image src={imgSrc || "/picture.png"} alt={name} width={100} height={100} className="aspect-square object-cover" />
            <div className="flex flex-col gap-1 flex-1">
                <h3 className="text-lg font-semibold">{name}</h3>
                {children}
            </div>
        </div>
    )
}