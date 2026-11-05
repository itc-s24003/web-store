import { AppAPI } from "@/libs/api";
import { PageView } from "./view";
import { unauthorized } from "next/navigation";

export const instant = false;

export default async function Page() {
    const email = await AppAPI.session.getEmail();
    if (!email) unauthorized();

    const permission = await AppAPI.permission.get(email);
    if (!permission) unauthorized();


    return <PageView />;
}