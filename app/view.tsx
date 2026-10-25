"use client"


import { AppView } from "@/libs/element/layout";
import { Content } from "@/libs/element/layout/content";
import { ContentWrapper } from "@/libs/element/layout/contentWrapper";
import { Header } from "@/libs/element/layout/header";
import { Navigation } from "@/libs/element/layout/navigation";
import { useAPI_UserDetailMin } from "@/libs/element/state/appAPI/userAPI_UserDetailMin";
import { useServiceWorker } from "@/libs/element/state/useServiceWorker";
import { useWebPush } from "@/libs/element/state/useWebPush";

export function PageView() {
    const serviceWorker = useServiceWorker();
    const user = useAPI_UserDetailMin();
    const webpush = useWebPush((hash) => {
        user.request()
    })

    if (!user.waiting && !webpush.waiting && user.user?.subscribe_hash && webpush.hash && webpush.hash !== user.user.subscribe_hash) {
        webpush.unsubscribe.request();
    }
    
    
    
    return (
        <AppView>
            <Header title={"オンラインストア"} toast={3}/>
            <ContentWrapper>
                <Content>
                    <div className="whitespace-pre-wrap text-sm">
                        {
                            JSON.stringify(serviceWorker.dataQueue, null, 2)
                        }
                    </div>
                    <div className="whitespace-pre-wrap text-sm">
                        {
                            JSON.stringify(user.user, null, 2)
                        }
                    </div>
                    <p>
                        {webpush.hash}
                    </p>
                    <button onClick={() => webpush.subscribe.request()}>
                        通知許可
                    </button>
                </Content>
                <Navigation />
            </ContentWrapper>
        </AppView>
    )
}