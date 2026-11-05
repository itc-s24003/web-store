"use client"


import { SocketEventMap } from "@/libs/webPush";
import { useEffect, useState } from "react";
import IO, { Socket } from "socket.io-client";




type SocketVerifyData = {
    serviceKey?: string,
    userId?: string,
    userVerifyKey?: string
}

export function useSocket(onData: SocketEventMap["data"], key?: string, userId?: string) {
    const [socket, setSocket] = useState<Socket<SocketEventMap>>();
    const [verified, setVerified] = useState<boolean>();
    
    useEffect(() => {
        const server = process.env.NEXT_PUBLIC_SOCKET_SERVER;
        if (!server) return;
        if (!key) return;
        const url = new URL(server);
        url.searchParams.set("key", key);
        if (userId) url.searchParams.set("userId", userId);

        const newSocket: Socket<SocketEventMap> = IO(url.toString(), {
            reconnection: false,
            timeout: 1000*10
        });
        newSocket.on("connect", () => setSocket(newSocket));
        newSocket.on("connect_error", () => {
            setSocket(undefined);
            setVerified(false);
        })
        newSocket.on("verified", () => setVerified(true));
        newSocket.on("disconnect", () => {
            setSocket(undefined);
            setVerified(false);
        });

        return () => {
            newSocket.removeAllListeners();
            newSocket.disconnect();
            setSocket(undefined);
            setVerified(false);
        }
    }, [key, userId])


    useEffect(() => {
        socket?.on("data", onData);
        return () => {
            socket?.removeListener("data", onData);
        }
    }, [socket, onData])

    
    
    return {
        isConnected: socket?.connected,
        isVerified: verified
    }
}