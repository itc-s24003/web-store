import { api_client_req } from "@/app/api/app/client";
import { AppAPI_staff_admin_User__id__Map } from "./route";

const userEndpoint = (id: string) =>
	`/api/app/staff/admin/user/${encodeURIComponent(id)}`;

export function get(id: string) {
	return api_client_req<AppAPI_staff_admin_User__id__Map, "GET">(
		userEndpoint(id),
		"GET",
		undefined,
		undefined
	);
}


export function update(
    id: string,
    body: AppAPI_staff_admin_User__id__Map["PATCH"]["req"]["body"]
) {
    return api_client_req<AppAPI_staff_admin_User__id__Map, "PATCH">(
        userEndpoint(id),
        "PATCH",
        undefined,
        body
    );
}