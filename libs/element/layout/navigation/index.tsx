import React from "react";
import Link from "next/link";
import { ArrowUpRight, Home, Notebook, QrCode, ShoppingCart, User } from "lucide-react";

export function Navigation() {
    return (
        <nav className="bg-(--app-theme-background) px-3 pb-3 pt-2 sm:px-5 sm:py-2" aria-label="メインナビゲーション">
            <div
                className="relative mx-auto flex max-w-3xl items-end justify-between gap-1 rounded-[1.75rem] border border-(--app-theme-text)/10 bg-(--app-theme-background-sub)/80 p-2 shadow-[0_12px_30px_rgba(0,0,0,0.18)] backdrop-blur-md sm:h-14 sm:items-center sm:gap-2 sm:rounded-2xl sm:p-1.5"
            >
                <NavigationLink href="/" label="HOME">
                    <Home />
                </NavigationLink>
                <NavigationLink href="/cart" label="CART">
                    <ShoppingCart />
                </NavigationLink>
                <NavigationLink href="/verify"
                    label="VERIFY"
                    featured
                >
                    <QrCode />
                </NavigationLink>
                <NavigationLink href="/order" label="ORDER">
                    <Notebook />
                </NavigationLink>
                <NavigationLink href="/user" label="USER">
                    <User />
                </NavigationLink>
            </div>
        </nav>
    )
}


function NavigationLink({
    children,
    label,
    featured = false,
    ...props
}: {
    href: string;
    label: string;
    featured?: boolean;
    children: React.ReactElement<{ size?: number; strokeWidth?: number }>;
}) {
    return (
        <Link
            {...props}
            className={[
                "group relative flex h-14 min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-2xl text-[10px] font-bold tracking-[0.12em] text-(--app-theme-text)/70 transition-all duration-200",
                featured
                    ? "text-(--app-theme-text) active:bg-(--app-theme) focus-visible:bg-(--app-theme)"
                    : "hover:bg-(--app-theme-text)/10 hover:text-(--app-theme-text)",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--app-theme)",
                "sm:h-full sm:flex-row sm:gap-2 sm:text-xs",
                featured
                    ? "z-10 -mt-7 h-[4.5rem] max-w-20 rounded-[1.5rem] bg-(--app-theme) px-3 shadow-[0_8px_20px_rgba(219,89,33,0.38)] hover:-translate-y-1 hover:bg-(--app-theme)"
                    : "",
            ].join(" ")}
        >
            <span className={[
                "transition-transform duration-200 group-hover:-translate-y-0.5",
                featured ? "scale-110" : "",
            ].join(" ")}>
                {React.cloneElement(children, {
                    size: featured ? 24 : 20,
                    strokeWidth: featured ? 2.5 : 2,
                })}
            </span>
            <span>{label}</span>
            {featured && <ArrowUpRight size={12} className="absolute right-2 top-2 opacity-70" aria-hidden="true" />}
        </Link>
    )
}
