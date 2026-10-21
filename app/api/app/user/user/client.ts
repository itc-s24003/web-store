"use client"

import { api_client_req } from "../../client";
import { AppAPI_user_User_Map } from "./route";

export function get() {
    return api_client_req<AppAPI_user_User_Map, "GET">("/api/app/user/user", "GET", undefined, undefined)
}