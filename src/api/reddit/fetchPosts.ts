import type { RedditToken } from "@utils/tokenStorage/tokenStorage";

const REDDIT_OAUTH_BASE_URL = "https://oauth.reddit.com";

export interface RedditPostData {
    id: string;
    title: string;
    author: string;
    score: number;
    num_comments: number;
    created_utc: number;
    subreddit: string;
    permalink: string;
    selftext?: string;
    url?: string;
    thumbnail?: string;
    over_18: boolean;
    spoiler: boolean;
    [key: string]: unknown; // For additional Reddit fields
}

export interface RedditResponse {
    data: {
        children: Array<{
            kind: string;
            data: RedditPostData;
        }>;
        after?: string | null;
        before?: string | null;
        modhash?: string | null;
    };
}

export const fetchPosts = async (subReddit: string, accessToken: RedditToken): Promise<RedditResponse> => {
    
    const endpoint = `/r/${subReddit}/new`;
    try {
        const response = await fetch(new URL(endpoint, REDDIT_OAUTH_BASE_URL), {
            method: "GET",
            headers: {
                "User-Agent": "web:stack-scroll:v1.0.0 (by /u/haotin)",
                "Authorization": `Bearer ${accessToken.accessToken}`
            }
        });

        if (!response.ok) {
            const text = await response.text();
            throw new Error(`Error fetching posts: ${response.status.toString()} ${text}`);
        }

        return await response.json();

    } catch (error) {
        console.log("Error : ", error);
        throw error;
    }
}

export const getPost = async (_id: number): Promise<RedditPostData | null> => {
    return new Promise((resolve) => {
        // TODO: implement fetching a post by id
        resolve(null);
    });
}

