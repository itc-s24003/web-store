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
                <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-(--container-background-sub) sm:h-28 sm:w-28">
                    <Image src={imgSrc ?? "/picture.png"} alt={name} fill sizes="112px" className="object-cover" />
                </div>
                <div className="flex min-w-0 flex-1 flex-col gap-2">
                    <h3 className="truncate text-lg font-bold text-(--text-color)">{name}</h3>
                    {children}
                </div>
            </div>
        </div>
    )
}