//参考
//https://developer.mozilla.org/ja/docs/Web/API/SubtleCrypto/digest#%E4%BE%8B



async function toHash(text: string) {
    const uint8  = new TextEncoder().encode(text);
    const digest = await crypto.subtle.digest('SHA-256', uint8);
    return Array.from(new Uint8Array(digest)).map(v => v.toString(16).padStart(2,'0')).join('');

}


function urlBase64ToUint8Array(base64String: string) {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4)
    const base64 = (base64String + padding)
    .replace(/-/g, "+")
    .replace(/_/g, "/")

    const rawData = window.atob(base64)
    const outputArray = new Uint8Array(rawData.length)

    new Uint8Array(rawData.split("").map(c => c.charCodeAt(0)))

    for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
    }
    return new Uint8Array(rawData.split("").map(c => c.charCodeAt(0)))
}




export const AppCrypto_Client = {
    toHash,
    urlBase64ToUint8Array
}