export interface Post {
    id: number;
    tag: string;
    title: string;
    content: string;
    author: string;
    commentsCount: number;
    initialVoteCount: number;
}

export const createPost = (
    id: number,
    tag: string,
    title: string,
    content: string,
    author: string,
    commentsCount: number,
    initialVoteCount: number
): Post => ({
    id,
    tag,
    title,
    content,
    author,
    commentsCount,
    initialVoteCount
});