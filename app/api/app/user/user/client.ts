"use client"

import { api_client_req } from "../../client";
import { AppAPI_user_User_Map } from "./route";

export function get() {
    return api_client_req<AppAPI_user_User_Map, "GET">("/api/app/user/user", "GET", undefined, undefined)
}

export function update(subscribe_endpoint: string, subscribe_authKey: string, subscribe_p256dh: string) {
    return api_client_req<AppAPI_user_User_Map, "PATCH">(
        "/api/app/user/user",
        "PATCH",
        undefined,
        {
            subscribe_endpoint,
            subscribe_authKey,
            subscribe_p256dh
        }
    )
}