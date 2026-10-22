"use client"


import { useState } from "react"

export function useAPI<Params extends unknown[]>(
    apiCall: (...params: Params) => Promise<void>,
    blocking: boolean = true
) {
    const [waiting, setApiWait] = useState(false);
    
    async function request(...params: Params) {
        if (blocking && waiting) return false;
        setApiWait(true);
        const res = await apiCall(...params).then(() => true).catch(() => null)
        setApiWait(false);
        return res;

    }


    return {
        waiting,
        request
    }
}

