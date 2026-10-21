import { Prisma } from "@/libs/generated/prisma/client";

type Model_UserVerifyKey = Prisma.UserVerifyKeyGetPayload<{
    select: {
        key: true,
        expiresAt: true
    }
}>



export type models = {
    model: Model_UserVerifyKey
}