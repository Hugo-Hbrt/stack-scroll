import REDDIT_CONFIG from "@config/reddit";

export const OAUTH_STATE_KEY = "oauth_state";

export const generateOAuthUrl = (): string => {
    const baseUrl = "https://www.reddit.com/api/v1/authorize?"
    const state = generateRandomString(16); // For CSRF protection

    storeStateToStorage(state);

    const params = new URLSearchParams({
        client_id: REDDIT_CONFIG.clientId,
        response_type: REDDIT_CONFIG.responseType,
        state: state,
        redirect_uri: REDDIT_CONFIG.redirectUri,
        scope: REDDIT_CONFIG.scope
    } as Record<string, string>);

    return `${baseUrl}${params.toString()}`;
}

const storeStateToStorage = (state: string) : void => {
    sessionStorage.setItem(OAUTH_STATE_KEY, state);
}

export const generateRandomString = (length: number): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
};