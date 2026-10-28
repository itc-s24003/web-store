import { NextRequest, NextResponse } from "next/server";
import { app_api_map_gen, app_api_response } from "../../api";
import z from "zod";
import { AppAPI } from "@/libs/api";
import { AppDB } from "@/libs/db";

export type AppAPI_user_Order_Map = app_api_map_gen<{
    POST: {
        req: {
            params: undefined,
            body: {
                cartItemIds: string[]
            }
        },
        res: app_api_response<undefined>
    }
}>




const POST_BODY = z.object({
    cartItemIds: z.array(z.string(), {message: "cartItemIds は 配列 で指定する必要があります"}).min(1, {message: "cartItemIds は 1つ以上 の要素を持つ配列で指定する必要があります"})
}) satisfies z.ZodType<
    AppAPI_user_Order_Map["POST"]["req"]["body"]
>

export async function POST(req: NextRequest) {
    const email = await AppAPI.session.getEmail();
    if (!email) return AppAPI.response.errorResponse.Unauthorized;

    const permission = await AppAPI.permission.getDetail(email);
    if (!permission) return AppAPI.response.errorResponse.Unauthorized;
    if (permission.isLock) return AppAPI.response.errorResponse.Forbidden;

    const body = POST_BODY.safeParse(await req.json().catch(() => null));
    if (!body.success) {
        console.log(body.error)
        return NextResponse.json<AppAPI_user_Order_Map["POST"]["res"]>({
            success: false,
            error: body.error.issues.map(issue => issue.message).join(", ")
        }, { status: 400 });
    }


    try {
        await AppDB.order.email.add(email, body.data.cartItemIds);
        return NextResponse.json<AppAPI_user_Order_Map["POST"]["res"]>({
            success: true,
            data: undefined
        })
    } catch (e) {
        console.error(e);
        return AppAPI.response.errorResponse.ServerError;
    }
}