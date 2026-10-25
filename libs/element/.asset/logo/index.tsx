export function Asset_Logo() {
    return (
        <div className="flex flex-col items-center justify-center gap-2">
            <span className="relative aspect-square w-20 overflow-hidden bg-orange-500">
                <svg
                    className="absolute inset-0 h-full w-full"
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                >
                    <path
                        d="M0 58C18 45 30 72 50 58S82 45 100 58V100H0Z"
                        fill="white"
                        opacity=".28"
                    />
                    <path
                        d="M0 72C20 58 34 86 54 70S82 60 100 72V100H0Z"
                        fill="white"
                        opacity=".2"
                    />
                    <path
                        d="M34 36h32l3 29H31l3-29Z"
                        fill="none"
                        stroke="white"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="3"
                        opacity=".9"
                    />
                    <path
                        d="M42 36v-5a8 8 0 0 1 16 0v5"
                        fill="none"
                        stroke="white"
                        strokeLinecap="round"
                        strokeWidth="3"
                        opacity=".9"
                    />
                </svg>
                <span className="absolute inset-x-0 bottom-2 text-center text-[10px] font-bold tracking-wide text-white">
                    Online Store
                </span>
            </span>
        </div>
    )
}



export function Asset_Logo_Generic({ scale }: { scale: number }) {
    return (
        <div className="flex flex-col items-center justify-center gap-2">
            <span className="relative aspect-square w-20 overflow-hidden bg-orange-500" style={{ transform: `scale(${scale})` }}>
                <svg
                    className="absolute inset-0 h-full w-full"
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                >
                    <path
                        d="M0 58C18 45 30 72 50 58S82 45 100 58V100H0Z"
                        fill="white"
                        opacity=".28"
                    />
                    <path
                        d="M0 72C20 58 34 86 54 70S82 60 100 72V100H0Z"
                        fill="white"
                        opacity=".2"
                    />
                    <path
                        d="M34 36h32l3 29H31l3-29Z"
                        fill="none"
                        stroke="white"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="3"
                        opacity=".9"
                    />
                    <path
                        d="M42 36v-5a8 8 0 0 1 16 0v5"
                        fill="none"
                        stroke="white"
                        strokeLinecap="round"
                        strokeWidth="3"
                        opacity=".9"
                    />
                </svg>
                <span className="absolute inset-x-0 bottom-2 text-center text-[10px] font-bold tracking-wide text-white">
                    Online Store
                </span>
            </span>
        </div>
    )
}