import { api_url_param_id, app_api_map_gen, app_api_response } from "@/app/api/app/api"
import { AppAPI } from "@/libs/api"
import { db } from "@/libs/db/db"
import { del } from "@vercel/blob"
import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

export type AppAPI_staff_admin_Image__id__Map = app_api_map_gen<{
    DELETE: {
        req: {
            params: undefined,
            body: undefined
        },
        res: app_api_response<undefined>
    }
}>


export async function DELETE(_req: NextRequest, p: api_url_param_id) {
    const email = await AppAPI.session.getEmail()
    if (!email) return AppAPI.response.errorResponse.Unauthorized

    const permission = await AppAPI.permission.get(email)
    if (!permission) return AppAPI.response.errorResponse.Unauthorized
    if (permission.isLock || !permission.isAdmin) {
        return AppAPI.response.errorResponse.Forbidden
    }

    const { id } = await p.params
    const parsed = z.string().safeParse(id)
    if (!parsed.success) return AppAPI.response.errorResponse.BadRequest

    try {
        await db.$transaction(async tx => {
            const image = await tx.image.delete({
                where: {
                    id: parsed.data
                },
                select: {
                    url: true
                }
            });
            await del(image.url);
        })

        return NextResponse.json({ success: true, data: undefined })
    } catch {
        return AppAPI.response.errorResponse.ServerError
    }
}