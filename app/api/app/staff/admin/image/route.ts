import { AppDB, AppDB_Types } from "@/libs/db";
import { app_api_map_gen, app_api_response } from "../../../api";
import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { AppAPI } from "@/libs/api";
import { db } from "@/libs/db/db";

export type AppAPI_staff_admin_Image_Map = app_api_map_gen<{
    GET: {
        req: {
            params: undefined,
            body: undefined
        },
        res: app_api_response<AppDB_Types["image"]["model"][]>
    },
    POST: {
        req: {
            params: undefined,
            body: FormData
        },
        res: app_api_response<AppDB_Types["image"]["model"]>
    }
}>



export async function GET() {
    const email = await AppAPI.session.getEmail();
    if (!email) return AppAPI.response.errorResponse.Unauthorized;

    const permission = await AppAPI.permission.get(email);
    if (!permission) return AppAPI.response.errorResponse.Unauthorized;
    if (!permission.isAdmin) return AppAPI.response.errorResponse.Forbidden;

    const images = await AppDB.image.getAll().catch(() => null);
    if (images === null) return AppAPI.response.errorResponse.ServerError;

    return NextResponse.json<AppAPI_staff_admin_Image_Map["GET"]["res"]>({
        success: true,
        data: images
    })
    
}


export async function POST(req: NextRequest) {
    const email = await AppAPI.session.getEmail();
    if (!email) return AppAPI.response.errorResponse.Unauthorized;

    const permission = await AppAPI.permission.get(email);
    if (!permission) return AppAPI.response.errorResponse.Unauthorized;
    if (!permission.isAdmin) return AppAPI.response.errorResponse.Forbidden;


    const file = (await req.formData()).get("file");
    if (!(file instanceof File)) return AppAPI.response.errorResponse.BadRequest;

    const type = file.type;
    if (type !== "image/jpeg" && type !== "image/png")return AppAPI.response.errorResponse.BadRequest;
    
    const blob = await put(crypto.randomUUID(), file, {
        access: "public",
        contentType: type
    }).catch(() => null);
    if (!blob) return AppAPI.response.errorResponse.ServerError;

    const image = await AppDB.image.add(blob.downloadUrl).catch(() => null);
    if (!image) return AppAPI.response.errorResponse.ServerError;

    return NextResponse.json<AppAPI_staff_admin_Image_Map["POST"]["res"]>({
        success: true,
        data: image
    });
}
