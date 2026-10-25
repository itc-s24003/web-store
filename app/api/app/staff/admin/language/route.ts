import { AppAPI } from "@/libs/api";
import { AppDB, AppDB_Types } from "@/libs/db";
import { app_api_map_gen, app_api_response } from "../../../api";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

export type AppAPI_staff_admin_Language_Map = app_api_map_gen<{
    POST: {
        req: {
            params: undefined,
            body: {
                name: string
            }
        },
        res: app_api_response<AppDB_Types["language"]["model"]>
    }
}>;

const POST_BODY = z.object({
    name: z.string().min(1).max(16)
}) satisfies z.ZodType<
    AppAPI_staff_admin_Language_Map["POST"]["req"]["body"]
>;

export async function POST(req: NextRequest) {
    const email = await AppAPI.session.getEmail();
    if (!email) return AppAPI.response.errorResponse.Unauthorized;

    const permission = await AppAPI.permission.get(email);
    if (!permission) return AppAPI.response.errorResponse.Unauthorized;
    if (!permission.isAdmin || permission.isLock) {
        return AppAPI.response.errorResponse.Forbidden;
    }

    const body = POST_BODY.safeParse(await req.json().catch(() => null));
    if (!body.success) return AppAPI.response.errorResponse.BadRequest;

    const language = await AppDB.language.add(body.data.name).catch(() => null);
    if (!language) return AppAPI.response.errorResponse.ServerError;

    return NextResponse.json<AppAPI_staff_admin_Language_Map["POST"]["res"]>({
        success: true,
        data: language
    });
}


