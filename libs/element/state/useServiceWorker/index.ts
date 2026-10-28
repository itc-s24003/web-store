"use client";


import { ServiceWorkerData } from "@/libs/webPush";
import { useEffect, useState } from "react";

export function useServiceWorker() {
    const [dataQueue, setDataQueue] = useState<ServiceWorkerData[]>([]);
    
    useEffect(() => {
        function onServiceWorkerMessage(ev: MessageEvent) {
            const data = ev.data as ServiceWorkerData;
            setDataQueue((prev) => [...prev, data]);
        }

        navigator.serviceWorker.addEventListener("message", onServiceWorkerMessage);

        return () => {
            navigator.serviceWorker.removeEventListener("message", onServiceWorkerMessage);
        }
    }, [])

    function clearQueue() {
        setDataQueue([]);
    }


    return {
        dataQueue,
        clearQueue
    }
}