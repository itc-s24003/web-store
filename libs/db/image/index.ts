import { db } from "../db";
import { models } from "./type";

export async function add(url: string): Promise<models["model"]> {
    return await db.image.create({
        data: {
            url
        }
    })
}

export async function remove(id: string): Promise<models["model"]> {
    return await db.image.delete({
        where: {
            id
        },
        select: {
            id: true,
            url: true
        }
    })
}

export async function getAll(): Promise<models["model"][]> {
    return db.image.findMany({
        select: {
            id: true,
            url: true
        }
    })
}


export type { models } from "./type"