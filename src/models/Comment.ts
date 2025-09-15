export interface Comment {
    id: number;
    postId: number;
    author: string;
    content: string;
    votes: number;
}

export const createComment = (
    id: number,
    postId: number,
    author: string,
    content: string,
    votes: number
): Comment => ({
    id,
    postId,
    author,
    content,
    votes
});