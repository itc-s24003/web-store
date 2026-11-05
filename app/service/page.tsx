import { AppAPI } from "@/libs/api";
import { forbidden, unauthorized } from "next/navigation";
import { connection } from "next/server";
import { PageView } from "./view";
import { AppDB } from "@/libs/db";



export const instant = false;

export default async function Page() {
    await connection();
    const email = await AppAPI.session.getEmail();
    if (!email) unauthorized();


    const permission = await AppAPI.permission.get(email);
    if (!permission) unauthorized();
    if (permission.isLock) forbidden();

    const base = await AppDB._custom.base.getCache();


    return <PageView {...base} />
}