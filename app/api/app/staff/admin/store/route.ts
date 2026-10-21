import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { AppAPI } from "@/libs/api";
import { AppDB, AppDB_Types } from "@/libs/db";
import { app_api_map_gen, app_api_response } from "../../../api";

export type AppAPI_staff_admin_Store_Map = app_api_map_gen<{
    PATCH: {
        req: {
            params: undefined,
            body: AppDB_Types["store"]["update"]
        },
        res: app_api_response<undefined>
    }
}>

const PATCH_BODY = z.object({
    name: z.string({message: "name は 文字列 で指定する必要があります"}).optional(),
    description: z.string({message: "description は 文字列 で指定する必要があります"}).optional(),
    imgId: z.string({message: "imgId は 文字列 で指定する必要があります"}).optional(),
    tutorialId: z.string({message: "tutorialId は 文字列 で指定する必要があります"}).optional(),
    readyMessageId: z.string({message: "readyMessageId は 文字列 で指定する必要があります"}).optional()
}) satisfies z.ZodType<
    AppAPI_staff_admin_Store_Map["PATCH"]["req"]["body"]
>

export async function PATCH(req: NextRequest) {
    const email = await AppAPI.session.getEmail();
    if (!email) return AppAPI.response.errorResponse.Unauthorized;

    const permission = await AppAPI.permission.get(email);
    if (!permission) return AppAPI.response.errorResponse.Unauthorized;
    if (permission.isLock || !permission.isAdmin) {
        return AppAPI.response.errorResponse.Forbidden;
    }


    const parsed = PATCH_BODY.safeParse(await req.json().catch(() => null));
    if (!parsed.success) return AppAPI.response.errorResponse.BadRequest;

    try {
        await AppDB.store.update(parsed.data);
    } catch {
        return AppAPI.response.errorResponse.ServerError;
    }

    return NextResponse.json<
        AppAPI_staff_admin_Store_Map["PATCH"]["res"]
    >({ success: true, data: undefined });
}



