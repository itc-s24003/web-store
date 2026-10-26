import { Prisma } from "@/libs/generated/prisma/client";

type Model_LanguageUpdate = Partial<
    Prisma.LanguageGetPayload<{
        select: {
            name: true
        }
    }>
>


type Model_Language = Prisma.LanguageGetPayload<{
    select: {
        id: true,
        name: true
    }
}>


export type models = {
    update: Model_LanguageUpdate,
    model: Model_Language
}