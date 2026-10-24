import React from "react";

export function ContentWrapper({className, ...props}: React.JSX.IntrinsicElements["div"]) {
    return (
        <div
            className={
                [
                    "flex-1 flex flex-col overflow-hidden",
                    "sm:flex-col-reverse sm:overflow-hidden",
                    className ?? ""
                ].join(" ")
            }
            {...props}
        />
    )
}