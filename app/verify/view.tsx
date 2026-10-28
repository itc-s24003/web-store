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
import { QRCodeCanvas, QRCodeSVG } from "qrcode.react";



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
            const currentNow = Date.now();
            setNow(currentNow);
            if (key && currentNow < new Date(key.expiresAt).getTime()) {
                animationFrameId = requestAnimationFrame(updateNow);
            }
        }
        
        let animationFrameId = requestAnimationFrame(updateNow);

        return () => {
            cancelAnimationFrame(animationFrameId);
        }
    }, [key]);
    
    
    const timeLeft = key ? new Date(key.expiresAt).getTime() - now : 0;
    const remainingSeconds = Math.max(0, Math.floor(timeLeft / 1000));
    const remainingMinutes = Math.floor(remainingSeconds / 60);
    const displaySeconds = String(remainingSeconds % 60).padStart(2, "0");
    
    return (
        <AppView>
            <Header languages={[]} userLanguageId={null} title={""} />
            <ContentWrapper>
                <Content>
                    <div className="flex min-h-full items-center justify-center py-8">
                        {key ? (
                            <div className="flex w-full max-w-2xl flex-col items-center gap-5 px-6 py-8 text-center">
                                <div className="flex aspect-square w-full max-w-[27rem] items-center justify-center rounded-3xl bg-(--app-theme-text) p-6 shadow-lg shadow-black/10">
                                    <QRCodeSVG
                                        value={key.key}
                                        className="w-full h-full"
                                    />
                                </div>
                                <div className="rounded-full bg-(--app-theme-sub) px-4 py-2 text-sm font-medium tracking-wide text-(--app-theme-text)">
                                    有効期限: {remainingMinutes}:{displaySeconds}
                                </div>
                                <button
                                    type="button"
                                    onClick={() => get.request()}
                                    disabled={get.waiting}
                                    className="rounded-full bg-(--primary) px-5 py-2 text-sm font-semibold text-(--background) transition-opacity hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {get.waiting ? "取得中..." : "QRを再取得"}
                                </button>
                            </div>
                        ) : (
                            <div className="flex w-full max-w-sm flex-col items-center gap-5 rounded-3xl bg-(--container-background) px-6 py-10 text-center shadow-lg shadow-black/10">
                                <div className="text-lg font-semibold text-(--text-color-sub)">
                                    認証キーがありません
                                </div>
                                <button
                                    type="button"
                                    onClick={() => get.request()}
                                    disabled={get.waiting}
                                    className="rounded-full bg-(--primary) px-5 py-2 text-sm font-semibold text-(--background) transition-opacity hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {get.waiting ? "取得中..." : "QRを再取得"}
                                </button>
                            </div>
                        )}
                    </div>
                </Content>
                <Navigation />
            </ContentWrapper>
        </AppView>
    )
}