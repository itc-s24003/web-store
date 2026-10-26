import { AppDB, AppDB_Types } from "@/libs/db";
import { AppAPI } from "@/libs/api";
import { app_api_map_gen, app_api_response, app_api_response_error } from "../../../api";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export type AppAPI_staff_admin_ProductGroup_Map = app_api_map_gen<{
    POST: {
        req: {
            params: undefined,
            body: {
                name: string,
                showTop: boolean,
                imgId: string | null
            }
        },
        res: app_api_response<AppDB_Types["productGroup"]["edit"]>
    }
}>;

const POST_BODY = z.object({
    name: z.string({message: "name は 文字列 で指定する必要があります"}),
    showTop: z.boolean({message: "showTop は 真偽値 で指定する必要があります"}),
    imgId: z.string({message: "imgId は 文字列 で指定する必要があります"}).nullable()
}) satisfies z.ZodType<
    AppAPI_staff_admin_ProductGroup_Map["POST"]["req"]["body"]
>;

export async function POST(req: NextRequest) {
    const email = await AppAPI.session.getEmail();
    if (!email) return AppAPI.response.errorResponse.Unauthorized;

    const permission = await AppAPI.permission.get(email);
    if (!permission) return AppAPI.response.errorResponse.Unauthorized;
    if (permission.isLock || !permission.isAdmin) {
        return AppAPI.response.errorResponse.Forbidden;
    }

    const body = POST_BODY.safeParse(await req.json().catch(() => null));
    if (!body.success) {
        return NextResponse.json<app_api_response_error>({
            success: false,
            error: body.error.message
        }, { status: 400 });
    }

    try {
        const data = await AppDB.productGroup.add(body.data.name, body.data.showTop, body.data.imgId || undefined);
        return NextResponse.json<
            AppAPI_staff_admin_ProductGroup_Map["POST"]["res"]
        >({ success: true, data });
    } catch {
        return AppAPI.response.errorResponse.ServerError;
    }
}


