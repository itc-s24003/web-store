import React from "react";
import Link from "next/link";
import { Home, Notebook, QrCode, ShoppingCart, User } from "lucide-react";

export function Navigation() {
    
    return (
        <div className="bg-(--app-theme-sub)">
            <div
                className={
                    [
                        "relative flex h-16 items-end justify-between gap-2 px-4 pb-3",
                        "sm:h-8 sm:items-center sm:justify-start sm:gap-0 sm:py-0 sm:bg-white/10",
                    ].join(" ")
                }
            >
                <NavigationLink href="/" className="bg-(--container-background-sub) text-(--text-color-sub) hover:bg-(--background-sub)">
                    <Home className="sm:hidden"/>
                    <span>HOME</span>
                </NavigationLink>
                <NavigationLink href="/cart" className="bg-(--container-background-sub) text-(--text-color-sub) hover:bg-(--background-sub)">
                    <ShoppingCart className="sm:hidden"/>
                    <span>CART</span>
                </NavigationLink>
                <NavigationLink href="/verify"
                    className={
                        [
                            "-mt-8 h-20 w-20 bg-(--app-theme) font-bold text-(--background) hover:bg-(--secondary)",
                            "sm:-mt-0 sm:rounded-none sm:bg-(--container-background-sub) sm:text-(--text-color-sub) sm:hover:bg-(--secondary)",
                        ].join(" ")
                    }
                >
                    <QrCode size={32} className="sm:hidden"/>
                    <span>VERIFY</span>
                </NavigationLink>
                <NavigationLink href="/order" className="bg-(--container-background-sub) text-(--text-color-sub) hover:bg-(--background-sub)">
                    <Notebook className="sm:hidden"/>
                    <span>ORDER</span>
                </NavigationLink>
                <NavigationLink href="/user" className="bg-(--container-background-sub) text-(--text-color-sub) hover:bg-(--background-sub)">
                    <User className="sm:hidden"/>
                    <span>USER</span>
                </NavigationLink>
            </div>
        </div>
    )
}




function NavigationLink({ className, ...props }: { href: string } & React.JSX.IntrinsicElements["a"]) {
    return (
        <Link
            {...props}
            className={
                [
                    className ?? "",
                    "w-16 h-16 shrink-0 rounded-full transition-colors duration-200 flex flex-col items-center gap-1 justify-center text-xs font-semibold",
                    "sm:w-full sm:h-full sm:shrink-1 sm:rounded-none"
                ].join(" ")
            }
        />
    )
}
