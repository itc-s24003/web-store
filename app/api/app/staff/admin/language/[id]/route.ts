import { api_url_param_id, app_api_map_gen, app_api_response } from "@/app/api/app/api";
import { AppAPI } from "@/libs/api";
import { AppDB } from "@/libs/db";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

export type AppAPI_staff_admin_Language__id__Map = app_api_map_gen<{
    DELETE: {
        req: {
            params: undefined,
            body: undefined
        },
        res: app_api_response<undefined>
    },
    PATCH: {
        req: {
            params: undefined,
            body: {
                name: string
            }
        },
        res: app_api_response<undefined>
    }
}>

const PATCH_BODY = z.object({
    name: z.string().min(1).max(16)
}) satisfies z.ZodType<
    AppAPI_staff_admin_Language__id__Map["PATCH"]["req"]["body"]
>;

export async function DELETE(_req: NextRequest, p: api_url_param_id) {
    const email = await AppAPI.session.getEmail();
    if (!email) return AppAPI.response.errorResponse.Unauthorized;

    const permission = await AppAPI.permission.get(email);
    if (!permission) return AppAPI.response.errorResponse.Unauthorized;
    if (!permission.isAdmin || permission.isLock) {
        return AppAPI.response.errorResponse.Forbidden;
    }

    const { id } = await p.params;

    try {
        await AppDB.language.remove(id);
    } catch {
        return AppAPI.response.errorResponse.ServerError;
    }

    return NextResponse.json<AppAPI_staff_admin_Language__id__Map["DELETE"]["res"]>({
        success: true,
        data: undefined
    });
}




export async function PATCH(req: NextRequest, p: api_url_param_id) {
    const email = await AppAPI.session.getEmail();
    if (!email) return AppAPI.response.errorResponse.Unauthorized;

    const permission = await AppAPI.permission.get(email);
    if (!permission) return AppAPI.response.errorResponse.Unauthorized;
    if (!permission.isAdmin || permission.isLock) {
        return AppAPI.response.errorResponse.Forbidden;
    }

    const { id } = await p.params;

    const body = PATCH_BODY.safeParse(await req.json().catch(() => null));
    if (!body.success) return AppAPI.response.errorResponse.BadRequest;

    try {
        await AppDB.language.update(id, body.data);
    } catch {
        return AppAPI.response.errorResponse.ServerError;
    }

    return NextResponse.json<AppAPI_staff_admin_Language__id__Map["PATCH"]["res"]>({
        success: true,
        data: undefined
    });
}



