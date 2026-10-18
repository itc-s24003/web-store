import { db } from "../db";
import { userModels } from "./type";


export async function get(id: string): Promise<userModels["model"] | null> {
    return db.user.findUnique({
        where: {
            id
        },
        select: {
            id: true,
            langId: true,
            subscribe_hash: true
        }
    })
}





export async function getDetailMin(id: string): Promise<userModels["detailMin"] | null> {
    return db.user.findUnique({
        where: {
            id
        },
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
    })
}






export * as email from "./email";

export type { userModels } from "./type"