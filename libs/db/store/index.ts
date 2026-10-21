import { db } from "../db";
import { models } from "./type";

export async function get(): Promise<models["model"]> {
    return db.store.upsert({
        where: {
            id: 1
        },
        update: {},
        create: {
            name: "store name",
            description: "store description"
        },
        select: {
            name: true,
            description: true,
            img: {
                select: {
                    url: true
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

export async function update(data: models["update"]) {
    return db.store.update({
        where: {
            id: 1
        },
        data,
        select: {
            id: true
        }
    })
}



export type { models } from "./type"