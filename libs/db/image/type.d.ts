import { Prisma } from "@/libs/generated/prisma/client";

type Model_Image = Prisma.ImageGetPayload<{
    select: {
        id: true,
        url: true
    }
}>

export type models = {
    model: Model_Image
}