import { api_url_param_gen, app_api_map_gen, app_api_response } from "@/app/api/app/api";
import { AppAPI } from "@/libs/api";
import { AppDB_Types } from "@/libs/db";
import { db } from "@/libs/db/db";
import { NextRequest, NextResponse } from "next/server";

export type AppAPI_staff_UserVerifyKey__key__user_Map = app_api_map_gen<{
    GET: {
        req: {
            params: undefined,
            body: undefined
        },
        res: app_api_response<AppDB_Types["user"]["detail"]>
    }
}>



export async function GET(req: NextRequest, p: api_url_param_gen<{key: string}>) {
    const email = await AppAPI.session.getEmail();
    if (!email) return AppAPI.response.errorResponse.Unauthorized;

    const permission = await AppAPI.permission.get(email);
    if (!permission) return AppAPI.response.errorResponse.Unauthorized;
    if (!permission.isAdmin && !permission.isStaff) return AppAPI.response.errorResponse.Forbidden;

    const key = (await p.params).key;
    const detail = await db.userVerifyKey.findUnique({
        where: {
            key
        },
        select: {
            user: {
                select: {
                    id: true,
                    
                    orders: {
                        select: {
                            id: true,
                            index: true,

                            isCanceled: true,
                            isReady: true,
                            isReceived: true,

                            cartItems: {
                                select: {
                                    id: true,
                                    product: {
                                        select: {
                                            id: true,
                                            name: true,
                                            price: true,
                                            img: {
                                                select: {
                                                    url: true
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }).then(k => k?.user).catch(() => null);
    if (detail === null) return AppAPI.response.errorResponse.ServerError;
    if (!detail) return AppAPI.response.errorResponse.NotFound;

    return NextResponse.json<AppAPI_staff_UserVerifyKey__key__user_Map["GET"]["res"]>({
        success: true,
        data: detail
    })
}