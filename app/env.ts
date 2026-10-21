import z from "zod";

const {
    DATABASE_URL,
    CRYPTO_KEY,
    CRYPTO_HEX_IV,
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,

    VERIFYKEY_LIFE_USER: _VERIFYKEY_LIFE_USER,
    VERIFYKEY_LIFE_SYSTEM: _VERIFYKEY_LIFE_SYSTEM,
    VERIFYKEY_LIFE_SERVICE: _VERIFYKEY_LIFE_SERVICE
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


const Z_VERIFYKEY_LIFE_USER = z.int({message: "VERIFYKEY_LIFE_USER は 整数で指定する必要があります"}).min(1, {message: "VERIFYKEY_LIFE_USER は 1以上を指定する必要があります"}).safeParse(_VERIFYKEY_LIFE_USER);
if (!Z_VERIFYKEY_LIFE_USER.success) throw new ENV_Error(Z_VERIFYKEY_LIFE_USER.error.message);

const Z_VERIFYKEY_LIFE_SYSTEM = z.int({message: "VERIFYKEY_LIFE_SYSTEM は 整数で指定する必要があります"}).min(1, {message: "VERIFYKEY_LIFE_SYSTEM は 1以上を指定する必要があります"}).safeParse(_VERIFYKEY_LIFE_SYSTEM);
if (!Z_VERIFYKEY_LIFE_SYSTEM.success) throw new ENV_Error(Z_VERIFYKEY_LIFE_SYSTEM.error.message);

const Z_VERIFYKEY_LIFE_SERVICE = z.int({message: "VERIFYKEY_LIFE_SERVICE は 整数で指定する必要があります"}).min(1, {message: "VERIFYKEY_LIFE_SERVICE は 1以上を指定する必要があります"}).safeParse(_VERIFYKEY_LIFE_SERVICE);
if (!Z_VERIFYKEY_LIFE_SERVICE.success) throw new ENV_Error(Z_VERIFYKEY_LIFE_SERVICE.error.message);



export const APP_ENV = {
    DATABASE_URL,
    
    CRYPTO_KEY,
    CRYPTO_HEX_IV,

    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,


    VERIFYKEY_LIFE_USER: Z_VERIFYKEY_LIFE_USER.data,
    VERIFYKEY_LIFE_SYSTEM: Z_VERIFYKEY_LIFE_SYSTEM.data,
    VERIFYKEY_LIFE_SERVICE: Z_VERIFYKEY_LIFE_SERVICE.data
}