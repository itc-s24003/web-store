import { db } from "@/libs/db/db";

export async function get(email: string) {
    const now = new Date();
    
    const user = await db.user.findUnique({
        where: {
            email
        },
        select: {
            isAdmin: true,
            isStaff: true,
            lockTime: true
        }
    });

    return user ? {
        ...user,
        isLock: user.lockTime > now
    } : null
}


export async function getDetail(email: string, updateGet: boolean = false) {
    const now = new Date();
    
    const user = await db.user.findUnique({
        where: {
            email
        },
        select: {
            isAdmin: true,
            isStaff: true,
            lockTime: true,

            subscribe_endpoint: true,
            subscribe_authKey: true,
            subscribe_p256dh: true
        }
    });

    return user ? {
        ...user,
        isLock: user.lockTime > now
    } : null
}