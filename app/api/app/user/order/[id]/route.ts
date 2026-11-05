import { AppAPI } from "@/libs/api";
import { AppDB } from "@/libs/db";
import { NextRequest, NextResponse } from "next/server";
import { app_api_map_gen, app_api_response } from "../../../api";

export type AppAPI_user_Order__id__Map = app_api_map_gen<{
    DELETE: {
        req: {
            params: undefined,
            body: undefined
        },
        res: app_api_response<undefined>
    }
}>




export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    const email = await AppAPI.session.getEmail();
    if (!email) return AppAPI.response.errorResponse.Unauthorized;

    const permission = await AppAPI.permission.get(email);
    if (!permission) return AppAPI.response.errorResponse.Unauthorized;
    if (permission.isLock) return AppAPI.response.errorResponse.Forbidden;

    const now = new Date();
    now.setMinutes(now.getMinutes() + 30);
    AppDB.user.email.update(email, {
        lockTime: now
    })

    try {
        await AppDB.order.email.cancel(email, params.id);
        return NextResponse.json<AppAPI_user_Order__id__Map["DELETE"]["res"]>({
            success: true,
            data: undefined
        })

    } catch {
        return AppAPI.response.errorResponse.ServerError;
    }
}