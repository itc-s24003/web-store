import { api_client_req } from "@/app/api/app/client";
import { AppAPI_staff_admin_ServiceKey_Map } from "./route";

const serviceKeyEndpoint = "/api/app/staff/admin/serviceKey";

export function get() {
	return api_client_req<AppAPI_staff_admin_ServiceKey_Map, "GET">(
		serviceKeyEndpoint,
		"GET",
		undefined,
		undefined
	);
}

export function create(name: string) {
	return api_client_req<AppAPI_staff_admin_ServiceKey_Map, "POST">(
		serviceKeyEndpoint,
		"POST",
		undefined,
		{ name }
	);
}

export * from "./[id]/client"
