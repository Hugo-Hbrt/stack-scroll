function assertIsString(variable: unknown): asserts variable is string {
    
    if (typeof variable !== "string")
    {
        throw new Error("Error during assertion")
    }
}

assertIsString(import.meta.env.VITE_BASE_URL);
assertIsString(import.meta.env.VITE_REDDIT_REDIRECT_ROUTE);

const redirectUri = import.meta.env.VITE_BASE_URL + import.meta.env.VITE_REDDIT_REDIRECT_ROUTE;

const REDDIT_CONFIG = {
  clientId: import.meta.env.VITE_REDDIT_CLIENT_ID, // Public client ID
  redirectUri: redirectUri,
  scope: 'identity read submit vote history',
  responseType: 'token', // Important: Use 'token' not 'code'
};

export const SUBREDDITS = ["Python"];

export default REDDIT_CONFIG;