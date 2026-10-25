import { api_client_req } from "@/app/api/app/client";
import type { AppAPI_staff_admin_Language_Map } from "./route";

const path = "/api/app/staff/admin/language";


export function add(name: string) {
    return api_client_req<AppAPI_staff_admin_Language_Map, "POST">(
        path,
        "POST",
        undefined,
        {
            name
        },
    )
}

export * from "./[id]/client"
