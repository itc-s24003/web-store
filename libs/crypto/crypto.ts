import { APP_ENV } from "@/app/env";
import crypto from "node:crypto";

// 秘密鍵
const key = Buffer.from(APP_ENV.CRYPTO_KEY, "hex");
const iv = Buffer.from(APP_ENV.CRYPTO_HEX_IV, "hex");


function encrypt(plainText: string) {
    const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
    
    const encrypted = cipher.update(plainText, "utf8", "hex") + cipher.final("hex");
    const authTag = cipher.getAuthTag().toString("hex");

    return `${authTag}:${encrypted}`;
}

function decrypt(encryptedData: string) {
    const [authTagHex, encryptedText] = encryptedData.split(":");
    
    const authTag = Buffer.from(authTagHex, "hex");
    const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
    decipher.setAuthTag(authTag);

    const decrypted = decipher.update(encryptedText, "hex", "utf8") + decipher.final("utf8");

    return decrypted;
}



export const AppCrypto = {
    encrypt,
    decrypt
}

