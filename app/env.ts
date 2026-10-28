import z from "zod";

const {
    DATABASE_URL,
    CRYPTO_KEY,
    CRYPTO_HEX_IV,
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,

    VERIFYKEY_LIFE_USER: _VERIFYKEY_LIFE_USER,
    VERIFYKEY_LIFE_SYSTEM: _VERIFYKEY_LIFE_SYSTEM,
    VERIFYKEY_LIFE_SERVICE: _VERIFYKEY_LIFE_SERVICE,

    ADMIN_EMAIL: _ADMIN_EMAIL,

    NEXT_PUBLIC_VAPID_PUBLIC,
    VAPID_PRIVATE,

    BLOB_READ_WRITE_TOKEN,

    CLIENT_CACHE,
    SERVER_CACHE
} = process.env;



class ENV_Error extends Error {
    constructor(message: string) {
        super(`[env] ${message}`)
    }
}

class ENV_Error_NotSet extends ENV_Error {
    constructor(name: string) {
        super(`${name} が指定されていません`)
    }
}



if (!DATABASE_URL) throw new ENV_Error_NotSet("DATABASE_URL");

if (!CRYPTO_KEY) throw new ENV_Error_NotSet("CRYPTO_KEY");
if (!/[0-9a-fA-F]{64}/.test(CRYPTO_KEY)) throw new ENV_Error("CRYPTO_KEY は hex(32byte)を指定する必要があります");
if (!CRYPTO_HEX_IV) throw new ENV_Error_NotSet("CRYPTO_HEX_IV");
if (!/[0-9a-fA-F]{24}/.test(CRYPTO_HEX_IV)) throw new ENV_Error("CRYPTO_HEX_IV は hex(12byte)を指定する必要があります");

if (!GOOGLE_CLIENT_ID) throw new ENV_Error_NotSet("GOOGLE_CLIENT_ID");
if (!GOOGLE_CLIENT_SECRET) throw new ENV_Error_NotSet("GOOGLE_CLIENT_SECRET");


const Z_VERIFYKEY_LIFE_USER = z.preprocess(
    Number,
    z.int({message: "VERIFYKEY_LIFE_USER は 整数で指定する必要があります"}).min(1, {message: "VERIFYKEY_LIFE_USER は 1以上を指定する必要があります"})
).safeParse(_VERIFYKEY_LIFE_USER);
if (!Z_VERIFYKEY_LIFE_USER.success) throw new ENV_Error(Z_VERIFYKEY_LIFE_USER.error.issues.map(issue => issue.message).join(", "));

const Z_VERIFYKEY_LIFE_SYSTEM = z.preprocess(
    Number,
    z.int({message: "VERIFYKEY_LIFE_SYSTEM は 整数で指定する必要があります"}).min(1, {message: "VERIFYKEY_LIFE_SYSTEM は 1以上を指定する必要があります"})
).safeParse(_VERIFYKEY_LIFE_SYSTEM);
if (!Z_VERIFYKEY_LIFE_SYSTEM.success) throw new ENV_Error(Z_VERIFYKEY_LIFE_SYSTEM.error.issues.map(issue => issue.message).join(", "));

const Z_VERIFYKEY_LIFE_SERVICE = z.preprocess(
    Number,
    z.int({message: "VERIFYKEY_LIFE_SERVICE は 整数で指定する必要があります"}).min(1, {message: "VERIFYKEY_LIFE_SERVICE は 1以上を指定する必要があります"})
).safeParse(_VERIFYKEY_LIFE_SERVICE);
if (!Z_VERIFYKEY_LIFE_SERVICE.success) throw new ENV_Error(Z_VERIFYKEY_LIFE_SERVICE.error.issues.map(issue => issue.message).join(", "));


const Z_ADMIN_EMAIL = z.email({message: "ADMIN_EMAIL は メールアドレス形式で指定する必要があります"}).safeParse(_ADMIN_EMAIL);
if (!Z_ADMIN_EMAIL.success) throw new ENV_Error(Z_ADMIN_EMAIL.error.issues.map(issue => issue.message).join(", "));

if (!NEXT_PUBLIC_VAPID_PUBLIC) throw new ENV_Error_NotSet("NEXT_PUBLIC_VAPID_PUBLIC");
if (!VAPID_PRIVATE) throw new ENV_Error_NotSet("VAPID_PRIVATE");

if (!BLOB_READ_WRITE_TOKEN) throw new ENV_Error_NotSet("BLOB_READ_WRITE_TOKEN");

const Z_CLIENT_CACHE = z.preprocess(
    Number,
    z.int({message: "CLIENT_CACHE は 整数で指定する必要があります"}).min(1, {message: "CLIENT_CACHE は 1以上を指定する必要があります"})
).safeParse(CLIENT_CACHE);
if (!Z_CLIENT_CACHE.success) throw new ENV_Error(Z_CLIENT_CACHE.error.issues.map(issue => issue.message).join(", "));


const Z_SERVER_CACHE = z.preprocess(
    Number,
    z.int({message: "SERVER_CACHE は 整数で指定する必要があります"}).min(1, {message: "SERVER_CACHE は 1以上を指定する必要があります"})
).safeParse(SERVER_CACHE);
if (!Z_SERVER_CACHE.success) throw new ENV_Error(Z_SERVER_CACHE.error.issues.map(issue => issue.message).join(", "));



export const APP_ENV = {
    DATABASE_URL,
    
    CRYPTO_KEY,
    CRYPTO_HEX_IV,

    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,


    VERIFYKEY_LIFE_USER: Z_VERIFYKEY_LIFE_USER.data,
    VERIFYKEY_LIFE_SYSTEM: Z_VERIFYKEY_LIFE_SYSTEM.data,
    VERIFYKEY_LIFE_SERVICE: Z_VERIFYKEY_LIFE_SERVICE.data,

    ADMIN_EMAIL: Z_ADMIN_EMAIL.data,

    NEXT_PUBLIC_VAPID_PUBLIC,
    VAPID_PRIVATE,

    BLOB_READ_WRITE_TOKEN,


    CLIENT_CACHE: Z_CLIENT_CACHE.data,
    SERVER_CACHE: Z_SERVER_CACHE.data
}