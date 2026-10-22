"use client"

import { RefObject, useEffect } from "react";

export function useVideo(video: RefObject<HTMLVideoElement | null>, onFrame?: (video: HTMLVideoElement) => void) {
    useEffect(() => {
        function frameCallback() {
            if (!video.current) return;
            onFrame?.(video.current);
            video.current.requestVideoFrameCallback(frameCallback);
        }
        video.current?.requestVideoFrameCallback(frameCallback);
    }, [video, onFrame]);
    
}