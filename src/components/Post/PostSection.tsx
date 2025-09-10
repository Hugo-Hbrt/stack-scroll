import Tag from "@components/Tag/Tag";
import Voter, { useVoter, voterState } from "@components/Voter/Voter";
import { Post } from "@models/Post";
import Button from "@components/Button/Button";
import CommentsIcon from "@assets/images/comments_icon.svg";
import { twMerge } from "tailwind-merge";

export interface PostSectionProps {
    post: Post;
    className?: string;
    scrollCallback?: () => void;
}

const PostSection = ({post, className, scrollCallback} : PostSectionProps) => {

    const [voteState, voteCount, handleUpvote, handleDownvote] = useVoter(post.initialVoteCount, voterState.None);
    const voterCallbacks = {
        upvoteCallback: handleUpvote,
        downvoteCallback: handleDownvote,
    }

    const CommentsButton = () => {
        return (
        <Button
            data-testid="view-comments-btn"
            className="font-family-sans font-medium text-[16px] text-text-base bg-background-base hover:bg-background-950 text-nowrap"
            onClick={scrollCallback ? scrollCallback : () => {}}
        >
            <CommentsIcon className="inline mr-1" />
            {post.commentsCount} comment{post.commentsCount > 1 ? "s" : ""}
        </Button>);
    }

    return (
        <div className={twMerge("flex flex-col gap-10 p-[22px] rounded-[9px] border border-text-50 font-family-sans", className)}>
            <div className="flex flex-row justify-between">
                <div className="flex flex-col gap-4">
                    <div className="flex flex-row max-w gap-[30px]">
                        <Tag text={post.tag} />
                        <span className="text-[15px]/8 text-nowrap text-text-base font-semibold"> by {post.author}</span>
                    </div>
                    <p className="text-[40px] font-semibold text-text-50">{post.title}</p>
                </div>
                <Voter voteCount={voteCount} state={voteState} callbacks={voterCallbacks} />
            </div>
            <p className="font-medium text-[20px] leading-[1.2] text-text-base whitespace-pre-line">{post.content}</p>
            <CommentsButton/>
        </div>
    );
}

export default PostSection;