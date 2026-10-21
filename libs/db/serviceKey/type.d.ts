import { Prisma } from "@/libs/generated/prisma/client";

type Model_ServiceKey = Prisma.ServiceKeyGetPayload<{
    select: {
        id: true,
        expiresAt: true
    }
}>


type Model_ServiceKeyDetail = Prisma.ServiceKeyGetPayload<{
    select: {
        id: true,
        name: true,
        expiresAt: true,
        createdAt: true
    }
}>


export type models = {
    model: Model_ServiceKey,
    detail: Model_ServiceKeyDetail
}