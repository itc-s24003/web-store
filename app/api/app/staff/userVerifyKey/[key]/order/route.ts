import { api_url_param_gen, app_api_map_gen, app_api_response } from "@/app/api/app/api"
import { AppAPI } from "@/libs/api"
import { AppDB, AppDB_Types } from "@/libs/db"
import { NextResponse } from "next/server"

export type AppAPI_staff_UserVerifyKey__key__Order_Map = app_api_map_gen<{
    GET: {
        req: {
            params: undefined,
            body: undefined
        },
        res: app_api_response<AppDB_Types["order"]["model"][]>
    }
}>


export async function GET(req: Request, p: api_url_param_gen<{key: string}>) {
    const email = await AppAPI.session.getEmail();
    if (!email) return AppAPI.response.errorResponse.Unauthorized;

    const permission = await AppAPI.permission.get(email);
    if (!permission) return AppAPI.response.errorResponse.Unauthorized;
    if (!permission.isAdmin && !permission.isStaff) return AppAPI.response.errorResponse.Forbidden;

    const key = (await p.params).key;
    const orders = await AppDB.order.userVerifyKey.get(key);
    if (!orders) return AppAPI.response.errorResponse.NotFound;

    return NextResponse.json<AppAPI_staff_UserVerifyKey__key__Order_Map["GET"]["res"]>({
        success: true,
        data: orders
    });
}