import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { AppAPI } from "@/libs/api";
import {
    api_url_param_id,
    app_api_map_gen,
    app_api_response
} from "../../../api";
import { AppDB, AppDB_Types } from "@/libs/db";

export type AppAPI_staff_order__id__Map = app_api_map_gen<{
    PATCH: {
        req: {
            params: undefined,
            body: AppDB_Types["order"]["update"]
        },
        res: app_api_response<undefined>
    }
}>;






const PATCH_BODY = z.object({
    isCanceled: z.boolean({message: "isCanceled は 真偽値 で指定する必要があります"}).optional(),
    isReceived: z.boolean({message: "isReceived は 真偽値 で指定する必要があります"}).optional(),
    isReady: z.boolean({message: "isReady は 真偽値 で指定する必要があります"}).optional()

}, {message: "オブジェクト で指定する必要があります"}) satisfies z.ZodType<
    AppAPI_staff_order__id__Map["PATCH"]["req"]["body"]
>


export async function PATCH(_req: NextRequest, p: api_url_param_id) {
    const email = await AppAPI.session.getEmail();
    if (!email) return AppAPI.response.errorResponse.Unauthorized;

    const permission = await AppAPI.permission.get(email);
    if (!permission) return AppAPI.response.errorResponse.Unauthorized;
    if (permission.isLock || !permission.isStaff) {
        return AppAPI.response.errorResponse.Forbidden;
    }

    const { id } = await p.params;
    const parsed = z.string().min(1).safeParse(id);
    if (!parsed.success) return AppAPI.response.errorResponse.BadRequest;

    const body = await _req.json().catch(() => undefined);
    const parsedBody = PATCH_BODY.safeParse(body);
    if (!parsedBody.success) return AppAPI.response.errorResponse.BadRequest;

    try {
        await AppDB.order.update(parsed.data, parsedBody.data);
    } catch {
        return AppAPI.response.errorResponse.ServerError;
    }

    return NextResponse.json<
        AppAPI_staff_order__id__Map["PATCH"]["res"]
    >({ success: true, data: undefined });
}




