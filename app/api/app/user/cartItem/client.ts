import { api_client_req } from "@/app/api/app/client";
import type { AppAPI_user_CartItem_Map } from "./route";

const path = "/api/app/user/cartItem";

export function get() {
    return api_client_req<AppAPI_user_CartItem_Map, "GET">(path, "GET", undefined, undefined);
}

export function add(body: AppAPI_user_CartItem_Map["POST"]["req"]["body"]) {
    return api_client_req<AppAPI_user_CartItem_Map, "POST">(path, "POST", undefined, body);
}


export * from "./[id]/client";