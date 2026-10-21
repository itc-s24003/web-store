import { Prisma } from "@/libs/generated/prisma/client";

type Model_SystemVerifyKey = Prisma.SystemVerifyKeyGetPayload<{
    select: {
        id: true,
        expiresAt: true
    }
}>


export type models = {
    model: Model_SystemVerifyKey
}