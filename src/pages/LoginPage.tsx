import { useAppSelector } from "@store/hooks";
import { Navigate } from "react-router";

import ROUTES from "@config/routes";

import { generateOAuthUrl } from "@api/reddit/authorization";

import Button from "@components/Button/Button";

const LoginPage = () => {

    const { isAuthenticated } = useAppSelector((s) => s.auth);

    const redirectToRedditOAuth = () => {
        window.location.href = generateOAuthUrl();
    }

    return (
        <div className="flex flex-col gap-2.5">
            {isAuthenticated && <Navigate to={ROUTES.FEED} />}
            <h1 className="text-center font-family-sans font-semibold text-4xl">Welcome</h1>
            <p className="text-center text-text-base font-family-sans font-semibold text-2xl"> This app requires connection to your Reddit account ! </p>
            <Button className="self-center text-nowrap" onClick={redirectToRedditOAuth}>Authorize Reddit</Button>
        </div>)
}

export default LoginPage;