import { APP_ENV } from "@/app/env";
import { db } from "../db";
import { models } from "./type";

export async function add(): Promise<models["model"]> {
    const expiresAt = new Date();
    expiresAt.setSeconds(expiresAt.getSeconds() + APP_ENV.VERIFYKEY_LIFE_SYSTEM);
    
    return db.systemVerifyKey.create({
        data: {
            expiresAt
        },
        select: {
            id: true,
            expiresAt: true
        }
    })
}


export async function verify(id: string) {
    return db.systemVerifyKey.delete({
        where: {
            id,
            expiresAt: {
                gte: new Date()
            }
        },
        select: {
            id: true
        }
    }).then(() => true)
}



export type { models } from "./type"