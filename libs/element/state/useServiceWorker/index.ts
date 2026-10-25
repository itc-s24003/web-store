"use client";


import { ServiceWorkerData } from "@/libs/webPush";
import { useEffect, useState } from "react";

export function useServiceWorker() {
    const [dataQueue, setDataQueue] = useState<ServiceWorkerData[]>([]);
    
    useEffect(() => {
        navigator.serviceWorker.addEventListener("message", (ev) => {
            const data = ev.data as ServiceWorkerData;
            setDataQueue((prev) => [...prev, data]);
        })
    }, [])

    function clearQueue() {
        setDataQueue([]);
    }


    return {
        dataQueue,
        clearQueue
    }
}