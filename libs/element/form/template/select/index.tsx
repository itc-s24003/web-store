import React from "react";

export function Select({ className, ...porps }: React.JSX.IntrinsicElements["select"]) {
    return (
        <select className={`p-2 border outline-none ${className}`} {...porps} />
    )
}