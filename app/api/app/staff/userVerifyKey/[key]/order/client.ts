import { api_client_req } from "@/app/api/app/client";
import type { AppAPI_staff_UserVerifyKey__key__Order_Map } from "@/app/api/app/staff/userVerifyKey/[key]/order/route";

export function get(key: string) {
    return api_client_req<AppAPI_staff_UserVerifyKey__key__Order_Map, "GET">(
        `/api/app/staff/userVerifyKey/${encodeURIComponent(key)}/order`,
        "GET",
        undefined,
        undefined
    );
}
