"use cache"


import { AppDB } from "@/libs/db";
import { PageView } from "./view";

export default async function Page() {
    const base = await AppDB._custom.base.get();

    return <PageView store={base.store} languages={base.languages} />
}