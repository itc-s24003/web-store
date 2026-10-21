import { api_client_req } from "@/app/api/app/client";
import { AppAPI_staff_order__id__Map } from "./route";

const orderEndpoint = (id: string) =>
	`/api/app/staff/order/${encodeURIComponent(id)}`;

export function update(
	id: string,
	body: AppAPI_staff_order__id__Map["PATCH"]["req"]["body"]
) {
	return api_client_req<AppAPI_staff_order__id__Map, "PATCH">(
		orderEndpoint(id),
		"PATCH",
		undefined,
		body
	);
}
