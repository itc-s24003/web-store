import { NextRequest, NextResponse } from "next/server";
import { api_url_param_id, app_api_map_gen, app_api_response, app_api_response_error } from "../../../api";
import { AppAPI } from "@/libs/api";
import { AppDB, AppDB_Types } from "@/libs/db";
import z from "zod";


export type AppAPI_user_CartItem__id__Map = app_api_map_gen<{
    PATCH: {
        req: {
            params: undefined,
            body: AppDB_Types["cartItem"]["update"]
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
    count: z.int({message: "count は 整数 で指定する必要があります"}).min(1, {message: "count は 1以上で指定する必要があります"}).optional()
}) satisfies z.ZodType<
    AppAPI_user_CartItem__id__Map["PATCH"]["req"]["body"]
>

export async function PATCH(req: NextRequest, p: api_url_param_id) {
    const email = await AppAPI.session.getEmail();
    if (!email) return AppAPI.response.errorResponse.Unauthorized;

    const id = (await p.params).id;

    const body = PATCH_BODY.safeParse(await req.json());
    if (!body.success) return NextResponse.json<app_api_response_error>({
        success: false,
        error: body.error.message
    });
    
    const permission = await AppAPI.permission.get(email);
    if (!permission) return AppAPI.response.errorResponse.Unauthorized;
    if (permission.isLock) return AppAPI.response.errorResponse.Forbidden;

    const res = await AppDB.cartItem.email.update(email, id, body.data).catch(() => null);
    if (res === null) return AppAPI.response.errorResponse.ServerError;

    
    return NextResponse.json<AppAPI_user_CartItem__id__Map["PATCH"]["res"]>({
        success: true,
        data: undefined
    })
}



export async function DELETE(req: NextRequest, p: api_url_param_id) {
    const email = await AppAPI.session.getEmail();
    if (!email) return AppAPI.response.errorResponse.Unauthorized;

    const id = (await p.params).id;

    const body = PATCH_BODY.safeParse(await req.json());
    if (!body.success) return NextResponse.json<app_api_response_error>({
        success: false,
        error: body.error.message
    });
    
    const permission = await AppAPI.permission.get(email);
    if (!permission) return AppAPI.response.errorResponse.Unauthorized;
    if (permission.isLock) return AppAPI.response.errorResponse.Forbidden;
    
    

    const res = await AppDB.cartItem.email.remove(email, id).catch(() => null);
    if (res === null) return AppAPI.response.errorResponse.ServerError;

    return NextResponse.json<AppAPI_user_CartItem__id__Map["DELETE"]["res"]>({
        success: true,
        data: undefined
    })
}