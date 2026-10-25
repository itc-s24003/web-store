"use client";


import { useEffect, useState } from "react";
import { useAPI } from "../useAPI";
import { AppCrypto_Client } from "@/libs/crypto/client";
import { API_Client } from "@/app/api/app/client";

export function useWebPush(onChange: (hash: string | undefined) => void) {
    const [hash, setHash] = useState<string>();

    const { waiting, request } = useAPI(async () => {
        const N_perm = Notification.permission;
        if (N_perm !== "granted") return;
        
        const service = await navigator.serviceWorker.getRegistration("/");
        if (!service) return;

        await navigator.serviceWorker.ready;
        
        const pushsub = await service.pushManager.getSubscription();
        if (!pushsub) return;

        const authRaw = pushsub.getKey("auth");
        const p256dhRaw = pushsub.getKey("p256dh");

        if (!authRaw || !p256dhRaw) return;

        const endpoint = pushsub.endpoint;
        //参考
        //https://qiita.com/tomoyukilabs/items/217915676603fda73b0a#web%E3%82%A2%E3%83%97%E3%83%AA%E5%81%B4%E3%81%A7endpoint%E3%81%A8%E5%85%AC%E9%96%8B%E9%8D%B5%E3%82%92%E5%8F%96%E5%BE%97
        const auth = window.btoa(String.fromCharCode.apply(null, [...new Uint8Array(authRaw)])).replace(/\+/g, '-').replace(/\//g, '_');
        const p256dh = window.btoa(String.fromCharCode.apply(null, [...new Uint8Array(p256dhRaw)])).replace(/\+/g, '-').replace(/\//g, '_');

        const currentHash = await AppCrypto_Client.toHash(endpoint+auth+p256dh);
        setHash(currentHash);
    })

    useEffect(() => {
        request();
    }, [])

    
    
    
    const subscribe = useAPI(async () => {
        const N_perm = await Notification.requestPermission();
        if (N_perm !== "granted") return;

        const service = await navigator.serviceWorker.register("/sw.js", {
            scope: "/",
            updateViaCache: "none"
        });

        await navigator.serviceWorker.ready
        
        const pushsub = await service.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: AppCrypto_Client.urlBase64ToUint8Array(
                process.env.NEXT_PUBLIC_VAPID_PUBLIC!
            )
        });

        const authRaw = pushsub.getKey("auth");
        const p256dhRaw = pushsub.getKey("p256dh");

        if (!authRaw || !p256dhRaw) return;
        

        const endpoint = pushsub.endpoint;
        //参考
        //https://qiita.com/tomoyukilabs/items/217915676603fda73b0a#web%E3%82%A2%E3%83%97%E3%83%AA%E5%81%B4%E3%81%A7endpoint%E3%81%A8%E5%85%AC%E9%96%8B%E9%8D%B5%E3%82%92%E5%8F%96%E5%BE%97
        const auth = window.btoa(String.fromCharCode.apply(null, [...new Uint8Array(authRaw)])).replace(/\+/g, '-').replace(/\//g, '_');
        const p256dh = window.btoa(String.fromCharCode.apply(null, [...new Uint8Array(p256dhRaw)])).replace(/\+/g, '-').replace(/\//g, '_');

        const res = await API_Client.user.user.update(endpoint, auth, p256dh)
        if (res?.body.success) {
            const hash = await AppCrypto_Client.toHash(endpoint+auth+p256dh);
            setHash(hash);
            onChange(hash);
        }
    })
    

    const unsubscribe = useAPI(async () => {
        const service = await navigator.serviceWorker.getRegistration("/");
        if (!service) return setHash(undefined);

        await navigator.serviceWorker.ready;
        
        const pushsub = await service.pushManager.getSubscription();
        if (pushsub) {
            const res = await pushsub.unsubscribe();
            if (!res) return;
        }
        const res = await service.unregister();
        if (!res) return;
        setHash(undefined);
        onChange(undefined);
    })


    return {
        hash,
        waiting,
        subscribe,
        unsubscribe
    }

    

}