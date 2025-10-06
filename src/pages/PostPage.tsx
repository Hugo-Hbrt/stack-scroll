import CommentSection from "@components/Comments/CommentSection";
import CommentForm from "@components/Comments/CommentForm";
import Comment from "@components/Comments/Comment";
import PostSection from "@components/Post/PostSection";
import LoadingPostSection from "@components/Post/LoadingPostSection";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { useLocation, useParams } from "react-router";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import { fetchCommentsByPostId } from "../store/commentsSlice";
import { fetchPostById } from "../store/postsSlice";
import LoadingSpinner from "@components/LoadingSpinner/LoadingSpinner";

const PostPage = () => {
    const { postId } = useParams<{ postId: string }>();
    const postIdNumber = useMemo(() => Number(postId), [postId]);

    const dispatch = useAppDispatch();
    const { posts, loading: postLoading } = useAppSelector((state) => state.posts);
    const { commentsByPostId, loading: commentsLoading } = useAppSelector((state) => state.comments);
    const location = useLocation();

    const post = useMemo(() => posts.find((post) => post.id === postIdNumber), [posts, postIdNumber]);
    const comments = useMemo(() => commentsByPostId[postIdNumber] || [], [commentsByPostId, postIdNumber]);

    const commentsRef = useRef<HTMLDivElement>(null);
    const scrollToComments = useCallback(() => {
        commentsRef?.current?.scrollIntoView({ behavior: "smooth" });
    }, []);

    // Fetch post if not in store
    useEffect(() => {
        if (!post && postIdNumber && !postLoading) {
            dispatch(fetchPostById(postIdNumber));
        }
    }, [postIdNumber]);

    // Fetch comments if needed
    useEffect(() => {
        if (post && (post.commentsCount > comments.length) && !commentsLoading) {
            dispatch(fetchCommentsByPostId({
                subreddit: post.subreddit,
                postId: post.redditId,
                numericPostId: postIdNumber
            }));
        }
    }, [postIdNumber]);

    useEffect(() => {
        if (location.hash === "#comments") {
            scrollToComments();
        }
    }, [location, scrollToComments]);

    const PostNotFound = () => {
        return <div className="flex flex-col gap-10 p-4 max-w-[90%] mx-auto my-10">Post not found.</div>;
    }

    return (
        <div className="flex flex-col gap-10 p-4 max-w-[90%] mx-auto my-10">
            {(postLoading && !post) ? <LoadingPostSection /> : (post ? <PostSection post={post} scrollCallback={scrollToComments} /> : <PostNotFound />)}

            {post && <CommentSection refProps={commentsRef} className="p-4" commentsCount={comments.length}>
                <CommentForm onSubmit={(comment) => alert(`Comment submitted: ${comment}`)} />
                {commentsLoading && <LoadingSpinner />}
                {comments.map((comment) => (
                    <Comment key={comment.id} {...comment} />
                ))}
            </CommentSection>}
        </div>
    );
};

export default PostPage;