export class Post {
    id: number;
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
        initialVoteCount: number,
        id: number
    ) {
        this.id = id;
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
        id: number,
        tag: string,
        title: string,
        content: string,
        author: string,
        commentsCount: number,
        initialVoteCount: number
    ): Post {
        return new Post(tag, title, content, author, commentsCount, initialVoteCount, id);
    }
}