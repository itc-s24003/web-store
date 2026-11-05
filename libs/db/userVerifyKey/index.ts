import { Prisma } from "@/libs/generated/prisma/client";
import { db } from "../db";


export async function verify(userId: string, key: string) {
    return db.userVerifyKey.findUnique({
        where: {
            user: {
                id: userId
            },
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

export async function verifyAndInfo(userId: string, key: string): Promise<VerifyInfo | null> {
    return db.userVerifyKey.findUnique({
        where: {
            user: {
                id: userId
            },
            key,
            expiresAt: {
                gte: new Date()
            }
        },
        select: {
            user: {
                select: {
                    isAdmin: true,
                    isStaff: true
                }
            }
        }
    })
}

export type VerifyInfo = Prisma.UserVerifyKeyGetPayload<{
    select: {
        user: {
            select: {
                isAdmin: true,
                isStaff: true
            }
        }
    }
}>


export * as email from "./email";

export type { models } from "./type";