import { api_client_req } from "@/app/api/app/client";
import { AppAPI_staff_admin_ProductGroup__id__Map } from "./route";

const productGroupEndpoint = (id: string) =>
	`/api/app/staff/admin/productGroup/${encodeURIComponent(id)}`;

export function update(
	id: string,
	body: AppAPI_staff_admin_ProductGroup__id__Map["PATCH"]["req"]["body"]
) {
	return api_client_req<AppAPI_staff_admin_ProductGroup__id__Map, "PATCH">(
		productGroupEndpoint(id),
		"PATCH",
		undefined,
		body
	);
}

export function remove(id: string) {
	return api_client_req<AppAPI_staff_admin_ProductGroup__id__Map, "DELETE">(
		productGroupEndpoint(id),
		"DELETE",
		undefined,
		undefined
	);
}
