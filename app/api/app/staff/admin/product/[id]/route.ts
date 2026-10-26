import { api_url_param_id, app_api_map_gen, app_api_response } from "@/app/api/app/api";
import { AppAPI } from "@/libs/api";
import { AppDB, AppDB_Types } from "@/libs/db";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

export type AppAPI_staff_admin_Product__id__Map = app_api_map_gen<{
    PATCH: {
        req: {
            params: undefined,
            body: AppDB_Types["product"]["update"]
        },
        res: app_api_response<undefined>
    },
    DELETE: {
        req: {
            params: undefined,
            body: undefined
        },
        res: app_api_response<undefined>
    }
}>



const PATCH_BODY = z.object({
    name: z.string({message: "name は 文字列 で指定する必要があります"}).max(16, {message: "name は 16文字以内 で指定する必要があります"}).optional(),
    description: z.string({message: "description は 文字列 で指定する必要があります"}).max(128, {message: "description は 128文字以内 で指定する必要があります"}).optional(),
    price: z.int({message: "price は 整数で指定する必要があります"}).min(0, {message: "price は 0以上 で指定する必要があります"}).optional(),
    showStockDetail: z.boolean({message: "showStockDetail は 真偽値 で指定する必要があります"}).optional(),
    stock: z.int({message: "stock は 整数 で指定する必要があります"}).min(0, {message: "stock は 0以上 で指定する必要があります"}).optional(),
    imgId: z.string({message: "imgId は 文字列 で指定する必要があります"}).nullable().optional(),
    labelId: z.string({message: "labelId は 文字列 で指定する必要があります"}).max(16, {message: "labelId は 16文字以内で指定する必要があります"}).nullable().optional()

}) satisfies z.ZodType<
    AppAPI_staff_admin_Product__id__Map["PATCH"]["req"]["body"]
>



export async function PATCH(req: NextRequest, p: api_url_param_id) {
    const email = await AppAPI.session.getEmail();
    if (!email) return AppAPI.response.errorResponse.Unauthorized;

    const permission = await AppAPI.permission.get(email);
    if (!permission) return AppAPI.response.errorResponse.Unauthorized;
    if (permission.isLock || !permission.isAdmin) {
        return AppAPI.response.errorResponse.Forbidden;
    }

    const { id } = await p.params;

    let body: unknown;
    try {
        body = await req.json();
    } catch {
        return AppAPI.response.errorResponse.BadRequest;
    }

    const parsedBody = PATCH_BODY.safeParse(body);
    if (!parsedBody.success) return AppAPI.response.errorResponse.BadRequest;

    try {
        await AppDB.product.update(id, parsedBody.data);
    } catch (e) {
        console.error(e);
        return AppAPI.response.errorResponse.ServerError;
    }

    return NextResponse.json<AppAPI_staff_admin_Product__id__Map["PATCH"]["res"]>({
        success: true,
        data: undefined
    });
}


export async function DELETE(_req: NextRequest, p: api_url_param_id) {
    const email = await AppAPI.session.getEmail();
    if (!email) return AppAPI.response.errorResponse.Unauthorized;

    const permission = await AppAPI.permission.get(email);
    if (!permission) return AppAPI.response.errorResponse.Unauthorized;
    if (permission.isLock || !permission.isAdmin) {
        return AppAPI.response.errorResponse.Forbidden;
    }

    const { id } = await p.params;
    const parsedId = z.string().min(1).safeParse(id);
    if (!parsedId.success) return AppAPI.response.errorResponse.BadRequest;

    try {
        await AppDB.product.remove(parsedId.data);
    } catch {
        return AppAPI.response.errorResponse.ServerError;
    }

    return NextResponse.json<AppAPI_staff_admin_Product__id__Map["DELETE"]["res"]>({
        success: true,
        data: undefined
    });
}

