import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import '@testing-library/jest-dom/vitest';

// MOCKS 
vi.mock("@utils/hooks/useScreenSize", async () => {
    // Keep real enums/constants to avoid drift
    const actual = await vi.importActual<typeof import("@utils/hooks/useScreenSize")>(
        "@utils/hooks/useScreenSize"
    );
    return {
        ...actual,
        useScreenSize: vi.fn(), // we replace only the hook
    };
});

vi.mock("@components/Tag/Tag", () => ({
    default: ({ text }: { text: string }) => <div data-testid="post-tag">{text}</div>,
}));

const voterCallbacks = {
    upvoteCallback: vi.fn(),
    downvoteCallback: vi.fn(),
};

vi.mock("@components/Voter/Voter", async () => {
    const actual = await vi.importActual<typeof import("@components/Voter/Voter")>(
        "@components/Voter/Voter"
    );
    return {
        ...actual,
        default: ({ voteCount, callbacks, size, state, className }: any) => (
        <div data-testid="voter" data-votecount={voteCount} data-size={size} data-state={state} className={className}>
            <button data-testid="upvote" onClick={callbacks.upvoteCallback}>Upvote</button>
            <button data-testid="downvote" onClick={callbacks.downvoteCallback}>Downvote</button>
        </div>),
        useVoter: (initialVoteCount: number, initialState: any) => [initialState, initialVoteCount, voterCallbacks.upvoteCallback, voterCallbacks.downvoteCallback],
    }
});

vi.mock("@components/Button/Button", () => ({
    default: ({ children, ...props }: any) => <button data-testid="button" {...props}>{children}</button>,
}));

vi.mock("@assets/images/comments_icon.svg", () => ({
    default: () => <span data-testid="comments-icon" />,
}));

import PostCard from "@components/Post/PostCard";
import type { PostCardProps } from "@components/Post/PostCard";
import { Post } from "@models/Post";

const defaultPost: Post = {
    tag: "React",
    title: "Test Title",
    content: "Test content for the post.",
    author: "John Doe",
    commentsCount: 5,
    initialVoteCount: 10,
}

const defaultProps: PostCardProps = {
    post: defaultPost,
    onViewPost: vi.fn(),
    onViewComments: vi.fn(),
};

import { useScreenSize, ScreenSize } from "@utils/hooks/useScreenSize";

describe("Post", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        cleanup();
    });

    const hasAllElements = () => {
        expect(screen.getByTestId("post-tag")).toHaveTextContent(defaultPost.tag);
        expect(screen.getByText(`by u\\${defaultPost.author}`)).toBeInTheDocument();
        expect(screen.getByText(defaultPost.title)).toBeInTheDocument();
        expect(screen.getByTestId("comments-icon")).toBeInTheDocument();
    	
        expect(screen.getByTestId("view-post-btn")).toBeInTheDocument();
    	expect(screen.getByTestId("view-comments-btn")).toBeInTheDocument();
                
        expect(screen.getByTestId("voter")).toBeInTheDocument();
    }

    it("renders mobile layout when screen size is mobile", () => {
        vi.mocked(useScreenSize).mockReturnValue(ScreenSize.Mobile);
        render(<PostCard {...defaultProps} />);

        hasAllElements();
    });

    it("renders desktop layout when screen size is desktop", () => {
        vi.mocked(useScreenSize).mockReturnValue(ScreenSize.Desktop);
        render(<PostCard {...defaultProps} />);

        hasAllElements();
    });

    it("calls upvote and downvote callbacks when voter buttons are clicked", () => {
        vi.mocked(useScreenSize).mockReturnValue(ScreenSize.Mobile);
        render(<PostCard {...defaultProps} />);
        const upvoteBtn = screen.getByTestId("upvote");
        const downvoteBtn = screen.getByTestId("downvote");
        
        fireEvent.click(upvoteBtn);
        expect(voterCallbacks.upvoteCallback).toHaveBeenCalled();

        fireEvent.click(downvoteBtn);
        expect(voterCallbacks.downvoteCallback).toHaveBeenCalled();
    });

    it("shows correct comment count and pluralization", () => {
    	vi.mocked(useScreenSize).mockReturnValue(ScreenSize.Desktop);
    	render(<PostCard {...defaultProps} post={{ ...defaultPost, commentsCount: 1 }} />);
    	expect(screen.getByText("1 comment")).toBeInTheDocument();
    	render(<PostCard {...defaultProps} post={{ ...defaultPost, commentsCount: 2 }} />);
    	expect(screen.getByText("2 comments")).toBeInTheDocument();
    });

    it("calls the provided onViewPost handler when View Post button is clicked", () => {
        vi.mocked(useScreenSize).mockReturnValue(ScreenSize.Mobile);
    	const onViewPost = vi.fn();
    	render(<PostCard {...defaultProps} onViewPost={onViewPost} />);
    	fireEvent.click(screen.getByTestId("view-post-btn"));
    	expect(onViewPost).toHaveBeenCalled();
    });

    // test viewComments callback
    it("calls the provided onViewComments handler when View Comments button is clicked", () => {
        vi.mocked(useScreenSize).mockReturnValue(ScreenSize.Mobile);
    	const onViewComments = vi.fn();
    	render(<PostCard {...defaultProps} onViewComments={onViewComments} />);
    	fireEvent.click(screen.getByTestId("view-comments-btn"));
    	expect(onViewComments).toHaveBeenCalled();
    });

});
