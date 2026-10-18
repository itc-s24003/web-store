const {
    DATABASE_URL

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



export const APP_ENV = {
    DATABASE_URL,
}