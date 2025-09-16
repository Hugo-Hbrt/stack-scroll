export interface RedditToken {
    accessToken: string;
    expiresAt: number;
    scope: string;
}

export class SecureTokenStorage {
    private static readonly ACCESS_TOKEN_KEY = 'reddit_access_token' as string;
    private static readonly EXPIRES_AT_KEY = 'reddit_expires_at' as string;
    private static readonly SCOPE_KEY = 'reddit_scope' as string;

    static setToken = (tokens: RedditToken) => {

        const encrypted_token = btoa(tokens.accessToken);

        try {
            sessionStorage.setItem(this.ACCESS_TOKEN_KEY, encrypted_token);
            sessionStorage.setItem(this.EXPIRES_AT_KEY, tokens.expiresAt.toString());
            sessionStorage.setItem(this.SCOPE_KEY, tokens.scope);
        } catch (error) {
            throw new Error("Could not add tokens to local Storage.")
        }
    }

    static getToken = (): RedditToken | null => {

        try {

            const encryptedAccessToken = sessionStorage.getItem(this.ACCESS_TOKEN_KEY);
            const expiresAt = sessionStorage.getItem(this.EXPIRES_AT_KEY);
            const scope = sessionStorage.getItem(this.SCOPE_KEY);

            if (!encryptedAccessToken || !expiresAt || !scope) {
                return null;
            }
            
            if (Date.now() > parseInt(expiresAt)) {
                this.clearToken();
                return null;
            }

            const accessToken = atob(encryptedAccessToken);

            const redditTokens = {
                accessToken: accessToken,
                expiresAt: Number(expiresAt),
                scope: scope,
            } as RedditToken;

            return redditTokens;

        } catch (error) {
            console.log("Failed to retrieve token:", error);
            return null
        }
    }

    static clearToken = () => {
        try {
            sessionStorage.removeItem(this.ACCESS_TOKEN_KEY);
            sessionStorage.removeItem(this.EXPIRES_AT_KEY);
            sessionStorage.removeItem(this.SCOPE_KEY);
        } catch (error) {
            console.log("Couldn't clear tokens : ", error);
        }
    }

    static hasValidToken = (): boolean => {
        const expiresAt = sessionStorage.getItem(this.EXPIRES_AT_KEY);
        
        if (expiresAt === null) {
            return false;
        } else {
            return (Number(expiresAt) > Date.now());
        }
    }
}

