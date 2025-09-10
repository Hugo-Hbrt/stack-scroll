import Avatar, { AvatarSize } from "@components/Avatar/Avatar";
import Voter, { useVoter, voterLayout, voterSize, voterState, type voterCallbacks } from "@components/Voter/Voter";
import { twMerge } from "tailwind-merge";

interface CommentProps 
{
    author: string;
    content: string;
    votes: number;
    className?: string;
}

const Comment = ({author, content, votes, className}: CommentProps) => {

    const [voteState, voteCount, upvote, downvote] = useVoter(votes, voterState.None);
    
    const callbacks: voterCallbacks = {
        upvoteCallback: () => upvote(),
        downvoteCallback: () => downvote()
    }

    return (
        <div className={twMerge("border-t border-t-text-50 min-w-70 w-full pt-6", className)}>
            <div className="flex flex-row gap-3.5">
                <Avatar className={twMerge("flex-shrink-0", className)} username={author} size={AvatarSize.Medium}/>
                <div className="flex flex-col gap-3.5">
                    <p className="text-base text-text-50 font-family-sans font-semibold">u/{author}</p>
                    <p className="font-family-sans font-normal text-base">{content}</p>
                    <Voter state={voteState} voteCount={voteCount} layout={voterLayout.Horizontal} size={voterSize.Small} callbacks={callbacks}/>
                </div>
            </div>
        </div>
    );
}

export default Comment;