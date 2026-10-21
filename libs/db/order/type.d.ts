import { Prisma } from "@/libs/generated/prisma/client";



type Model_OrderUpdate = Partial<
    Prisma.OrderGetPayload<{
        select: {
            isCanceled: true,
            isReceived: true,
            isReady: true
        }
    }>
>


type Model_Order = Prisma.OrderGetPayload<{
    select: {
        id: true,
        index: true,
        isCanceled: true,
        isReceived: true,
        isReady: true,
        _count: {
            select: {
                cartItems: true
            }
        }
    }
}>

type Model_OrderMin = Prisma.OrderGetPayload<{
    select: {
        id: true,
        index: true,
        isCanceled: true,
        isReceived: true,
        isReady: true,
        cartItems: {
            select: {
                id: true,
                count: true,
                product: {
                    select: {
                        name: true,
                        price: true,
                        langMaps: {
                            select: {
                                langId: true,
                                name: true
                            }
                        }
                    }
                }
            }
        }
    }
}>



export type models = {
    update: Model_OrderUpdate,
    model: Model_Order,
    orderMin: Model_OrderMin
}