import { REDDIT_OAUTH_BASE_URL } from "@config/reddit";
import { type RedditToken } from "@utils/sessionStorage/tokenStorage";

export interface RedditUserData {
    id: string;
    name: string;
    icon_img: string;
    link_karma: number;
    comment_karma: number;
    created_utc: number;
    verified: boolean;
    is_gold: boolean;
}

export interface RedditUserResponse {
    id: string;
    name: string;
    icon_img: string;
    link_karma: number;
    comment_karma: number;
    created_utc: number;
    verified: boolean;
    is_gold: boolean;
}

export const fetchUserInfo = async (accessToken: RedditToken): Promise<RedditUserResponse> => {
    const endpoint = "/api/v1/me";
    
    const response = await fetch(new URL(endpoint, REDDIT_OAUTH_BASE_URL), {
        method: "GET",
        headers: {
            "User-Agent": "web:stack-scroll:v1.0.0 (by /u/stack_scroll_auth)",
            "Authorization": `Bearer ${accessToken.accessToken}`
        }
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch user info: ${response.status} ${response.statusText}`);
    }

    const userData = await response.json() as RedditUserResponse;
    return userData;
};