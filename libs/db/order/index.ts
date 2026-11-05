import { db } from "../db";
import { models } from "./type";

export async function getAll(): Promise<models["model"][]> {
    return db.order.findMany({
        where: {
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
                            stock: true,
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



export async function getQueue(startId?: string): Promise<models["orderMin"][]> {
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
            id: true,
            isCanceled: true,
            isReceived: true,
            isReady: true,
            user: {
                select: {
                    subscribe_endpoint: true,
                    subscribe_authKey: true,
                    subscribe_p256dh: true
                }
            }
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



export async function updates(targets: string[], data: models["update"]) {
    db.$transaction(async tx => {
        for (const id of targets) {
            await tx.order.update({
                where: {
                    id
                },
                data,
                select: {
                    id: true
                }
            })
        }
    }, {
        timeout: 1000 * 30
    })
}




export * as email from "./email";
export * as userId from "./userId";
export * as userVerifyKey from "./userVerifyKey";

export type { models } from "./type";