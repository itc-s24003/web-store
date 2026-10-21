import { APP_ENV } from "@/app/env";
import { db } from "../db";
import { models } from "./type";

export async function verify(id: string) {
    return db.serviceKey.findUnique({
        where: {
            id,
            expiresAt: {
                gte: new Date()
            }
        },
        select: {
            id: true
        }
    }).then(res => res ? true : false)
}


export async function getAll(): Promise<models["detail"][]> {
    return db.serviceKey.findMany({
        orderBy: {
            createdAt: "asc"
        },
        select: {
            id: true,
            name: true,
            expiresAt: true,
            createdAt: true
        }
    })
}


export async function add(name: string): Promise<models["detail"]> {
    const expiresAt = new Date()
    expiresAt.setSeconds(expiresAt.getSeconds() + APP_ENV.VERIFYKEY_LIFE_SERVICE)
    
    return db.serviceKey.create({
        data: {
            name,
            expiresAt
        },
        select: {
            id: true,
            name: true,
            expiresAt: true,
            createdAt: true
        }
    })
}

export async function remove(id: string) {
    return db.serviceKey.delete({
        where: {
            id
        },
        select: {
            id: true
        }
    })
    
}




export type { models } from "./type"