import { Prisma } from "@/libs/generated/prisma/client";



type Model_UserUpdate = Partial<
    Prisma.UserGetPayload<{
        select: {
            isAdmin: true,
            isStaff: true,
            lockTime: true,

            subscribe_endpoint: true,
            subscribe_authKey: true,
            subscribe_p256dh: true,
            subscribe_hash: true
        }
    }>
>


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





type Model_UserDetail = Prisma.UserGetPayload<{
    select: {
        id: true,
        
        orders: {
            select: {
                id: true,
                index: true,

                isCanceled: true,
                isReady: true,
                isReceived: true,

                cartItems: {
                    select: {
                        id: true,
                        product: {
                            select: {
                                id: true,
                                name: true,
                                price: true,
                                img: {
                                    select: {
                                        url: true
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}>


type Model_UserDetailFull = Prisma.UserGetPayload<{
    include: {
        cartItems: {
            include: {
                product: {
                    include: {
                        img: true
                    }
                }
            }
        },
        orders: {
            include: {
                cartItems: {
                    include: {
                        product: {
                            include: {
                                img: true
                            }
                        }
                    }
                }
            }
        }
    }
}>



export type models = {
    update: Model_UserUpdate,
    model: Model_User,
    detailMin: Model_UserDetailMin,
    detail: Model_UserDetail,
    detailFull: Model_UserDetailFull
}


