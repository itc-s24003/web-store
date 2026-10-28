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
  
  
    const languages = await AppDB.language.getAll();
    const productGroups = await AppDB.productGroup.getAll();
    
    return (
      <PageView languages={languages} productGroups={productGroups}/>
    );
}
