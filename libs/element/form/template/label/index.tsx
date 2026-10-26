import React from "react";

export function Label({ className, ...props }: React.JSX.IntrinsicElements["label"]) {
    return (
        <label
            {...props}
            className={
                [
                    "flex flex-col items-start mb-2 text-sm font-medium text-gray-700",
                    className
                ].join(" ")
            }
        />
    )
}