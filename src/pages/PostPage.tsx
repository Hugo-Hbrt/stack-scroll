import CommentSection from "@components/Comments/CommentSection";
import CommentForm from "@components/Comments/CommentForm";
import Comment from "@components/Comments/Comment";
import PostSection from "@components/Post/PostSection";
import LoadingPostSection from "@components/Post/LoadingPostSection";
import AppLogo, { AppLogoSize } from "@components/AppLogo/AppLogo";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useParams } from "react-router";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import { fetchCommentsByPostId } from "../store/commentsSlice";
import { fetchPostById } from "../store/postsSlice";

const PostPage = () => {
    const { postId } = useParams<{ postId: string }>();
    const postIdNumber = useMemo(() => Number(postId), [postId]);

    const dispatch = useAppDispatch();
    const { posts, loading: postsLoading } = useAppSelector((state) => state.posts);
    const { commentsByPostId, loading: commentsLoading } = useAppSelector((state) => state.comments);
    const location = useLocation();
    const [hasFetchedComments, setHasFetchedComments] = useState(false);
    const [hasFetchedPost, setHasFetchedPost] = useState(false);

    const post = useMemo(() => posts.find((post) => post.id === postIdNumber), [posts, postIdNumber]);
    const comments = useMemo(() => commentsByPostId[postIdNumber] || [], [commentsByPostId, postIdNumber]);

    const commentsRef = useRef<HTMLDivElement>(null);
    const scrollToComments = useCallback(() => {
        commentsRef?.current?.scrollIntoView({ behavior: "smooth" });
    }, []);

    // Fetch post if not in store
    useEffect(() => {
        if (!post && postIdNumber && !hasFetchedPost) {
            setHasFetchedPost(true);
            dispatch(fetchPostById(postIdNumber));
        }
    }, [post, postIdNumber, hasFetchedPost]);

    // Reset post fetch flag when postId changes
    useEffect(() => {
        setHasFetchedPost(false);
    }, [postId]);

    // Fetch comments if needed
    useEffect(() => {
        if (post && post.commentsCount > comments.length && !commentsLoading && !hasFetchedComments) {
            setHasFetchedComments(true);
            dispatch(fetchCommentsByPostId(postIdNumber));
        }
    }, [post?.id, post?.commentsCount, comments.length, commentsLoading, hasFetchedComments, postIdNumber]);

    // Reset fetch flag when post changes
    useEffect(() => {
        setHasFetchedComments(false);
    }, [postId]);

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
            {(postsLoading && !post) ? <LoadingPostSection /> : (post ? <PostSection post={post} scrollCallback={scrollToComments} /> : <PostNotFound />)}

            {post && <CommentSection refProps={commentsRef} className="p-4" commentsCount={comments.length}>
                <CommentForm onSubmit={(comment) => alert(`Comment submitted: ${comment}`)} />
                {commentsLoading && (
                    <div
                        data-testid="comments-loading-spinner"
                        className="flex justify-center my-4"
                        role="status"
                        aria-live="polite"
                        aria-label="Loading comments"
                    >
                        <AppLogo size={AppLogoSize.Medium} className="animate-spin" />
                    </div>
                )}
                {comments.map((comment) => (
                    <Comment key={comment.id} {...comment} />
                ))}
            </CommentSection>}
        </div>
    );
};

export default PostPage;