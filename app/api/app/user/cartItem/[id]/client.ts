import { api_client_req } from "@/app/api/app/client";
import type { AppAPI_user_CartItem__id__Map } from "./route";




export async function update(id: string, body: AppAPI_user_CartItem__id__Map["PATCH"]["req"]["body"]) {
    return await api_client_req<AppAPI_user_CartItem__id__Map, "PATCH">(
        `/api/app/user/cartItem/${encodeURIComponent(id)}`,
        "PATCH",
        undefined,
        body
    );
}


export async function remove(id: string) {
    return await api_client_req<AppAPI_user_CartItem__id__Map, "DELETE">(
        `/api/app/user/cartItem/${encodeURIComponent(id)}`,
        "DELETE",
        undefined,
        undefined
    );
}