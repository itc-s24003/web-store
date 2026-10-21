import { Prisma } from "@/libs/generated/prisma/client"





type Model_ProductUpdate = Partial<
    Prisma.ProductGroupGetPayload<{
        select: {
            name: true,
            showTop: true,

            imgId: true
        }
    }>
>



type Model_ProductGroup = Prisma.ProductGroupGetPayload<{
    select: {
        id: true,
        name: true,
        showTop: true,

        img: {
            select: {
                url: true
            }
        },
        langMaps: {
            select: {
                name: true,
                langId: true
            }
        },

        _count: {
            select: {
                products: {
                    where: {
                        stock: {
                            gt: 0
                        }
                    }
                }
            }
        }
    }
}>


type Model_ProductGroupDetail = Prisma.ProductGroupGetPayload<{
    select: {
        id: true,
        name: true,
        showTop: true,

        img: {
            select: {
                url: true
            }
        },
        
        products: {
            select: {
                id: true,
                name: true,
                description: true,
                price: true,
                showStockDetail: true,
                stock: true,

                img: {
                    select: {
                        url: true
                    }
                },
                label: {
                    select: {
                        body: true,
                        color: true
                    }
                },
                langMaps: {
                    select: {
                        name: true,
                        description: true,
                        langId: true
                    }
                }
            }
        }
    }
}>


export type models = {
    update: Model_ProductUpdate,
    model: Model_ProductGroup,
    detail: Model_ProductGroupDetail
}