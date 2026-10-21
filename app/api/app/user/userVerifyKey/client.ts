"use client"

import { api_client_req } from "../../client";
import { AppAPI_user_UserVerifyKey_Map } from "./route";

export function get() {
    return api_client_req<AppAPI_user_UserVerifyKey_Map, "GET">(
        "/api/app/user/userVerifyKey",
        "GET",
        undefined,
        undefined
    );
}