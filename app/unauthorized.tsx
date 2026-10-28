import { AppView } from "@/libs/element/layout";
import { Content } from "@/libs/element/layout/content";
import { ContentWrapper } from "@/libs/element/layout/contentWrapper";
import { Navigation } from "@/libs/element/layout/navigation";
import Link from "next/link";

export default function PageView() {
    return (
        <AppView>
            <ContentWrapper>
                <Content>
                    <h1 className="text-2xl font-bold">Unauthorized</h1>
                    <p>ログインしていないためアクセスできません</p>
                    <p className="text-sm text-muted-foreground">
                        ログインしてから再度お試しください。
                    </p>
                    <Link href="/login" className="text-sm text-primary underline">
                        ログインページへ
                    </Link>
                </Content>
                <Navigation />
            </ContentWrapper>
        </AppView>
    )
}