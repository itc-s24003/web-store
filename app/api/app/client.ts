import { HTTP_METHOD } from "next/dist/server/web/http";
import { app_api_doc, app_api_map } from "./api";

export async function api_client_req<
    api_map extends app_api_map,
    type extends keyof app_api_map & HTTP_METHOD,
    params = api_map[type] extends app_api_doc ? api_map[type]["req"]["params"] : undefined,
    body = api_map[type] extends app_api_doc ? api_map[type]["req"]["body"] : undefined,
    response = api_map[type] extends app_api_doc ? api_map[type]["res"] : undefined,
>(path: string, method: type, params: params, body: body): Promise<{ status: number, body: response } | undefined> {
    const url = new URL(path, window.location.origin);
    const p = url.searchParams;

    if (params) Object.entries(params).forEach(([key, value]) => {
        p.set(key, String(value))
    });

    const data = body instanceof FormData ? body : JSON.stringify(body);

    return await fetch(url, { method: method as string, body: data }).then(async res => {
        try {
            return {
                status: res.status,
                body: await res.json() as response
            }
            
        } catch {
            return;

        }
    }).catch(() => undefined);
}








import { API_Client_Staff } from "./staff";
import { API_Client_User } from "./user";

export const API_Client = {
    staff: API_Client_Staff,
    user: API_Client_User
}

