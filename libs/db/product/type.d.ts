import { Prisma } from "@/libs/generated/prisma/client";


type Model_ProductUpdate = Partial<
    Prisma.ProductGetPayload<{
        select: {
            groupId: true,
            name: true,
            description: true,
            price: true,
            showStockDetail: true,
            stock: true,

            imgId: true,
            labelId: true
        }
    }>
>



type Model_Product = Prisma.ProductGetPayload<{
    select: {
        id: true,
        name: true,
        description: true,
        price: true,

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
}>


type Model_ProductDetail = Prisma.ProductGetPayload<{
    select: {
        id: true,
        groupId: true,
        name: true,
        description: true,
        price: true,
        
        img: true,
        label: true,
        langMaps: {
            select: {
                id: true,
                name: true,
                description: true,
                langId: true
            }
        }
    }
}>


type Model_ProductEdit = Prisma.ProductGetPayload<{
    select: {
        id: true,
        groupId: true,
        name: true,
        description: true,
        price: true,
        showStockDetail: true,
        stock: true,

        img: {
            select: {
                id: true,
                url: true
            }
        },
        
        langMaps: {
            select: {
                id: true,
                name: true,
                description: true,
                langId: true
            }
        }
    }
}>



export type models = {
    update: Model_ProductUpdate,
    model: Model_Product,
    detail: Model_ProductDetail,
    edit: Model_ProductEdit
}