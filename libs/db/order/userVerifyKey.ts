import { db } from "../db";
import { models } from "./type";

export async function get(key: string, hasReceived?: boolean): Promise<models["model"][] | null> {
    return db.userVerifyKey.findUnique({
        where: {
            key
        },
        select: {
            user: {
                select: {
                    orders: {
                        where: {
                            isReceived: hasReceived
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
                    }
                }
            }
        }
    }).then(res => res?.user.orders ?? null)
}