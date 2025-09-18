export interface Post {
    id: number;
    redditId: string; // Original Reddit post ID (base36)
    subreddit: string;
    title: string;
    content: string;
    author: string;
    commentsCount: number;
    initialVoteCount: number;
}

export const createPost = (
    id: number,
    redditId: string,
    subreddit: string,
    title: string,
    content: string,
    author: string,
    commentsCount: number,
    initialVoteCount: number
): Post => ({
    id,
    redditId,
    subreddit,
    title,
    content,
    author,
    commentsCount,
    initialVoteCount
});