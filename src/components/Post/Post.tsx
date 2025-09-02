import { twMerge } from "tailwind-merge";

import Tag from "@components/Tag/Tag";
import Voter, { useVoter, voterSize, voterState, type voterCallbacks } from "@components/Voter/Voter";
import Button from "@components/Button/Button";
import CommentsIcon from "@assets/images/comments_icon.svg";
import { useScreenSize, ScreenSize } from "@utils/hooks/useScreenSize";

export interface PostProps {
    tag: string;
    title: string;
    content: string;
    author: string;
    commentsCount: number;
    initialVoteCount: number;
    className?: string;
}

const Post = ({ tag, title, content, author, commentsCount, initialVoteCount, className }: PostProps) => {

    const screenSize = useScreenSize();
    const [voteState, voteCount, handleUpvote, handleDownvote] = useVoter(initialVoteCount, voterState.None);

    const callbacks: voterCallbacks = {
        upvoteCallback: handleUpvote,
        downvoteCallback: handleDownvote,
    }

    const ViewPostButton = ({className} : {className?: string}) => {
        return (<Button className={twMerge("whitespace-nowrap font-family-sans text-text-50 font-normal text-[16px] bg-accent-base hover:bg-accent-700 rounded-[7px] px-2", className)}
            onClick={() => console.log("View Post")}>
                View Post
                </Button>);
    }

    if (screenSize === ScreenSize.Mobile) { /* Mobile Layout */
        return (
            <div className={twMerge("p-4 border-1 border-text-600 rounded-3xl md:hidden min-w-md", className)}>
                <div className="flex flex-row gap-2">
                    <Voter className="self-center" voteCount={voteCount} callbacks={callbacks} size={voterSize.Large} state={voteState}></Voter>
                    <div className="flex flex-col gap-2.5 basis-[92%]">
                        <div className="flex flex-row gap-2.5 items-center">
                            <Tag text={tag}></Tag>
                            <p className="font-family-sans font-medium text-[16px] text-text-base"> by {author}</p>
                        </div>
                        <p className="text-xl font-family-sans font-semibold text-text-50 max-w-4xs line-clamp-2">{title}</p>
                        <div className="flex flex-row gap-2.5 justify-between">
                            <button className="font-family-sans font-medium text-[16px] text-text-base">
                                <CommentsIcon className="inline mr-1"/>
                                {commentsCount ? commentsCount : 0} comment{commentsCount > 1 ? "s" : ""} 
                            </button>
                            <ViewPostButton />
                        </div>
                    </div>
                </div>
            </div>
        );
    } else { /* Desktop layout */
        return (
            <div className={twMerge("hidden md:block p-4 border-1 border-text-600 rounded-3xl max-w-[1034px] max-h-[220px]", className)}>
                <div className="flex flex-row gap-2">
                    <div className="flex flex-col gap-2.5 basis-[92%] min-w-3xl max-w-4xl">
                        <Tag text={tag}></Tag>
                        <p className="text-2xl font-family-sans font-semibold text-text-50 truncate">{title}</p>
                        <p className="font-family-sans font-light text-sm text-text-300 line-clamp-3">{content}</p>
                        <div className="flex gap-2.5">
                            <p className="font-family-sans font-medium text-[16px] text-text-base"> by {author}</p>
                            <button className="font-family-sans font-medium text-[16px] text-text-base"> 
                                <CommentsIcon className="inline mr-1"/>
                                {commentsCount ? commentsCount : 0} comment{commentsCount > 1 ? "s" : ""} 
                            </button>
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

export default Post;