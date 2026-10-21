import { getServerSession } from "next-auth";
import { AppCrypto } from "@/libs/crypto/crypto";

export async function getEmail() {
    const session = await getServerSession();
    const emailRaw = session?.user?.email;
    if (!emailRaw) return null;
    return AppCrypto.encrypt(emailRaw);
}