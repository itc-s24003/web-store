import Image from "next/image"
import { useEffect, useState } from "react";

type Carousel_Props = {
    imgSrcs: string[],
}

export function Carousel({ imgSrcs }: Carousel_Props) {
    const loopTime = 2500;
    
    const [now, setNow] = useState(0);
    useEffect(() => {
        const interval = setInterval(() => {
            setNow(Date.now());
        }, 1);
        return () => clearInterval(interval);
    }, [])



    const opacity = 1 - ((now % loopTime) / loopTime);
    
    const showIndex = Math.floor(now / loopTime) % imgSrcs.length;
    const nextIndex = (showIndex + 1) % imgSrcs.length;

    const ImgSrcs = imgSrcs[showIndex];
    const nextImgSrcs = imgSrcs[nextIndex];
    return (
        <div id="default-carousel" className="relative w-full" data-carousel="slide">
            <div className="relative overflow-hidden rounded-lg">
                {
                    ImgSrcs &&
                    <Image src={ImgSrcs} alt={`Slide`} width={300} height={300} className="w-full aspect-square rounded-3xl object-cover" style={{opacity: `${opacity * 100}%`}}/>
                }
                {
                    nextImgSrcs &&
                    <Image src={nextImgSrcs} alt={`Slide`} width={300} height={300} className="absolute top-0 left-0 w-full aspect-square rounded-3xl object-cover" style={{opacity: `${(1 - opacity) * 100}%`}}/>
                }
            </div>
        </div>
    )

}