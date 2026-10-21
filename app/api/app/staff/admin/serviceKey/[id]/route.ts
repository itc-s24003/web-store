import { app_api_map_gen, app_api_response } from "@/app/api/app/api";
import { AppAPI } from "@/libs/api";
import { AppDB } from "@/libs/db";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

type ApiURLParamId = {
    params: Promise<{ id: string }>
};

export type AppAPI_staff_admin_ServiceKey__id__Map = app_api_map_gen<{
    DELETE: {
        req: {
            params: undefined,
            body: undefined
        },
        res: app_api_response<undefined>
    }
}>;

export async function DELETE(_req: NextRequest, p: ApiURLParamId) {
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
        await AppDB.serviceKey.remove(parsed.data);
    } catch {
        return AppAPI.response.errorResponse.ServerError;
    }

    return NextResponse.json<
        AppAPI_staff_admin_ServiceKey__id__Map["DELETE"]["res"]
    >({ success: true, data: undefined });
}



