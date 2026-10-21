import { api_client_req } from "@/app/api/app/client";
import { AppAPI_staff_admin_Product__id__Map } from "./route";

const productEndpoint = (id: string) =>
	`/api/app/staff/admin/product/${encodeURIComponent(id)}`;

export function get(id: string) {
	return api_client_req<AppAPI_staff_admin_Product__id__Map, "GET">(
		productEndpoint(id),
		"GET",
		undefined,
		undefined
	);
}

export function update(id: string, body: AppAPI_staff_admin_Product__id__Map["PATCH"]["req"]["body"]) {
	return api_client_req<AppAPI_staff_admin_Product__id__Map, "PATCH">(
		productEndpoint(id),
		"PATCH",
		undefined,
        body
	);
}

export function remove(id: string) {
	return api_client_req<AppAPI_staff_admin_Product__id__Map, "DELETE">(
		productEndpoint(id),
		"DELETE",
		undefined,
		undefined
	);
}
