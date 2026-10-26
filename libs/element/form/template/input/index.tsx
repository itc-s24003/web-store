import React from "react";

export function Input({ className, ...props }: React.JSX.IntrinsicElements["input"]) {
    return (
        <input
            {...props}
            className={
                [
                    "block w-full rounded-md border-0 p-1 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset",
                    className
                ].join(" ")
            }
        />
    )
}