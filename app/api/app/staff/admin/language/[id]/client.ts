import { api_client_req } from "@/app/api/app/client";
import type { AppAPI_staff_admin_Language__id__Map } from "./route";

const languageUrl = (id: string) =>
	`/api/app/staff/admin/language/${encodeURIComponent(id)}`;



export function update(id: string, name: string) {
    return api_client_req<AppAPI_staff_admin_Language__id__Map, "PATCH">(
        languageUrl(id),
        "PATCH",
        undefined,
        {
            name
        },
    )
}

export function remove(id: string) {
    return api_client_req<AppAPI_staff_admin_Language__id__Map, "DELETE">(
        languageUrl(id),
        "DELETE",
        undefined,
        undefined,
    )
}