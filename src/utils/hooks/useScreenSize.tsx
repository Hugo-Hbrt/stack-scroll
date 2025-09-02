import { useEffect, useState } from 'react';

export enum ScreenSize {
    Mobile = 'Mobile',
    Desktop = 'Desktop',
}

const MOBILE_MAX_WIDTH = 768;

const getScreenSize = (): ScreenSize =>
    window.innerWidth <= MOBILE_MAX_WIDTH ? ScreenSize.Mobile : ScreenSize.Desktop;

export function useScreenSize(): ScreenSize {
    const [screenSize, setScreenSize] = useState<ScreenSize>(getScreenSize());

    useEffect(() => {
        const handleResize = () => {
            setScreenSize(getScreenSize());
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return screenSize;
}