import Image from "next/image";
import Link from "next/link";
import React from "react";

type Display_Product_Props = {
    href?: string,
    imgSrc?: string,
    name: string,
    price?: number,
    description?: string
} & React.JSX.IntrinsicElements["div"]

export function Display_Product({ href, imgSrc, name, price, description, className, children, ...props }: Display_Product_Props) {
    return (
        <div {...props} className={
            [
                "flex gap-2 p-3 border border-(--text-color-sub)/60 rounded-md bg-(--container-background) shadow-md max-w-md min-w-xs",
                "sm:min-w-md",
                className
            ].join(" ")
        }>
            <Image src={imgSrc ?? "/picture.png"} alt={name} width={100} height={100} className="w-3/7 aspect-square object-cover" />
            <div className="flex flex-col gap-1 flex-1">
                {
                    href ? (
                        <Link href={href} className="text-2xl font-semibold text-(--primary) hover:underline">
                            <h3 className="text-2xl font-semibold">{name}</h3>
                        </Link>
                    ) : (
                        <h3 className="text-2xl font-semibold">{name}</h3>
                    )
                }
                <p hidden={description===undefined} className="text-gray-500">{description}</p>
                <p hidden={price===undefined} className="text-lg text-gray-700 font-bold">¥{price}</p>
                {children}
            </div>
        </div>
    )
}