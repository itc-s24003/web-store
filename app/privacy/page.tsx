"use cache"

import { cacheLife } from "next/cache";
import { PageView } from "./view";


export default async function Page() {
    cacheLife({
        stale: 1000 * 60 * 60 * 24,
    })

    return <PageView />;
}