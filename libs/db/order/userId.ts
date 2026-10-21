import { db } from "../db";
import { models } from "./type";

export async function getQueue(userId: string, isReady?: boolean): Promise<models["orderMin"][]> {
    return db.order.findMany({
        where: {
            userId,
            isCanceled: false,
            isReceived: false,
            isReady
        },
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
    })
}