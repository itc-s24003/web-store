import { api_client_req } from "../../client";
import type { AppAPI_user_Order_Map } from "./route";

export function getAll() {
    return api_client_req<AppAPI_user_Order_Map, "GET">(
        "/api/app/user/order",
        "GET",
        undefined,
        undefined
    );
}

export function add(cartItemIds: string[]) {
    return api_client_req<AppAPI_user_Order_Map, "POST">(
        "/api/app/user/order",
        "POST",
        undefined,
        { cartItemIds },
    );
}


export * from "./[id]/client"