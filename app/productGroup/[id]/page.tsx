"use cache"


import { PageView } from "./view";
import { cacheLife } from "next/cache";
import { APP_ENV } from "@/app/env";
import { AppDB } from "@/libs/db";
import { NextRequest } from "next/server";
import { api_url_param_id } from "@/app/api/app/api";

export const instant = false

export default async function Page(req: api_url_param_id) {


    const id = (await req.params).id;

    return View(id);
}


async function View(id: string) {
    cacheLife({
      stale: 1000 * APP_ENV.CLIENT_CACHE,
    })


    const languages = await AppDB.language.getAll();
    const detail = await AppDB.productGroup.getDetail(id);
    if (!detail) throw new Error("Product group not found");

    return <PageView languages={languages} productGroup={detail} />;
}