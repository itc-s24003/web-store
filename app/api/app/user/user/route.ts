import { AppAPI } from "@/libs/api";
import { app_api_map_gen, app_api_response } from "../../api";
import { NextResponse } from "next/server";
import { AppDB, AppDB_Types } from "@/libs/db";
import z from "zod";
import { AppCrypto_Client } from "@/libs/crypto/client";

export type AppAPI_user_User_Map = app_api_map_gen<{
    GET: {
        req: {
            params: undefined,
            body: undefined
        },
        res: app_api_response<AppDB_Types["user"]["detailMin"]>
    },
    PATCH: {
        req: {
            params: undefined,
            body: {
                subscribe_endpoint: string;
                subscribe_authKey: string;
                subscribe_p256dh: string;
            }
        },
        res: app_api_response<undefined>
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





const PATCH_BODY = z.object({
    subscribe_endpoint: z.string().max(1024),
    subscribe_authKey: z.string().max(256),
    subscribe_p256dh: z.string().max(256)
}) satisfies z.ZodType<
    AppAPI_user_User_Map["PATCH"]["req"]["body"]
>;



export async function PATCH(req: Request) {
    const email = await AppAPI.session.getEmail();
    if (!email) return AppAPI.response.errorResponse.Unauthorized;

    const body = await req.json().catch(() => null);
    if (!body) return AppAPI.response.errorResponse.BadRequest;

    const bodyParse = PATCH_BODY.safeParse(body);
    if (!bodyParse.success) return AppAPI.response.errorResponse.BadRequest;

    const { subscribe_endpoint, subscribe_authKey, subscribe_p256dh } = bodyParse.data;

    const subscribe_hash = await AppCrypto_Client.toHash(subscribe_endpoint+subscribe_authKey+subscribe_p256dh);

    const res = await AppDB.user.email.update(email, {
        subscribe_endpoint,
        subscribe_authKey,
        subscribe_p256dh,
        subscribe_hash
    }).catch(() => null);

    if (!res) return AppAPI.response.errorResponse.ServerError;

    return NextResponse.json<AppAPI_user_User_Map["PATCH"]["res"]>({
        success: true,
        data: undefined
    });
}