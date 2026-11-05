import jsQR from "jsqr";
import { RefObject, useState } from "react";

export function useQR_Reader(canvas: RefObject<HTMLCanvasElement | null>, onRead?: (code: string) => void, blockResults: boolean = false) {
    const [qrText, setQRText] = useState<string | null>(null);

    function readQRCode() {
        if (blockResults && qrText) return;
        if (!canvas.current) return;
        const ctx = canvas.current.getContext("2d");
        if (!ctx) return;
        const w = canvas.current.width;
        const h = canvas.current.height;
        if (w === 0 || h === 0) return;
        const imageData = ctx.getImageData(0, 0, w, h);
        const code = jsQR(imageData.data, imageData.width, imageData.height);
        if (code) {
            setQRText(code.data);
            onRead?.(code.data);
        }
    }

    function clearResult() {
        setQRText(null);
    }

    return { qrText, readQRCode, clearResult };
}