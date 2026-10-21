import { api_client_req } from "@/app/api/app/client";
import { AppAPI_staff_UserVerifyKey__key__user_Map } from "./route";

const userEndpoint = (key: string) =>
	`/api/app/staff/userVerifyKey/${encodeURIComponent(key)}/user`;

export function get(key: string) {
	return api_client_req<
		AppAPI_staff_UserVerifyKey__key__user_Map,
		"GET"
	>(userEndpoint(key), "GET", undefined, undefined);
}
