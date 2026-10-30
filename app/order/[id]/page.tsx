import { AppAPI } from "@/libs/api";
import { PageView } from "./view";
import { forbidden, unauthorized } from "next/navigation";
import { connection } from "next/server";
import { AppDB } from "@/libs/db";
import { api_url_param_id } from "@/app/api/app/api";

export const instant = false;

export default async function Page(req: api_url_param_id) {
    await connection();
    
    const email = await AppAPI.session.getEmail();
    if (!email) unauthorized();

    const permission = await AppAPI.permission.get(email);
    if (!permission) unauthorized();

    const id = (await req.params).id;
    
    const base = await AppDB._custom.base.getCache();
    const order = await AppDB.order.email.get(email, id);
    if (!order) forbidden();

    return <PageView {...base} order={order} />;
}