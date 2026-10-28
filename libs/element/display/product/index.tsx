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
                "overflow-hidden rounded-2xl border border-(--container-background-sub)/70 bg-(--container-background) shadow-sm max-w-md min-w-xs",
                "sm:min-w-md",
                className
            ].join(" ")
        }>
            <div className="flex gap-3 p-3 sm:p-4">
                <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-(--container-background-sub) sm:h-28 sm:w-28">
                    <Image src={imgSrc ?? "/picture.png"} alt={name} fill sizes="112px" className="object-cover" />
                </div>
                <div className="flex min-w-0 flex-1 flex-col gap-2">
                    {
                        href ? (
                            <Link href={href} className="min-w-0 text-(--text-color) hover:underline">
                                <h3 className="truncate text-lg font-bold">{name}</h3>
                            </Link>
                        ) : (
                            <h3 className="truncate text-lg font-bold text-(--text-color)">{name}</h3>
                        )
                    }
                    <p hidden={description === undefined} className="text-sm text-(--text-color-sub)">{description}</p>
                    <p hidden={price === undefined} className="font-bold text-(--app-theme)">¥{price?.toLocaleString()}</p>
                    {children}
                </div>
            </div>
        </div>
    )
}