import { APP_ENV } from "@/app/env";
import { db } from "../db";
import { models } from "./type";

export async function get(email: string): Promise<models["model"]> {
    const expiresAt = new Date();
    expiresAt.setSeconds(expiresAt.getSeconds() + APP_ENV.VERIFYKEY_LIFE_USER)
    
    return db.userVerifyKey.upsert({
        where: {
            userEmail: email
        },
        update: {
            key: crypto.randomUUID()
        },
        create: {
            userEmail: email,
            expiresAt
        },
        select: {
            key: true,
            expiresAt: true
        }
    })
}



export async function verify(email: string, key: string) {
    return db.userVerifyKey.findUnique({
        where: {
            userEmail: email,
            key,
            expiresAt: {
                gte: new Date()
            }
        },
        select: {
            id: true
        }
    }).then(res => res ? true : false)
}