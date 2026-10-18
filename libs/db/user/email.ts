import { AppCrypto } from "@/libs/crypto/crypto";
import { db } from "../db";
import { userModels } from ".";

export async function login(emailRaw: string) {
    const email = AppCrypto.encrypt(emailRaw);
    
    
    return db.user.upsert({
        where: {
            email
        },
        update: {},
        create: {
            email
        },
        select: {
            id: true
        }
    }).then(u => u ? true : false);
}



export async function get(email: string): Promise<userModels["model"] | null> {
    return db.user.findUnique({
        where: {
            email
        },
        select: {
            id: true,
            langId: true,
            subscribe_hash: true
        }
    })
}


export async function getDetailMin(email: string): Promise<userModels["detailMin"] | null> {
    return db.user.findUnique({
        where: {
            email
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