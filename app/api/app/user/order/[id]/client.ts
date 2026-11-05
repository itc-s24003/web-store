import { api_client_req } from "../../../client";
import { AppAPI_user_Order__id__Map } from "./route";

export function cancel(id: string) {
    return api_client_req<AppAPI_user_Order__id__Map, "DELETE">(
        `/api/app/user/order/${id}`,
        "DELETE",
        undefined,
        undefined
    );
}