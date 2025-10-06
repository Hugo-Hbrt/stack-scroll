import LoadingSpinner from "@components/LoadingSpinner/LoadingSpinner";
import ROUTES from "@config/routes";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { authenticateUser } from "@store/authSlice";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@store/store";

const useOAuthCallBack = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();

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

                // Create Reddit token object
                const redditToken = {
                    accessToken,
                    expiresAt,
                    scope: scope || ''
                };

                // Authenticate user and fetch user info
                const result = await dispatch(authenticateUser(redditToken));
                
                if (authenticateUser.fulfilled.match(result)) {
                    navigate(ROUTES.FEED);
                } else {
                    navigate(ROUTES.HOME);
                }
            } catch (error) {
                navigate(ROUTES.HOME);
            }
        }

        handleCallback();
    }, [navigate, dispatch]);
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