"use cache";


import { PageView } from "./view";
import { cacheLife } from "next/cache";

export default async function Page() {
    cacheLife({
        stale: 1000 * 60 * 60 * 24,
    })


    return <PageView />;
}