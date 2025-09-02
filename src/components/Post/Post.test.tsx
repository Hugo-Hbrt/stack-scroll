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

import Post from "./Post";
import type { PostProps } from "./Post";
import { useVoter, voterState } from "@components/Voter/Voter";

const defaultProps: PostProps = {
    tag: "React",
    title: "Test Title",
    content: "Test content for the post.",
    author: "John Doe",
    commentsCount: 5,
    onViewPost: vi.fn(),
    onViewComments: vi.fn(),
    initialVoteCount: 10,
};

import { useScreenSize, ScreenSize } from "@utils/hooks/useScreenSize";

describe("Post", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        cleanup();
    });

    const hasAllElements = () => {
        expect(screen.getByTestId("post-tag")).toHaveTextContent(defaultProps.tag);
        expect(screen.getByText(`by ${defaultProps.author}`)).toBeInTheDocument();
        expect(screen.getByText(defaultProps.title)).toBeInTheDocument();
        expect(screen.getByTestId("comments-icon")).toBeInTheDocument();
    	
        expect(screen.getByTestId("view-post-btn")).toBeInTheDocument();
    	expect(screen.getByTestId("view-comments-btn")).toBeInTheDocument();
                
        expect(screen.getByTestId("voter")).toBeInTheDocument();
    }

    it("renders mobile layout when screen size is mobile", () => {
        vi.mocked(useScreenSize).mockReturnValue(ScreenSize.Mobile);
        render(<Post {...defaultProps} />);

        hasAllElements();
    });

    it("renders desktop layout when screen size is desktop", () => {
        vi.mocked(useScreenSize).mockReturnValue(ScreenSize.Desktop);
        render(<Post {...defaultProps} />);

        hasAllElements();
    });

    it("calls upvote and downvote callbacks when voter buttons are clicked", () => {
        vi.mocked(useScreenSize).mockReturnValue(ScreenSize.Mobile);
        render(<Post {...defaultProps} />);
        const upvoteBtn = screen.getByTestId("upvote");
        const downvoteBtn = screen.getByTestId("downvote");
        
        fireEvent.click(upvoteBtn);
        expect(voterCallbacks.upvoteCallback).toHaveBeenCalled();

        fireEvent.click(downvoteBtn);
        expect(voterCallbacks.downvoteCallback).toHaveBeenCalled();
    });

    it("shows correct comment count and pluralization", () => {
    	vi.mocked(useScreenSize).mockReturnValue(ScreenSize.Desktop);
    	render(<Post {...defaultProps} commentsCount={1} />);
    	expect(screen.getByText("1 comment")).toBeInTheDocument();
    	render(<Post {...defaultProps} commentsCount={2} />);
    	expect(screen.getByText("2 comments")).toBeInTheDocument();
    });

    it("calls the provided onViewPost handler when View Post button is clicked", () => {
        vi.mocked(useScreenSize).mockReturnValue(ScreenSize.Mobile);
    	const onViewPost = vi.fn();
    	render(<Post {...defaultProps} onViewPost={onViewPost} />);
    	fireEvent.click(screen.getByTestId("view-post-btn"));
    	expect(onViewPost).toHaveBeenCalled();
    });

    // test viewComments callback
    it("calls the provided onViewComments handler when View Comments button is clicked", () => {
        vi.mocked(useScreenSize).mockReturnValue(ScreenSize.Mobile);
    	const onViewComments = vi.fn();
    	render(<Post {...defaultProps} onViewComments={onViewComments} />);
    	fireEvent.click(screen.getByTestId("view-comments-btn"));
    	expect(onViewComments).toHaveBeenCalled();
    });

});
