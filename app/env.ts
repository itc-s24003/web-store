const {
    DATABASE_URL,
    CRYPTO_KEY,
    CRYPTO_HEX_IV,
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET

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

export const APP_ENV = {
    DATABASE_URL,
    CRYPTO_KEY,
    CRYPTO_HEX_IV,
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET

}