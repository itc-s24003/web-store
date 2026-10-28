import { AppDB, AppDB_Types } from "@/libs/db";
import { app_api_map_gen, app_api_response, app_api_response_error } from "../../api";
import { NextRequest, NextResponse } from "next/server";
import { AppAPI } from "@/libs/api";
import z from "zod";

export type AppAPI_user_CartItem_Map = app_api_map_gen<{
    GET: {
        req: {
            params: undefined,
            body: undefined
        },
        res: app_api_response<AppDB_Types["cartItem"]["model"][]>
    },
    POST: {
        req: {
            params: undefined,
            body: {
                productId: string,
                count: number
            }
        },
        res: app_api_response<AppDB_Types["cartItem"]["model"]>
    }
}>




export async function GET() {
    const email = await AppAPI.session.getEmail();
    if (!email) return AppAPI.response.errorResponse.Unauthorized;

    const permission = await AppAPI.permission.get(email);
    if (!permission) return AppAPI.response.errorResponse.Unauthorized;
    if (permission.isLock) return AppAPI.response.errorResponse.Forbidden;

    const cartItems = await AppDB.cartItem.email.getAll(email);

    return NextResponse.json<AppAPI_user_CartItem_Map["GET"]["res"]>({
        success: true,
        data: cartItems
    })
}





const POST_BODY = z.object({
    productId: z.ulid({message: "productId は ulid で指定する必要があります"}),
    count: z.int({message: "count は 整数 で指定する必要があります"}).min(1, {message: "count は 1以上 で指定する必要があります"})
}) satisfies z.ZodType<
    AppAPI_user_CartItem_Map["POST"]["req"]["body"]
>

export async function POST(req: NextRequest) {
    const email = await AppAPI.session.getEmail();
    if (!email) return AppAPI.response.errorResponse.Unauthorized;

    const body = POST_BODY.safeParse(await req.json());
    if (!body.success) return NextResponse.json<app_api_response_error>({
        success: false,
        error: body.error.issues.map(issue => issue.message).join(", ")
    }, {status: 500});
    
    const permission = await AppAPI.permission.get(email);
    if (!permission) return AppAPI.response.errorResponse.Unauthorized;
    if (permission.isLock) return AppAPI.response.errorResponse.Forbidden;

    const cartItem = await AppDB.cartItem.email.add(email, body.data.productId, body.data.count).catch(() => null);
    if (!cartItem) return AppAPI.response.errorResponse.ServerError;

    return NextResponse.json<AppAPI_user_CartItem_Map["POST"]["res"]>({
        success: true,
        data: cartItem
    })

}