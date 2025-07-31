import UpvoteIcon from "@assets/images/upvote_icon.svg";
import DownvoteIcon from "@assets/images/downvote_icon.svg";

import tw from "@utils/tw";
import { twMerge } from 'tailwind-merge'
import { useState } from "react";

// Types
export type voterCallbacks = {
    upvoteCallback: () => void;
    downvoteCallback: () => void;
};

export enum voterState {
    None = "none",
    Upvote = "upvote",
    Downvote = "downvote"
}

export enum voterLayout {
    Vertical = "vertical",
    Horizontal = "horizontal"
}

export enum voterSize {
    Small = "sm",
    Medium = "md",
    Large = "lg"
}

export interface VoterProps {
    layout?: voterLayout;
    voteCount: number;
    callbacks: voterCallbacks;
    state?: voterState;
    className?: string;
    size?: voterSize;
}

const sizeClasses = {
    [voterSize.Small]: {
        icon: "w-4 h-4",
        text: "text-xs",
    },
    [voterSize.Medium]: {
        icon: "w-5 h-5",
        text: "text-sm",
    },
    [voterSize.Large]: {
        icon: "w-6 h-6",
        text: "text-base",
    },
};

// Styling for the SVG icons
const activeClass = tw("fill-accent-base stroke-accent-base")
const inactiveClass = tw("fill-none stroke-text-base")

const Voter = ({ layout = voterLayout.Vertical, size = voterSize.Medium, voteCount: value, callbacks, state, className }: VoterProps) => {

    const isVertical = layout === voterLayout.Vertical;
    const currentSize = sizeClasses[size];

    const containerClasses = twMerge(
        `flex ${isVertical ? "flex-col" : "flex-row"} items-center flex-nowrap w-min m-1`,
        className
    );

    const buttonStyles = tw("p-0 bg-transparent hover:bg-transparent");

    const renderButton = (type: "upvote" | "downvote") => {
        const Icon = type === "upvote" ? UpvoteIcon : DownvoteIcon;
        const isActive = state === type;

        const clickHandler = type === "upvote" ? callbacks.upvoteCallback : callbacks.downvoteCallback;
        return (
            <button
                onClick={clickHandler}
                className={buttonStyles}
                aria-label={type}
            >
                <Icon data-testid={"button-"+type+"-icon"} className={twMerge(isActive ? activeClass : inactiveClass, currentSize.icon)} />
            </button>
        );
    }

    return (
        <div className={containerClasses}>
            {isVertical ? (
                <>
                    {renderButton("upvote")}
                    <p className={twMerge("text-center my-0.5", currentSize.text)}>{value}</p>
                    {renderButton("downvote")}
                </>
            ) : (
                <>
                    {renderButton("downvote")}
                    <p className={twMerge("text-center mx-0.5", currentSize.text)}>{value}</p>
                    {renderButton("upvote")}
                </>
            )}
        </div>
    );
}

export default Voter;

export type useVoterReturn = readonly [voterState, number, () => void, () => void];

export function useVoter(initialVoteCount: number, initialVoteState: voterState): useVoterReturn {
    const [state, setState] = useState(initialVoteState);
    const [voteCount, setVoteCount] = useState(initialVoteCount);

    const handleUpvote = () => {

        switch (state) {
            case voterState.None:
                setState(voterState.Upvote);
                setVoteCount(voteCount + 1);
                break;
            case voterState.Upvote:
                setState(voterState.None);
                setVoteCount(voteCount - 1);
                break;
            case voterState.Downvote:
                setState(voterState.Upvote);
                setVoteCount(voteCount + 2);
                break;
            default:
                const exhaustiveCheck: never = state; // Ensure all cases are handled
                throw new Error(`Unhandled voter state: ${exhaustiveCheck}`);
        }
    };

    const handleDownvote = () => {
        switch (state) {
            case voterState.None:
                setState(voterState.Downvote);
                setVoteCount(voteCount - 1);
                break;
            case voterState.Upvote:
                setState(voterState.Downvote);
                setVoteCount(voteCount - 2);
                break;
            case voterState.Downvote:
                setState(voterState.None);
                setVoteCount(voteCount + 1);
                break;
            default:
                const exhaustiveCheck: never = state; // Ensure all cases are handled
                throw new Error(`Unhandled voter state: ${exhaustiveCheck}`);
        }
    };

    return [state, voteCount, handleUpvote, handleDownvote] as const;
}