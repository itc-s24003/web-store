import { Prisma } from "@/libs/generated/prisma/client"

type Model_CartItemUpdate = Partial<
    Prisma.CartItemGetPayload<{
        select: {
            count: true
        }
    }>
>


type Model_CartItem = Prisma.CartItemGetPayload<{
    select: {
        id: true,
        product: {
            select: {
                id: true,
                name: true,
                description: true,

                img: {
                    select: {
                        url: true
                    }
                },
                label: {
                    select: {
                        body: true,
                        color: true
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
        }
    }
}>




export type models = {
    update: Model_CartItemUpdate,
    model: Model_CartItem
}