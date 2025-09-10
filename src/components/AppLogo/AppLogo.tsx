import AppLogoSVG from "@assets/images/stackscroll-logo.svg";
import { twMerge } from "tailwind-merge";

export enum AppLogoSize {
    Small = "sm",
    Medium = "md",
    Large = "lg"
}

interface AppLogoProps {
    showText?: boolean;
    size?: AppLogoSize;
    className?: string;
}
const sizeClasses = {
    [AppLogoSize.Small]: 16,
    [AppLogoSize.Medium]: 32,
    [AppLogoSize.Large]: 64,
};

const textSizeClasses = {
    [AppLogoSize.Small]: "text-[14px]",
    [AppLogoSize.Medium]: "text-[20px]",
    [AppLogoSize.Large]: "text-[48px]",
};

const AppLogo = ({showText=false, size=AppLogoSize.Small, className=""}: AppLogoProps) => {
    return (
        <div className={twMerge("flex flex-row items-center", className)}>
            <AppLogoSVG width={sizeClasses[size]} height={sizeClasses[size]} className="inline"/>
            {showText && <p className={twMerge("ml-1 font-family-sans text-text-base font-normal inline", textSizeClasses[size])}>StackScroll</p>}
        </div>
    );
}

export default AppLogo;