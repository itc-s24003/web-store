import { AppAPI } from "@/libs/api";
import { AppDB, AppDB_Types } from "@/libs/db";
import { app_api_map_gen, app_api_response, app_api_response_error } from "../../../api";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

export type AppAPI_staff_admin_Product_Map = app_api_map_gen<{
    POST: {
        req: {
            params: undefined,
            body: {
                name: string,
                description: string,
                price: number
                groupId: string
            }
        },
        res: app_api_response<AppDB_Types["product"]["detail"]>
    }
}>

const POST_BODY = z.object({
    groupId: z.ulid({ message: "groupId は 文字列 で指定する必要があります" }),
    name: z.string({ message: "name は 文字列 で指定する必要があります" })
        .max(16, { message: "name は 16文字以内 で指定する必要があります" }),
    description: z.string({ message: "description は 文字列 で指定する必要があります" })
        .max(128, { message: "description は 128文字以内 で指定する必要があります" }),
    price: z.int({ message: "price は 整数で指定する必要があります" })
        .min(0, { message: "price は 0以上 で指定する必要があります" })
}) satisfies z.ZodType<
    AppAPI_staff_admin_Product_Map["POST"]["req"]["body"]
>;

export async function POST(req: NextRequest) {
    const email = await AppAPI.session.getEmail();
    if (!email) return AppAPI.response.errorResponse.Unauthorized;

    const permission = await AppAPI.permission.get(email);
    if (!permission) return AppAPI.response.errorResponse.Unauthorized;
    if (!permission.isAdmin || permission.isLock) {
        return AppAPI.response.errorResponse.Forbidden;
    }


    const body = POST_BODY.safeParse(await req.json().catch(() => null));
    if (!body.success) {
        return NextResponse.json<app_api_response_error>({
            success: false,
            error: body.error.message
        }, { status: 400 });
    }

    const product = await AppDB.product.add(
        body.data.groupId,
        body.data.name,
        body.data.description,
        body.data.price
    ).catch(() => null);
    if (!product) return AppAPI.response.errorResponse.ServerError;

    return NextResponse.json<AppAPI_staff_admin_Product_Map["POST"]["res"]>({
        success: true,
        data: product
    });
}
