import { db } from "../db";
import { models } from "./type";


export async function getQueue(startId?: string): Promise<models["model"][]> {
    return db.order.findMany({
        where: {
            id: {
                gt: startId
            },
            isCanceled: false,
            isReceived: false
        },
        orderBy: {
            requestedAt: "asc"
        },
        select: {
        id: true,
        index: true,
        isCanceled: true,
        isReceived: true,
        isReady: true,
        requestedAt: true,
        cartItems: {
            select: {
                id: true,
                count: true,
                product: {
                    select: {
                        id: true,
                        name: true,
                        price: true,
                        img: {
                            select: {
                                url: true
                            }
                        },
                        langMaps: {
                            select: {
                                name: true,
                                langId: true
                            }
                        }
                    }
                }
            }
        },
        _count: {
            select: {
                cartItems: true
            }
        }
        }
    })
}

export async function update(id: string, data: models["update"]) {
    return db.order.update({
        where: {
            id
        },
        data,
        select: {
            isCanceled: true,
            isReceived: true,
            isReady: true
        }
    })
}


export async function cancel(id: string) {
    return db.order.update({
        where: {
            id,
            isCanceled: false,
            isReceived: false,
            isReady: false
        },
        data: {
            isCanceled: true
        },
        select: {
            isCanceled: true
        }
    })
}



export * as email from "./email";
export * as userId from "./userId";
export * as userVerifyKey from "./userVerifyKey";

export type { models } from "./type";