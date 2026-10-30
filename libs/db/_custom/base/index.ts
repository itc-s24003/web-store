"use cache"


import { cacheLife } from "next/cache";
import { AppDB } from "../..";
import { APP_ENV } from "@/app/env";

export async function get() {
    const store = await AppDB.store.get();
    const languages = await AppDB.language.getAll();

    return {
        store,
        languages
    }
}


export async function getCache() {
    cacheLife({
        revalidate: 1000 * APP_ENV.SERVER_CACHE * 3
    })

    const store = await AppDB.store.get();
    const languages = await AppDB.language.getAll();

    return {
        store,
        languages
    }
}