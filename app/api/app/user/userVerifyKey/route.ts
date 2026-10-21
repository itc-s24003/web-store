import { AppDB, AppDB_Types } from "@/libs/db";
import { app_api_map_gen, app_api_response } from "../../api";
import { AppAPI } from "@/libs/api";
import { NextResponse } from "next/server";

export type AppAPI_user_UserVerifyKey_Map = app_api_map_gen<{
    GET: {
        req: {
            params: undefined,
            body: undefined
        },
        res: app_api_response<AppDB_Types["userVerifyKey"]["model"]>
    }
}>




export async function GET() {
    const email = await AppAPI.session.getEmail();
    if (!email) return AppAPI.response.errorResponse.Unauthorized;

    const key = await AppDB.userVerifyKey.email.get(email).catch(() => null);
    if (key === null) return AppAPI.response.errorResponse.ServerError;

    return NextResponse.json<AppAPI_user_UserVerifyKey_Map["GET"]["res"]>({
        success: true,
        data: key
    })
}