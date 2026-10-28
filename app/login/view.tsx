"use client"


import { AppDB_Types } from "@/libs/db";
import { Button } from "@/libs/element/button";
import { AppView } from "@/libs/element/layout";
import { Content } from "@/libs/element/layout/content";
import { ContentWrapper } from "@/libs/element/layout/contentWrapper";
import { Header } from "@/libs/element/layout/header";
import { Navigation } from "@/libs/element/layout/navigation";
import { signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

type PageView_Props = {
    store: AppDB_Types["store"]["model"],
    languages: AppDB_Types["language"]["model"][]
}

export function PageView({ store, languages }: PageView_Props) {
    return (
        <AppView>
            <Header languages={languages} userLanguageId={""} title={store.name} />
            <ContentWrapper>
                <Content>
                    <div className="flex flex-col gap-2 max-w-lg mx-auto p-4">
                        <Image src={"/logo_512.png"} alt={""} width={512} height={512} className="aspect-sqare w-full rounded-xl" />
                        <Button className="w-full p-4 bg-(--container-background) rounded-md" onClick={() => signIn("google", { callbackUrl: "/tutorial" })}>
                            ログイン
                        </Button>
                        <Link href={"/tutorial"} className="w-full p-4 bg-(--container-background) rounded-md text-center">
                            使い方
                        </Link>
                    </div>
                </Content>
                <Navigation />
            </ContentWrapper>
        </AppView>
    )
}