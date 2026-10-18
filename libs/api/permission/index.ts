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