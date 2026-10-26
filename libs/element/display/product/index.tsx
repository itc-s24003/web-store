import Image from "next/image";
import React from "react";

type Display_Product_Props = {
    imgSrc?: string,
    name: string,
    price?: number,
    description?: string
} & React.JSX.IntrinsicElements["div"]

export function Display_Product({ imgSrc, name, price, description, children, ...props }: Display_Product_Props) {
    return (
        <div {...props} className={["flex gap-2 p-2 border rounded-md cursor-pointer", props.className].join(" ")}>
            <Image src={imgSrc || "/picture.png"} alt={name} width={100} height={100} className="aspect-square h-full w-auto object-cover" />
            <div className="flex flex-col gap-1">
                <h3 className="text-lg font-semibold">{name}</h3>
                <p hidden={description===undefined} className="text-gray-500">{description}</p>
                <p hidden={price===undefined} className="text-gray-700 font-bold">¥{price}</p>
                {children}
            </div>
        </div>
    )
}