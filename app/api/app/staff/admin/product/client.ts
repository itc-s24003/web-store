import { api_client_req } from "@/app/api/app/client";
import { AppAPI_staff_admin_Product_Map } from "./route";

const productEndpoint = "/api/app/staff/admin/product";

export function getAll() {
	return api_client_req<AppAPI_staff_admin_Product_Map, "GET">(
		productEndpoint,
		"GET",
		undefined,
		undefined
	);
}

export function add(body: AppAPI_staff_admin_Product_Map["POST"]["req"]["body"]) {
	return api_client_req<AppAPI_staff_admin_Product_Map, "POST">(
		productEndpoint,
		"POST",
		undefined,
		body
	);
}


export * from "./[id]/client"