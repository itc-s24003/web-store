import { db } from "../db";
import { models } from "./type";


export async function add(name: string): Promise<models["model"]> {
    return db.language.create({
        data: {
            name
        }
    })
}

export async function getAll(): Promise<models["model"][]> {
    return db.language.findMany({
        select: {
            id: true,
            name: true
        }
    })
}

export async function remove(id: string) {
    return db.language.delete({
        where: {
            id
        },
        select: {
            id: true
        }
    })
}

export async function update(id: string, data: models["update"]) {
    return db.language.update({
        where: {
            id
        },
        data,
        select: {
            id: true
        }
    })
}



export type { models } from "./type"