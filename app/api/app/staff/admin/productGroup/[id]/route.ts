import { api_url_param_id, app_api_map_gen, app_api_response } from "@/app/api/app/api";
import { AppAPI } from "@/libs/api";
import { AppDB, AppDB_Types } from "@/libs/db";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export type AppAPI_staff_admin_ProductGroup__id__Map = app_api_map_gen<{
    PATCH: {
        req: {
            params: undefined,
            body: AppDB_Types["productGroup"]["update"]
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
}>;

const UPDATE_BODY = z.object({
    name: z.string({message: "name は 文字列 で指定する必要があります"}).optional(),
    description: z.string({message: "description は 文字列 で指定する必要があります"}).optional(),
    showTop: z.boolean({message: "showTop は 真偽値 で指定する必要があります"}).optional(),
    imgId: z.string({message: "imgId は 文字列 で指定する必要があります"}).optional()
}) satisfies z.ZodType<AppDB_Types["productGroup"]["update"]>;



async function authorize() {
    const email = await AppAPI.session.getEmail();
    if (!email) return AppAPI.response.errorResponse.Unauthorized;

    const permission = await AppAPI.permission.get(email);
    if (!permission) return AppAPI.response.errorResponse.Unauthorized;
    if (permission.isLock || !permission.isAdmin) {
        return AppAPI.response.errorResponse.Forbidden;
    }
}

export async function PATCH(req: NextRequest, { params }: api_url_param_id) {
    const authorizationError = await authorize();
    if (authorizationError) return authorizationError;

    const { id } = await params;


    const parsedInput = UPDATE_BODY.safeParse(await req.json().catch(() => null));
    if (!parsedInput.success) return AppAPI.response.errorResponse.BadRequest;

    try {
        await AppDB.productGroup.update(id, parsedInput.data);
        return NextResponse.json<
            AppAPI_staff_admin_ProductGroup__id__Map["PATCH"]["res"]
        >({ success: true, data: undefined });
    } catch {
        return AppAPI.response.errorResponse.ServerError;
    }
}

export async function DELETE(_req: NextRequest, { params }: api_url_param_id) {
    const authorizationError = await authorize();
    if (authorizationError) return authorizationError;

    const { id } = await params;

    try {
        await AppDB.productGroup.remove(id);
        return NextResponse.json<
            AppAPI_staff_admin_ProductGroup__id__Map["DELETE"]["res"]
        >({ success: true, data: undefined });
    } catch {
        return AppAPI.response.errorResponse.ServerError;
    }
}


