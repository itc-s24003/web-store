import { useState } from "react";
import { useAPI } from "../useAPI";
import { API_Client } from "@/app/api/app/client";

export function useLanguage() {
    const [langId, setLangId] = useState<string | null>(() => {
        return window.localStorage.getItem("langId");
    });

    useAPI(async () => {
        API_Client.user.user.update
    })


    return {
        langId,
        setLangId: (id: string) => {
            window.localStorage.setItem("langId", id);
            setLangId(id);
        }
    }
}