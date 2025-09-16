import LoadingSpinner from "@components/LoadingSpinner/LoadingSpinner";
import ROUTES from "@config/routes";
import { SecureTokenStorage } from "@utils/tokenStorage/tokenStorage";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { loginSuccess } from "@store/authSlice";
import { useDispatch } from "react-redux";

const useOAuthCallBack = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        const handleCallback = async () => {
            try {
                const fragment = window.location.hash.substring(1);
                const params = new URLSearchParams(fragment);
                const accessToken = params.get('access_token');
                const expiresIn = params.get('expires_in');
                const scope = params.get('scope');
                const state = params.get('state');
                const error = params.get('error');

                // Verify state for CSRF protection
                const storedState = sessionStorage.getItem('oauth_state');
                if (state !== storedState) {
                    throw new Error('Invalid state parameter');
                }

                if (error) {
                    throw new Error(`OAuth error: ${error}`);
                }

                if (!accessToken || !expiresIn) {
                    throw new Error('Missing access token or expiration');
                }

                // Calculate expiration time
                const expiresAt = Date.now() + (parseInt(expiresIn) * 1000);

                // Store tokens securely
                SecureTokenStorage.setToken({
                    accessToken,
                    expiresAt,
                    scope: scope || ''
                });

                const redditToken = SecureTokenStorage.getToken();
                if (redditToken) {
                    dispatch(loginSuccess({
                        accessToken: redditToken
                    }));
                } else {
                    navigate(ROUTES.HOME)
                }
            } catch (error) {
                navigate(ROUTES.HOME);
            }
        }

        handleCallback();
        navigate(ROUTES.FEED);
    }, []);
}

const AuthenticationPage = () => {
    useOAuthCallBack();
    
    return (
        <>
            <h1 className="text-center text-2xl font-family-sans">Authenticating from Reddit..</h1>
            <LoadingSpinner />
        </>);
}

export default AuthenticationPage;