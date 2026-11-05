"use cache"


import { AppDB } from "@/libs/db";
import { PageView } from "./view";

export default async function Page() {
    const base = await AppDB._custom.base.getCache();

    return <PageView {...base} />
}