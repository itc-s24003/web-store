"use client";

import { Bell } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type Header_Props = {
    title: string,
    toast?: number
}

export function Header({ title, toast }: Header_Props) {
    return (
        <div
            className="relative flex w-full items-center justify-between bg-(--app-theme-sub) px-4 py-3 transition-colors duration-200"
        >
            <div className="inline-flex items-center gap-2.5 relative flex-[0_0_auto]">
                <Image src={"/logo.png"} alt={""} width={35} height={35} className="rounded-sm"/>
                <div className="relative w-fit whitespace-nowrap text-xl font-semibold leading-normal tracking-tight text-(--app-theme-text)">
                    {title}
                </div>
            </div>
            <Link href={"/message"} className="relative flex h-9 w-9 items-center justify-center rounded-full bg-(--primary) px-1 text-xs font-medium text-(--background) shadow-sm">
                <Bell />
                <span hidden={!toast || toast < 1} className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-(--secondary) text-[10px] font-bold text-(--background)">
                    {toast}
                </span>
            </Link>
        </div>
    );
};