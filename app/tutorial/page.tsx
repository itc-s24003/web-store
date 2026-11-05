import { AppDB } from "@/libs/db";
import { PageView } from "./view";
import { connection } from "next/server";


export const instant = false;

export default async function Page() {
    await connection();
    const base = await AppDB._custom.base.getCache();

    return <PageView {...base} />;
}