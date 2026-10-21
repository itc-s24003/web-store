import { db } from "../db";
import { models } from "./type";

export async function add(email: string, cartItemIds: string[]) {
    return await db.$transaction(async tx => {
        const order = await tx.order.create({
            data: {
                user: {
                    connect: {
                        email
                    }
                },
                cartItems: {
                    connect: cartItemIds.map(id => ({
                        id,
                        user: {
                            email
                        },
                        orderId: null
                    }))
                }
            },
            select: {
                id: true,
                cartItems: {
                    select: {
                        product: {
                            select: {
                                id: true,
                                showStock: true
                            }
                        },
                        count: true
                    }
                }
            }
        });

        for (const item of order.cartItems) {
            const product = await tx.product.update({
                where: {
                    id: item.product.id,
                    stock: {
                        gte: item.count
                    }
                },
                data: {
                    stock: {
                        decrement: item.count
                    }
                },
                select: {
                    stock: true
                }
            });
            if (product.stock < 0) throw new Error("商品の在庫を0未満にすることはできません")
        }

        return order.id;
    })
}



export async function update(email: string, id: string, data: models["update"]) {
    return db.order.update({
        where: {
            id,
            user: {
                email
            }
        },
        data,
        select: {
            isCanceled: true,
            isReceived: true,
            isReady: true
        }
    })
}



export async function cancel(email: string, id: string) {
    return await db.order.update({
        where: {
            id,
            user: {
                email
            },
            isCanceled: false,
            isReceived: false,
            isReady: false
        },
        data: {
            isCanceled: true
        },
        select: {
            isCanceled: true
        }
    })
}


