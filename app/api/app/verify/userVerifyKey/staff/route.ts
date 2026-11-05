import { NextRequest, NextResponse } from "next/server";
import { app_api_map_gen, app_api_response } from "../../../api";
import { AppAPI } from "@/libs/api";
import { AppDB } from "@/libs/db";

export type AppAPI_verify_UserVerifyKey_info_Map = app_api_map_gen<{
    POST: {
        req: {
            params: {
                key: string,
                userId: string
            },
            body: undefined
        },
        res: app_api_response<undefined>
    }
}>


export async function POST(req: NextRequest) {
    const params = req.nextUrl.searchParams;
    const key = params.get("key");
    if (!key) return AppAPI.response.errorResponse.BadRequest;
    const userId = params.get("userId");
    if (!userId) return AppAPI.response.errorResponse.BadRequest;

    try {
        const verify = await AppDB.userVerifyKey.verifyAndInfo(userId, key);
        console.log("verify", verify)
        return verify?.user.isStaff ?
        NextResponse.json<AppAPI_verify_UserVerifyKey_info_Map["POST"]["res"]>({
            success: true,
            data: undefined
            
        }) : AppAPI.response.errorResponse.Unauthorized;
        
    } catch {
        return AppAPI.response.errorResponse.ServerError;

    }

}