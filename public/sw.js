/// <reference lib="WebWorker"/>

/**@type { ServiceWorkerGlobalScope } */
const sw = self;


sw.addEventListener("push", async (ev) => {
    /**@type {import("../libs/webPush").ServiceWorkerData[]}  */
    const dataList = ev.data.json();
    console.log("push", dataList);

    const clients = await sw.clients.matchAll({
        type: "window"
    });
    clients.forEach(client => {
        dataList.forEach(data => client.postMessage(data)); 
    });

    
    dataList.forEach(({type, data}) => {
        if (type === "notification") {
            sw.registration.showNotification(data.title, {
                body: data.body,
                icon: "/logo_192.png",
                badge: "/logo_192.png",
                data: data.url
            });
        }
    });
})


sw.addEventListener("notificationclick", (ev) => {
    // サービスワーカーに登録されたサイトのURLを取得
    const registeredSiteUrl = sw.registration.scope;

    const url = new URL(registeredSiteUrl);
    url.pathname = ev.notification.data
    
    ev.notification.close();
    sw.clients.openWindow(url)
})