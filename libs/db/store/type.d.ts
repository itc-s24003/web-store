import { Prisma } from "@/libs/generated/prisma/client";

type Model_StoreUpdate = Partial<
    Prisma.StoreGetPayload<{
        select: {
            name: true,
            description: true,
            imgId: true,
            tutorialId: true,
            readyMessageId: true
        }
    }>
>

type Model_Store = Prisma.StoreGetPayload<{
    select: {
        name: true,
        description: true,
        img: {
            select: {
                url: true
            }
        },
        langMaps: {
            select: {
                name: true,
                description: true,
                langId: true
            }
        }
    }
}>



export type models = {
    update: Model_StoreUpdate,
    model: Model_Store
}