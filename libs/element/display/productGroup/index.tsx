"use client"


import Image from "next/image";
import React from "react";

type Display_ProductGroup_Props = {
    imgSrc?: string,
    name: string
} & React.JSX.IntrinsicElements["div"]

export function Display_ProductGroup({ imgSrc, name, children, ...props }: Display_ProductGroup_Props) {
    return (
        <div {...props} className={
            [
                "overflow-hidden rounded-2xl border border-(--container-background-sub)/70 bg-(--container-background) shadow-sm cursor-pointer max-w-md min-w-xs",
                "sm:min-w-md",
                props.className
            ].join(" ")
        }>
            <div className="flex gap-3 px-3 py-4 sm:px-4 sm:py-5">
                <div className="relative shrink-0 overflow-hidden">
                    <Image src={imgSrc ?? "/picture.png"} alt={name} width={200} height={200} className="aspect-square h-full w-auto max-h-40 object-cover rounded-lg" />
                </div>
                <div className="flex min-w-0 flex-1 flex-col gap-2">
                    <h3 className="text-clip text-xl font-bold text-(--text-color)">{name}</h3>
                    {children}
                </div>
            </div>
        </div>
    )
}