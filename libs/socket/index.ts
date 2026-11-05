import { AppDB } from "../db";
import { ServiceData } from "../webPush";

export async function sendSocketData(data: ServiceData) {
    const key = await AppDB.systemVerifyKey.add();
    
    const server = process.env.NEXT_PUBLIC_SOCKET_SERVER;
    if (!server) return;
    const url = new URL(server);
    url.pathname = "/send"
    url.searchParams.set("key", key.id);

    await fetch(url.toString(), {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
}