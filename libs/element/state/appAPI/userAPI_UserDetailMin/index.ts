import { API_Client } from "@/app/api/app/client";
import { AppDB_Types } from "@/libs/db";
import { useState } from "react";
import { useAPI } from "../../useAPI";

export function useAPI_UserDetailMin() {
    const [user, setUser] = useState<AppDB_Types["user"]["detailMin"]>()
    const { waiting, request } = useAPI(async () => {
        const res = await API_Client.user.user.get();
        if (res?.body.success) setUser(res.body.data);
    })

    return {
        user,
        waiting,
        request
    }
}