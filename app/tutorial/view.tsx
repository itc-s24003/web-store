import { AppDB_Types } from "@/libs/db";
import { AppView } from "@/libs/element/layout";
import { Content } from "@/libs/element/layout/content";
import { ContentWrapper } from "@/libs/element/layout/contentWrapper";
import { Header } from "@/libs/element/layout/header";
import { Navigation } from "@/libs/element/layout/navigation";

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

                </Content>
                <Navigation />
            </ContentWrapper>
        </AppView>
    )
}