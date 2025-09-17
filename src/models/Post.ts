export interface Post {
    id: number;
    subreddit: string;
    title: string;
    content: string;
    author: string;
    commentsCount: number;
    initialVoteCount: number;
}

export const createPost = (
    id: number,
    subreddit: string,
    title: string,
    content: string,
    author: string,
    commentsCount: number,
    initialVoteCount: number
): Post => ({
    id,
    subreddit,
    title,
    content,
    author,
    commentsCount,
    initialVoteCount
});