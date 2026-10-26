import { db } from "../db";
import { models } from "./type";



export async function getTop(): Promise<models["model"][]> {
    return db.product.findMany({
        select: {
            id: true,
            groupId: true,
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
    })
}

export async function add(groupId: string, name: string, description: string, price: number): Promise<models["edit"]> {
    return db.product.create({
        data: {
            groupId,
            name,
            description,
            price
        },
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
    })
}


export async function remove(id: string) {
    return db.product.delete({
        where: {
            id
        },
        select: {
            id: true
        }
    })
}


export async function update(id: string, data: models["update"]) {
    return db.product.update({
        where: {
            id
        },
        data,
        select: {
            id: true
        }
    })
}

export async function getEdit(): Promise<models["edit"][]> {
    return db.product.findMany({
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
    })
}





export type { models } from "./type";