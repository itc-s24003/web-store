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
                                id: true
                            }
                        },
                        count: true
                    }
                },
                _count: {
                    select: {
                        cartItems: true
                    }
                }
            }
        });

        if (order._count.cartItems === 0) throw new Error("カートに商品が存在しません");
        if (order._count.cartItems !== cartItemIds.length) throw new Error("カートに存在しない商品が含まれています");

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




export async function getAll(email: string, hasReceived?: boolean): Promise<models["model"][]> {
    return db.order.findMany({
        where: {
            user: {
                email
            },
            isReceived: hasReceived
        },
        select: {
            id: true,
            index: true,
            isCanceled: true,
            isReceived: true,
            isReady: true,
            requestedAt: true,
            cartItems: {
                select: {
                    id: true,
                    count: true,
                    product: {
                        select: {
                            id: true,
                            name: true,
                            price: true,
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
                            }
                        }
                    }
                }
            },
            _count: {
                select: {
                    cartItems: true
                }
            }
        },
        orderBy: {
            requestedAt: "asc"
        }
    })
}