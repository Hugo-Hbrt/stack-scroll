import { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@store/hooks";
import { useLocation, useNavigate } from "react-router";
import { SecureTokenStorage } from "@utils/tokenStorage/tokenStorage";
import { loginSuccess, updateLoginStatus } from "@store/authSlice";
import ROUTES from "@config/routes";

const useLoginManager = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { isAuthenticated } = useAppSelector((s) => s.auth);
    const location = useLocation();

    // Login if token from storage is valid.
    useEffect(() => {
        if (!isAuthenticated && SecureTokenStorage.hasValidToken()) {
            const redditToken = SecureTokenStorage.getToken();
            if (redditToken) {
                dispatch(loginSuccess({
                    accessToken: redditToken
                }));
                navigate(ROUTES.FEED);
            }
        }
    }, [])

    // When user not logged in navigate back to home page.
    useEffect(() => {
        if (!isAuthenticated && location.pathname !== ROUTES.HOME) {
            navigate(ROUTES.HOME);
        }
    }, [isAuthenticated, location]);

    // Checks for login status each minute
    useEffect(() => {
        const intervalId = setInterval(() => {
          dispatch(updateLoginStatus());
        }, 60000)
    
        return () => clearInterval(intervalId);
    }, []);
};

export default useLoginManager;