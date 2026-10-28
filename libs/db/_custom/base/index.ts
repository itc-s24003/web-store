import { AppDB } from "../..";

export async function get() {
    const store = await AppDB.store.get();
    const languages = await AppDB.language.getAll();

    return {
        store,
        languages
    }
}