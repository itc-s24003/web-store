import { db } from "../db";
import { models } from "./type";


export async function get(id: string): Promise<models["model"] | null> {
    return db.user.findUnique({
        where: {
            id
        },
        select: {
            id: true,
            langId: true,
            subscribe_hash: true
        }
    })
}





export async function getDetailMin(id: string): Promise<models["detailMin"] | null> {
    return db.user.findUnique({
        where: {
            id
        },
        select: {
            id: true,
            langId: true,
            subscribe_hash: true,
            
            _count: {
                select: {
                    cartItems: {
                        where: {
                            orderId: null
                        }
                    },
                    orders: {
                        where: {
                            isCanceled: false,
                            isReceived: false,
                            isReady: true
                        }
                    },
                    messages: {
                        where: {
                            isRead: false
                        }
                    }
                }
            }
        }
    })
}





export async function getDetail(id: string): Promise<models["detail"] | null> {
    return db.user.findUnique({
        where: {
            id
        },
        select: {
            id: true,
            
            orders: {
                select: {
                    id: true,
                    index: true,

                    isCanceled: true,
                    isReady: true,
                    isReceived: true,

                    cartItems: {
                        select: {
                            id: true,
                            product: {
                                select: {
                                    id: true,
                                    name: true,
                                    price: true,
                                    img: {
                                        select: {
                                            url: true
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    })
}




export async function getDetailFull(id: string): Promise<models["detailFull"] | null> {
    return db.user.findUnique({
        where: {
            id
        },
        include: {
            cartItems: {
                include: {
                    product: {
                        include: {
                            img: true
                        }
                    }
                }
            },
            orders: {
                include: {
                    cartItems: {
                        include: {
                            product: {
                                include: {
                                    img: true
                                }
                            }
                        }
                    }
                }
            }
        }
    })
}



export async function update(id: string, data: models["update"]) {
    return db.user.update({
        where: {
            id
        },
        data,
        select: {
            id: true
        }
    })
}






export * as email from "./email";

export type { models } from "./type"