import { api_url_param_id, app_api_map_gen, app_api_response } from "@/app/api/app/api";
import { AppAPI } from "@/libs/api";
import { AppDB, AppDB_Types } from "@/libs/db";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export type AppAPI_staff_admin_User__id__Map = app_api_map_gen<{
    GET: {
        req: {
            params: undefined,
            body: undefined
        },
        res: app_api_response<AppDB_Types["user"]["detailFull"]>
    },
    PATCH: {
        req: {
            params: undefined,
            body: AppDB_Types["user"]["update"]
        },
        res: app_api_response<undefined>
    }
}>


export async function GET(req: NextRequest, p: api_url_param_id) {
    const email = await AppAPI.session.getEmail();
    if (!email) return AppAPI.response.errorResponse.Unauthorized;

    const permission = await AppAPI.permission.get(email);
    if (!permission) return AppAPI.response.errorResponse.Unauthorized;
    if (permission.isLock || !permission.isAdmin) {
        return AppAPI.response.errorResponse.Forbidden;
    }

    const { id } = await p.params;
    const parsed = z.string().min(1).safeParse(id);
    if (!parsed.success) return AppAPI.response.errorResponse.BadRequest;

    try {
        const user = await AppDB.user.getDetailFull(parsed.data);
        if (!user) return AppAPI.response.errorResponse.NotFound;

        return NextResponse.json<
            AppAPI_staff_admin_User__id__Map["GET"]["res"]
        >({ success: true, data: user });
    } catch {
        return AppAPI.response.errorResponse.ServerError;
    }
}




const PATCH_BODY = z.object({
    isAdmin: z.boolean({message: "isAdmin は 真偽値 で指定する必要があります"}).optional(),
    isStaff: z.boolean({message: "isStaff は 真偽値 で指定する必要があります"}).optional(),
    lockTime: z.date({message: "lockTime は 日付 で指定する必要があります"}).optional()
}) satisfies z.ZodType<
    AppAPI_staff_admin_User__id__Map["PATCH"]["req"]["body"]
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
    const parsedId = z.string().min(1).safeParse(id);
    if (!parsedId.success) return AppAPI.response.errorResponse.BadRequest;


    const parsedBody = PATCH_BODY.safeParse(await req.json().catch(() => null));
    if (!parsedBody.success) return AppAPI.response.errorResponse.BadRequest;

    try {
        await AppDB.user.update(parsedId.data, parsedBody.data);
    } catch {
        return AppAPI.response.errorResponse.ServerError;
    }

    return NextResponse.json<AppAPI_staff_admin_User__id__Map["PATCH"]["res"]>({
        success: true,
        data: undefined
    });
}