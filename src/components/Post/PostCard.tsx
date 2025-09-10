import { twMerge } from "tailwind-merge";

import Tag from "@components/Tag/Tag";
import Voter, { useVoter, voterSize, voterState, type voterCallbacks } from "@components/Voter/Voter";
import Button from "@components/Button/Button";
import CommentsIcon from "@assets/images/comments_icon.svg";
import { useScreenSize, ScreenSize } from "@utils/hooks/useScreenSize";
import type { Post } from "@models/Post";

export interface PostCardProps {
    post: Post;
    onViewPost: () => void;
    onViewComments: () => void;
    className?: string;
}

const PostCard = ({ post, onViewPost, onViewComments, className }: PostCardProps) => {

    const screenSize = useScreenSize();
    const [voteState, voteCount, handleUpvote, handleDownvote] = useVoter(post.initialVoteCount, voterState.None);

    const callbacks: voterCallbacks = {
        upvoteCallback: handleUpvote,
        downvoteCallback: handleDownvote,
    }

    const ViewPostButton = () => {
        return (<Button 
            data-testid="view-post-btn" 
            className={twMerge("whitespace-nowrap font-family-sans text-text-50 font-normal text-[16px] bg-accent-base hover:bg-accent-700 rounded-[7px] px-2")}
            onClick={onViewPost}>
            View Post
        </Button>);
    }

    const CommentsButton = () => {
        return (<Button
            data-testid="view-comments-btn"
            className="font-family-sans font-medium text-[16px] text-text-base bg-background-base hover:bg-background-950"
            onClick={onViewComments}>
            <CommentsIcon className="inline mr-1" />
            {post.commentsCount} comment{post.commentsCount > 1 ? "s" : ""}
        </Button>);
    }

    if (screenSize === ScreenSize.Mobile) { /* Mobile Layout */
        return (
            <div className={twMerge("bg-background-base p-4 border-1 border-text-600 rounded-3xl md:hidden min-w-md", className)}>
                <div className="flex flex-row gap-2">
                    <Voter className="self-center" voteCount={voteCount} callbacks={callbacks} size={voterSize.Large} state={voteState}></Voter>
                    <div className="flex flex-col gap-2.5 basis-[92%]">
                        <div className="flex flex-row gap-2.5 items-center">
                            <Tag data-testid="post-tag" text={post.tag}></Tag>
                            <p className="font-family-sans font-medium text-[16px] text-text-base"> by u\{post.author}</p>
                        </div>
                        <p className="text-xl font-family-sans font-semibold text-text-50 max-w-4xs line-clamp-2">{post.title}</p>
                        <div className="flex flex-row gap-2.5 justify-between">
                            <CommentsButton />
                            <ViewPostButton />
                        </div>
                    </div>
                </div>
            </div>
        );
    } else { /* Desktop layout */
        return (
            <div className={twMerge("bg-background-base hidden md:block p-4 border-1 border-text-600 rounded-3xl max-w-[1034px] max-h-[220px]", className)}>
                <div className="flex flex-row gap-2">
                    <div className="flex flex-col gap-2.5 basis-[92%] min-w-3xl max-w-4xl">
                        <Tag data-testid="post-tag" text={post.tag}></Tag>
                        <p className="text-2xl font-family-sans font-semibold text-text-50 truncate">{post.title}</p>
                        <p className="font-family-sans font-light text-sm text-text-300 line-clamp-3">{post.content}</p>
                        <div className="flex gap-2.5 items-center">
                            <p className="font-family-sans font-medium text-[16px] text-text-base"> by u\{post.author}</p>
                            <CommentsButton />
                        </div>
                    </div>
                    <div className="flex flex-col justify-between">
                        <Voter className="self-end" voteCount={voteCount} callbacks={callbacks} state={voteState}></Voter>
                        <ViewPostButton />
                    </div>
                </div>
            </div>
        );
    }
}

export default PostCard;