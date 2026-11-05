"use client";


import { AppDB_Types } from "@/libs/db";
import { Button } from "@/libs/element/button";
import { AppView } from "@/libs/element/layout";
import { Content } from "@/libs/element/layout/content";
import { ContentWrapper } from "@/libs/element/layout/contentWrapper";
import { Header } from "@/libs/element/layout/header";
import { Navigation } from "@/libs/element/layout/navigation";
import { useAPI_UserDetailMin } from "@/libs/element/state/appAPI/userAPI_UserDetailMin";
import { useLanguage } from "@/libs/element/state/useLanguage";
import { signOut } from "next-auth/react";
import Link from "next/link";

type PageView_Props = {
    store: AppDB_Types["store"]["model"],
    languages: AppDB_Types["language"]["model"][]
}

export function PageView({ store, languages }: PageView_Props) {
    
    const userLang = useLanguage();
    const user = useAPI_UserDetailMin();
    if (user.user?.langId && user.user.langId !== userLang.langId) userLang.setLangId(user.user.langId);
    
    return (
        <AppView>
            <Header languages={languages} userLanguageId={userLang.langId} title={store.name}
                onLanguageChange={(lng) => {
                    if (lng) userLang.setLangId(lng)
                }}
            />
            <ContentWrapper>
                <Content>
                    <Button
                        className="w-full p-4 bg-(--container-background) rounded-md"
                        onClick={() => {
                            signOut({ callbackUrl: "/login" })
                        }}
                    >
                        ログアウト
                    </Button>
                    <Link href="/how-to-use">
                        使い方
                    </Link>
                    <Link href="/privacy">
                        プライバシーポリシー
                    </Link>
                    <Link href="/terms">
                        利用規約
                    </Link>
                </Content>
                <Navigation />
            </ContentWrapper>
        </AppView>
    )
}


