import { AppDB, AppDB_Types } from "@/libs/db";
import { app_api_map_gen, app_api_response } from "../../../api";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { AppAPI } from "@/libs/api";

export type AppAPI_staff_admin_ServiceKey_Map = app_api_map_gen<{
    GET: {
        req: {
            params: undefined,
            body: undefined
        },
        res: app_api_response<AppDB_Types["serviceKey"]["detail"][]>
    },
    POST: {
        req: {
            params: undefined,
            body: {
                name: string
            }
        },
        res: app_api_response<AppDB_Types["serviceKey"]["detail"]>
    }
}>


export async function GET() {
    const email = await AppAPI.session.getEmail();
    if (!email) return AppAPI.response.errorResponse.Unauthorized;

    const permission = await AppAPI.permission.get(email);
    if (!permission) return AppAPI.response.errorResponse.Unauthorized;
    if (permission.isLock || !permission.isAdmin) {
        return AppAPI.response.errorResponse.Forbidden;
    }

    try {
        const data = await AppDB.serviceKey.getAll();
        return NextResponse.json<
            AppAPI_staff_admin_ServiceKey_Map["GET"]["res"]
        >({ success: true, data });
    } catch {
        return AppAPI.response.errorResponse.ServerError;
    }
}


export async function POST(req: NextRequest) {
    const email = await AppAPI.session.getEmail();
    if (!email) return AppAPI.response.errorResponse.Unauthorized;

    const permission = await AppAPI.permission.get(email);
    if (!permission) return AppAPI.response.errorResponse.Unauthorized;
    if (permission.isLock || !permission.isAdmin) {
        return AppAPI.response.errorResponse.Forbidden;
    }

    const schema = z.object({
        name: z.string().trim().min(1).max(100)
    }) satisfies z.ZodType<
        AppAPI_staff_admin_ServiceKey_Map["POST"]["req"]["body"]
    >;

    let body: unknown;
    try {
        body = await req.json();
    } catch {
        return AppAPI.response.errorResponse.BadRequest;
    }

    const parsed = schema.safeParse(body);
    if (!parsed.success) return AppAPI.response.errorResponse.BadRequest;

    try {
        const data = await AppDB.serviceKey.add(parsed.data.name);
        return NextResponse.json<
            AppAPI_staff_admin_ServiceKey_Map["POST"]["res"]
        >({ success: true, data });
    } catch {
        return AppAPI.response.errorResponse.ServerError;
    }
}