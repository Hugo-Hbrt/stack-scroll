import type { RedditToken } from "@utils/sessionStorage/tokenStorage";
import { REDDIT_OAUTH_BASE_URL } from "@config/reddit";
import type { UserInfo } from "@utils/sessionStorage/userStorage";
export interface RedditCommentData {
    id: string;
    author: string;
    body: string;
    score: number;
    created_utc: number;
    parent_id: string;
    link_id: string;
    subreddit: string;
    depth: number;
    replies?: RedditCommentsResponse | string; // Can be nested comments or empty string
    is_submitter: boolean;
    stickied: boolean;
    distinguished?: string | null;
    [key: string]: unknown; // For additional Reddit fields
}

export interface RedditCommentsResponse {
    data: {
        children: Array<{
            kind: string;
            data: RedditCommentData;
        }>;
        after?: string | null;
        before?: string | null;
        modhash?: string | null;
    };
}

// Reddit returns an array: [post_data, comments_data]
export interface RedditPostWithCommentsResponse extends Array<any> {
    0: any; // Post data (we already have this from fetchPosts)
    1: RedditCommentsResponse; // Comments data
}

export const fetchComments = async (
    subreddit: string, 
    postId: string, 
    accessToken: RedditToken,
    userInfo: UserInfo,
): Promise<RedditCommentsResponse> => {
    
    const endpoint = `/r/${subreddit}/comments/${postId}`;
    try {
        const response = await fetch(new URL(endpoint, REDDIT_OAUTH_BASE_URL), {
            method: "GET",
            headers: {
                "User-Agent": `web:stack-scroll:v1.0.0 (by /u/${userInfo.name})`,
                "Authorization": `Bearer ${accessToken.accessToken}`
            }
        });

        if (!response.ok) {
            const text = await response.text();
            throw new Error(`Error fetching comments: ${response.status.toString()} ${text}`);
        }

        const data = await response.json() as RedditPostWithCommentsResponse;
        
        // Reddit returns [post_data, comments_data], we want only comments
        return data[1];

    } catch (error) {
        console.log("Error : ", error);
        throw error;
    }
}

export const fetchCommentById = async (_id: string): Promise<RedditCommentData | null> => {
    return new Promise((resolve) => {
        // TODO: implement fetching a comment by id
        resolve(null);
    });
}