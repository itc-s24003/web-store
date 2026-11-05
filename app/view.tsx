"use client"


import { AppDB_Types } from "@/libs/db";
import { Carousel } from "@/libs/element/carousel";
import { Display_ProductGroup } from "@/libs/element/display/productGroup";
import { AppView } from "@/libs/element/layout";
import { Content } from "@/libs/element/layout/content";
import { ContentWrapper } from "@/libs/element/layout/contentWrapper";
import { Header } from "@/libs/element/layout/header";
import { Navigation } from "@/libs/element/layout/navigation";
import { useAPI_UserDetailMin } from "@/libs/element/state/appAPI/userAPI_UserDetailMin";
import { useServiceWorker } from "@/libs/element/state/useServiceWorker";
import { useWebPush } from "@/libs/element/state/useWebPush";
import Image from "next/image";
import Link from "next/link";


type PageView_Props = {
    store: AppDB_Types["store"]["model"],
    languages: AppDB_Types["language"]["model"][],
    productGroups: AppDB_Types["productGroup"]["deisplay"][],
}

export function PageView({ store, languages, productGroups }: PageView_Props) {
    // const serviceWorker = useServiceWorker();
    const user = useAPI_UserDetailMin();
    // const webpush = useWebPush(() => {
    //     user.request()
    // })

    // if (!user.waiting && !webpush.waiting && user.user?.subscribe_hash && webpush.hash && webpush.hash !== user.user.subscribe_hash) {
    //     webpush.unsubscribe.request();
    // }
    
    
    
    return (
        <AppView>
            <Header
                languages={languages}
                userLanguageId={user.user?.langId ?? null}
                title={store.name}
                toast={user.user?._count.messages}
            />
            <ContentWrapper>
                <Content>
                    {/* <div className="whitespace-pre-wrap text-sm">
                        {
                            JSON.stringify(user.user, null, 2)
                        }
                    </div> */}
                    <div className="flex flex-col gap-2 py-2 sm:flex-row sm:flex-wrap items-center sm:justify-center">
                        {
                            productGroups.map((pg) => (
                                <Link key={pg.id} href={`/productGroup/${pg.id}`} className="w-full sm:size-fit flex justify-center">
                                    <Display_ProductGroup imgSrc={pg.img?.url} name={pg.name} className="flex-1">
                                        {pg._count.products} 商品
                                        <div className="flex gap-1 mt-1 max-w-25">
                                            <Carousel imgSrcs={pg.products.map(p => p.img?.url).filter(u => u !== undefined)} />
                                        </div>
                                    </Display_ProductGroup>
                                </Link>
                            ))
                        }
                    </div>
                </Content>
                <Navigation />
            </ContentWrapper>
        </AppView>
    )
}