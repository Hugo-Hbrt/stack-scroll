import AppLogo, { AppLogoSize } from "@components/AppLogo/AppLogo";
import { ScreenSize, useScreenSize } from "@utils/hooks/useScreenSize";
import { Link } from "react-router";
import { twMerge } from "tailwind-merge";

const Header = () => {
    const screenSize = useScreenSize();
    const showText = screenSize !== ScreenSize.Mobile;
    const alignment = screenSize === ScreenSize.Desktop ? "justify-start" : "justify-center";
    const logoSize = screenSize === ScreenSize.Desktop ? AppLogoSize.Large : AppLogoSize.Medium;

    return (
        <header className={twMerge("w-full bg-background-base flex items-center text-2xl font-bold", alignment)}>
            <Link to="/feed">
                <AppLogo className={"mt-[10px] md:ml-[40px] md:mt-[40px]"} showText={showText} size={logoSize}/>
            </Link>
        </header>
    );
}

export default Header;