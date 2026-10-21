import { api_client_req } from "@/app/api/app/client";
import { AppAPI_staff_admin_ServiceKey__id__Map } from "./route";

const serviceKeyEndpoint = (id: string) =>
	`/api/app/staff/admin/serviceKey/${encodeURIComponent(id)}`;

export function remove(id: string) {
	return api_client_req<AppAPI_staff_admin_ServiceKey__id__Map, "DELETE">(
		serviceKeyEndpoint(id),
		"DELETE",
		undefined,
		undefined
	);
}
