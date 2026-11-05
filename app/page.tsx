"use cache"


import { AppDB } from "@/libs/db";
import { PageView } from "./view";
import { cacheLife } from "next/cache";
import { APP_ENV } from "./env";

export default async function Page() {
    cacheLife({
        stale: 1000 * APP_ENV.CLIENT_CACHE,
        revalidate: 1000 * APP_ENV.SERVER_CACHE
    })
  
  
    const base = await AppDB._custom.base.getCache();
    const productGroups = await AppDB.productGroup.getDisplay();
    
    return (
        <PageView {...base} productGroups={productGroups}/>
    );
}
