import AppLogo, { AppLogoSize } from "@components/AppLogo/AppLogo";
import { ScreenSize, useScreenSize } from "@utils/hooks/useScreenSize";
import { Link } from "react-router";
import { twMerge } from "tailwind-merge";
import ROUTES from "@config/routes.ts"
import { useAppSelector } from "@store/hooks";
import { useMemo } from "react";
import Button from "@components/Button/Button";
import { useDispatch } from "react-redux";
import { logout } from "@store/authSlice";

const Header = () => {
    const { isAuthenticated, userInfo} = useAppSelector((s) => s.auth);
    const dispatch = useDispatch();
    const screenSize = useScreenSize();
    const showText = screenSize !== ScreenSize.Mobile;
    const logoSize = screenSize === ScreenSize.Desktop ? AppLogoSize.Large : AppLogoSize.Medium;
    const isMobile = screenSize === ScreenSize.Mobile;

    const username = useMemo<string>(() => {
        return userInfo?.name || "";
    }, [userInfo]);

    const route = useMemo<string>(() => {
        return isAuthenticated ? ROUTES.FEED : ROUTES.HOME;
    }, [isAuthenticated])
    
    return (
        <header className="w-full bg-background-base flex items-center text-2xl font-bold relative">
            {/* Logo - positioned left on desktop, center on mobile */}
            <div className={twMerge(
                "flex items-center",
                isMobile ? "absolute left-1/2 transform -translate-x-1/2" : "ml-[40px]"
            )}>
                <Link to={route}>
                    <AppLogo className="mt-[10px] md:mt-[40px]" showText={showText} size={logoSize}/>
                </Link>
            </div>
            
            {/* User section - always positioned on the right */}
            {isAuthenticated && 
            (<div className="ml-auto mr-[40px] flex items-center gap-4">
                <p>Hello {username}!</p>
                <Button onClick={() => dispatch(logout())}>Logout</Button>
            </div>)}
        </header>
    );
}

export default Header;