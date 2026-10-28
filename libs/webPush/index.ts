import { APP_ENV } from "@/app/env";
import webpush from "web-push";

webpush.setVapidDetails(
    `mailto:${APP_ENV.ADMIN_EMAIL}`,
    APP_ENV.NEXT_PUBLIC_VAPID_PUBLIC,
    APP_ENV.VAPID_PRIVATE
)






export function sendServiceWorkerData(endpoint: string, auth: string, p256dh: string, data: ServiceWorkerData[]) {
    return webpush.sendNotification(
        {
            endpoint,
            "keys": {
                auth,
                p256dh
            }
        },
        JSON.stringify(data)
    );
}




export type ServiceWorkerData = {
    type: "notification",
    data: {
        title: string,
        body: string,
        url: string
    }
} | {
    type: "update",
    data: {
        target: "cart" | "order" | "message"
    }
}


