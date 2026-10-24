"use client"


import { AppView } from "@/libs/element/layout";
import { Content } from "@/libs/element/layout/content";
import { ContentWrapper } from "@/libs/element/layout/contentWrapper";
import { Header } from "@/libs/element/layout/header";
import { Navigation } from "@/libs/element/layout/navigation";

export function PageView() {
    return (
        <AppView>
            <Header title={"オンラインストア"} toast={3}/>
            <ContentWrapper>
                <Content>
                    hello test
                </Content>
                <Navigation />
            </ContentWrapper>
        </AppView>
    )
}