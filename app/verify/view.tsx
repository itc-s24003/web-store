"use client"


import { AppView } from "@/libs/element/layout";
import { useAPI } from "@/libs/element/state/useAPI";
import { API_Client } from "../api/app/client";
import { AppDB_Types } from "@/libs/db";
import { useEffect, useState } from "react";
import { Header } from "@/libs/element/layout/header";
import { ContentWrapper } from "@/libs/element/layout/contentWrapper";
import { Content } from "@/libs/element/layout/content";
import { Navigation } from "@/libs/element/layout/navigation";
import { QRCodeCanvas } from "qrcode.react";



type PageView_Props = {
    store: AppDB_Types["store"]["model"],
    languages: AppDB_Types["language"]["model"][]
}


export function PageView({ store, languages }: PageView_Props) {
    const [key, setKey] = useState<AppDB_Types["userVerifyKey"]["model"] | null>(null);
    
    const get = useAPI(async () => {
        const res = await API_Client.user.userVerifyKey.get();
        if (res?.body.success) {
            setKey(res.body.data);
        } else {
            setKey(null);
        }
    })

    useEffect(() => {
        get.request();
    }, [])
    
    
    
    const [now, setNow] = useState<number>(() => Date.now());

    useEffect(() => {
        function updateNow() {
            setNow(Date.now());
            animationFrameId = requestAnimationFrame(updateNow);
        }
        
        let animationFrameId = requestAnimationFrame(updateNow);

        return () => {
            cancelAnimationFrame(animationFrameId);
        }
    }, [key]);
    
    
    const timeLeft = key ? new Date(key.expiresAt).getTime() - now : 0;
    
    return (
        <AppView>
            <Header languages={[]} userLanguageId={null} title={""} />
            <ContentWrapper>
                <Content>
                    <div>
                        {key ? (
                            <div>
                                <QRCodeCanvas value={key.key} />
                                <div>有効期限: {timeLeft/1000}</div>
                            </div>
                        ) : (
                            <div>認証キーがありません</div>
                        )}
                    </div>
                </Content>
                <Navigation />
            </ContentWrapper>
        </AppView>
    )
}