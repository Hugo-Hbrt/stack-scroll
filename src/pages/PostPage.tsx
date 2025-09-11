import CommentSection from "@components/Comments/CommentSection";
import CommentForm from "@components/Comments/CommentForm";
import Comment from "@components/Comments/Comment";
import commentMocks from "../mocks/commentMocks";
import PostSection from "@components/Post/PostSection";
import postMocks from "../mocks/postMocks";
import { useEffect, useRef } from "react";
import { useLocation, useParams } from "react-router";

const PostPage = () => {
    const { postId } = useParams<{ postId: string }>();
    const post = postMocks.find((post) => post.id === Number(postId));
    const location = useLocation();

    const commentsRef = useRef<HTMLDivElement>(null);
    const scrollToComments = () => {
        commentsRef?.current?.scrollIntoView({ behavior: "smooth" });
    }

    useEffect(() => {
        if (location.hash === "#comments") {
            scrollToComments();
        }
    }, [location]);

    if (post) {
        return (
            <div className="flex flex-col gap-10 p-4 max-w-[90%] mx-auto my-10">
                <PostSection post={post} scrollCallback={scrollToComments} />
                <CommentSection refProps={commentsRef} className="p-4" commentsCount={commentMocks.length}>
                    <CommentForm onSubmit={(comment) => alert(`Comment submitted: ${comment}`)} />
                    {commentMocks.map((comment) => (
                        <Comment key={comment.author} {...comment} />
                    ))}
                </CommentSection>
            </div>
        );
    } else {
        return <div className="flex flex-col gap-10 p-4 max-w-[90%] mx-auto my-10">Post not found.</div>;
    }
};

export default PostPage;