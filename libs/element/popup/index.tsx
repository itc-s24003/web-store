import React from "react"


export function Popup({ className, ...props }: React.JSX.IntrinsicElements["div"]) {
    return (
        <div
            className={
                [
                    "fixed top-0 left-0 w-full h-full flex items-center justify-center",
                    className
                ].join(" ")
            }
            {...props}
        />
    )
}