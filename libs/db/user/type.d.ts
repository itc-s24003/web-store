import { Prisma } from "@/libs/generated/prisma/client";



type Model_User = Prisma.UserGetPayload<{
    select: {
        id: true,
        langId: true,
        subscribe_hash: true
    }
}>


type Model_UserDetailMin = Prisma.UserGetPayload<{
    select: {
        id: true,
        langId: true,
        subscribe_hash: true,
        
        _count: {
            select: {
                cartItems: {
                    where: {
                        orderId: null
                    }
                },
                orders: {
                    where: {
                        isCanceled: false,
                        isReceived: false,
                        isReady: true
                    }
                },
                messages: {
                    where: {
                        isRead: false
                    }
                }
            }
        }
    }
}>

export type userModels = {
    model: Model_User,
    detailMin: Model_UserDetailMin
}


