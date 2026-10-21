import { db } from "../db";
import { models } from "./type";

export async function update(id: string, data: models["update"]) {
    return db.cartItem.update({
        where: {
            id,
            orderId: null
        },
        data,
        select: {
            count: true
        }
    })
}


export * as email from "./email";
export type { models } from "./type"