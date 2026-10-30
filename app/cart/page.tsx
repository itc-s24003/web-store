


import { AppAPI } from "@/libs/api";
import { PageView } from "./view";
import { forbidden, redirect, unauthorized } from "next/navigation";
import { AppDB } from "@/libs/db";
import { connection } from "next/server";
import { cacheLife } from "next/cache";
import { APP_ENV } from "../env";



export const instant = false


export default async function Page() {
    await connection()

    const email = await AppAPI.session.getEmail();
    if (!email) redirect("/login");

    const permission = await AppAPI.permission.get(email);
    if (!permission) redirect("/login");
    if (permission.isLock) forbidden();

    const base = await AppDB._custom.base.getCache();

    return <PageView {...base} />
}