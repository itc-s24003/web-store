import { api_client_req } from "@/app/api/app/client";
import { AppAPI_staff_admin_Store_Map } from "./route";

const storeEndpoint = "/api/app/staff/admin/store";

export function update(
	body: AppAPI_staff_admin_Store_Map["PATCH"]["req"]["body"]
) {
	return api_client_req<AppAPI_staff_admin_Store_Map, "PATCH">(
		storeEndpoint,
		"PATCH",
		undefined,
		body
	);
}
