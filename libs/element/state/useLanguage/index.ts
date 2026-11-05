"use client";


import { useEffect, useState } from "react";
import { useAPI } from "../useAPI";
import { API_Client } from "@/app/api/app/client";

export function useLanguage() {
    const [langId, setLangId] = useState<string | null>(() => {
        return typeof window !== "undefined" ? window.localStorage.getItem("langId") : null;
    });

    useAPI(async () => {
    })


    return {
        langId,
        setLangId: (id: string) => {
            window.localStorage.setItem("langId", id);
            setLangId(id);
        }
    }
}