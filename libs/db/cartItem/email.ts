import { db } from "../db";
import { models } from "./type";

export async function add(email: string, productId: string, count: number): Promise<models["model"]> {
    if (count < 1) throw new Error("購入数を1未満にすることはできません");

    // db.cartItem.upsert({
    //     where: {
    //         userId_productId_orderId: {
    //             userId: "",
    //             productId,
    //             //prisma7 未対応
    //             //複合キーのnullが使えない
    //             orderId: null
    //         }
    //     },
    //     update: {
    //         count: {
    //             increment: count
    //         }
    //     },
    //     create: {
    //         user: {
    //             connect: {
    //                 email
    //             }
    //         },
    //         product: {
    //             connect: {
    //                 id: productId
    //             }
    //         },
    //         count
    //     },
    //     select: {
    //         id: true,
    //         count: true
    //     }
    // })
    
    
    const item = await db.cartItem.findFirst({
        where: {
            user: {
                email
            },
            productId,
            orderId: null
        },
        select: {
            id: true
        }
    });

    if (item) {
        return await db.cartItem.update({
            where: {
                id: item.id,
                orderId: null
            },
            data: {
                count: {
                    increment: count
                }
            },
            select: {
                id: true,
                product: {
                    select: {
                        id: true,
                        name: true,
                        description: true,

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
        });
        

    } else {
        return await db.cartItem.create({
            data: {
                user: {
                    connect: {
                        email
                    }
                },
                product: {
                    connect: {
                        id: productId
                    }
                },
                count
            },
            select: {
                id: true,
                product: {
                    select: {
                        id: true,
                        name: true,
                        description: true,

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
        });


    }

}


export async function remove(email: string, id: string) {
    return db.cartItem.delete({
        where: {
            id,
            user: {
                email
            }
        },
        select: {
            id: true
        }
    })
}




export async function update(email: string, id: string, data: models["update"]) {
    if (data.count ?? 1 < 1) throw new Error("購入数を1未満にすることはできません");

    return db.cartItem.update({
        where: {
            id,
            user: {
                email
            },
            orderId: null
        },
        data,
        select: {
            id: true
        }
    });
}


export async function getAll(email: string): Promise<models["model"][]> {
    return db.cartItem.findMany({
        where: {
            user: {
                email
            },
            orderId: null
        },
        select: {
            id: true,
            product: {
                select: {
                    id: true,
                    name: true,
                    description: true,

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
    })
}