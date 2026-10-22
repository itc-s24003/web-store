"use client"

import { useState } from "react";

export function useCamera() {
    const [mediaWait, setMediaWait] = useState(false);
    const [media, setMedia] = useState<MediaStream | null>(null);
    const [mediaError, setMediaError] = useState(false);
    


    function startCamera(options?: MediaTrackConstraints) {
        if (mediaWait) return;
        if (media) return;
        setMediaWait(true);
        navigator.mediaDevices.getUserMedia({
            video: options ?? {
                frameRate: 15,
                width: {
                    max: 427
                },
                height: {
                    max: 240
                },
                facingMode: "environment"
            }
        }).then(media => {
            if (media) {
                setMedia(media)
                setMediaWait(false);
            } else {
                setMediaError(true);
                setMediaWait(false)
            }
        }).catch(() => undefined);
    }

    function stopCamera() {
        if (!media) return;
        media.getTracks().forEach(t => t.stop());
        setMedia(null);
    }

    return { media, mediaError, startCamera, stopCamera }
}

