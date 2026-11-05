import { AppDB, AppDB_Types } from "@/libs/db";
import { app_api_map_gen, app_api_response } from "../../api";
import { AppAPI } from "@/libs/api";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

export type AppAPI_staff_Order_Map = app_api_map_gen<{
    GET: {
        req: {
            params: undefined,
            body: undefined
        },
        res: app_api_response<AppDB_Types["order"]["model"][]>
    },
    PATCH: {
        req: {
            params: undefined,
            body: {
                targets: string[],
                data: AppDB_Types["order"]["update"]
            }
        },
        res: app_api_response<undefined>
    }
}>



export async function GET() {
    const email = await AppAPI.session.getEmail();
    if (!email) return AppAPI.response.errorResponse.Unauthorized;

    const permission = await AppAPI.permission.getDetail(email);
    if (!permission) return AppAPI.response.errorResponse.Unauthorized;
    if (permission.isLock) return AppAPI.response.errorResponse.Forbidden;

    const orders = await AppDB.order.getAll();

    return NextResponse.json<AppAPI_staff_Order_Map["GET"]["res"]>({
        success: true,
        data: orders
    })
}


const PATCH_BODY = z.object({
    targets: z.array(z.string(), {message: "targets は 文字列 の配列 で指定する必要があります"}).min(1, {message: "targets は 1 件以上 指定する必要があります"}),
    data: z.object({
        isCanceled: z.boolean({message: "isCanceled は 真偽値 で指定する必要があります"}).optional(),
        isReceived: z.boolean({message: "isReceived は 真偽値 で指定する必要があります"}).optional(),
        isReady: z.boolean({message: "isReady は 真偽値 で指定する必要があります"}).optional()
    })

}, {message: "オブジェクト で指定する必要があります"}) satisfies z.ZodType<
    AppAPI_staff_Order_Map["PATCH"]["req"]["body"]
>

export async function PATCH(req: NextRequest) {
    const email = await AppAPI.session.getEmail();
    if (!email) return AppAPI.response.errorResponse.Unauthorized;

    const permission = await AppAPI.permission.getDetail(email);
    if (!permission) return AppAPI.response.errorResponse.Unauthorized;
    if (permission.isLock) return AppAPI.response.errorResponse.Forbidden;

    const body = await req.json();
    const validated = PATCH_BODY.safeParse(body);
    if (!validated.success) {
        return AppAPI.response.errorResponse.BadRequest;
    }

    try {
        await AppDB.order.updates(validated.data.targets, validated.data.data);
        return NextResponse.json<AppAPI_staff_Order_Map["PATCH"]["res"]>({
            success: true,
            data: undefined
        })

    } catch {
        return AppAPI.response.errorResponse.ServerError;
    }
}