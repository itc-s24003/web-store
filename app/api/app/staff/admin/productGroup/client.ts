import { api_client_req } from "@/app/api/app/client";
import { AppAPI_staff_admin_ProductGroup_Map } from "./route";

const productGroupEndpoint = "/api/app/staff/admin/productGroup";


export function add(
	body: AppAPI_staff_admin_ProductGroup_Map["POST"]["req"]["body"]
) {
	return api_client_req<AppAPI_staff_admin_ProductGroup_Map, "POST">(
		productGroupEndpoint,
		"POST",
		undefined,
		body
	);
}
