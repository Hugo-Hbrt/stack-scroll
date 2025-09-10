export class Post {
    tag: string;
    title: string;
    content: string;
    author: string;
    commentsCount: number;
    initialVoteCount: number;

    constructor(
        tag: string,
        title: string,
        content: string,
        author: string,
        commentsCount: number,
        initialVoteCount: number
    ) {
        this.tag = tag;
        this.title = title;
        this.content = content;
        this.author = author;
        this.commentsCount = commentsCount;
        this.initialVoteCount = initialVoteCount;
    }
}

export class PostFactory {
    static createPost(
        tag: string,
        title: string,
        content: string,
        author: string,
        commentsCount: number,
        initialVoteCount: number
    ): Post {
        return new Post(tag, title, content, author, commentsCount, initialVoteCount);
    }
}