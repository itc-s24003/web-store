import { AppAPI } from "@/libs/api";
import { app_api_map_gen, app_api_response } from "../../api";
import { NextResponse } from "next/server";
import { AppDB, AppDB_Types } from "@/libs/db";

export type AppAPI_user_User_Map = app_api_map_gen<{
    GET: {
        req: {
            params: undefined,
            body: undefined
        },
        res: app_api_response<AppDB_Types["user"]["detailMin"]>
    }
}>




export async function GET() {
    const email = await AppAPI.session.getEmail();
    if (!email) return AppAPI.response.errorResponse.Unauthorized;

    return AppDB.user.email.getDetailMin(email).then(
        u => u ?
        NextResponse.json<AppAPI_user_User_Map["GET"]["res"]>({
            success: true,
            data: u
        }) :
        AppAPI.response.errorResponse.Unauthorized

    ).catch(() => AppAPI.response.errorResponse.ServerError)
}