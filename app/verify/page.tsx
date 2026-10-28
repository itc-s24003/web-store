import { AppAPI } from "@/libs/api";
import { PageView } from "./view";
import { forbidden, unauthorized } from "next/navigation";
import { AppDB } from "@/libs/db";


export const instant = false;



export default async function Page() {
    const email = await AppAPI.session.getEmail();
    if (!email) unauthorized();

    const permission = await AppAPI.permission.get(email);
    if (!permission) unauthorized();
    if (permission.isLock) forbidden();

    const base = await AppDB._custom.base.get();

    return <PageView store={base.store} languages={base.languages} />;
}