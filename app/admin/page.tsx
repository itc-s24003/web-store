import { AppAPI } from "@/libs/api"
import { forbidden, unauthorized } from "next/navigation";
import { PageView } from "./view";
import { AppDB } from "@/libs/db";
import { connection } from "next/server";

export const instant = false;


export default async function Page() {
    await connection()
    const email = await AppAPI.session.getEmail();
    if (!email) unauthorized();

    const permission = await AppAPI.permission.get(email);
    if (!permission) unauthorized();
    if (!permission.isAdmin) forbidden();

    const languages = await AppDB.language.getAll();
    const images = await AppDB.image.getAll();

    const productGroups = await AppDB.productGroup.getEdit();
    const products = await AppDB.product.getEdit();

    return <PageView languages={languages} images={images} productGroups={productGroups} products={products} />
}