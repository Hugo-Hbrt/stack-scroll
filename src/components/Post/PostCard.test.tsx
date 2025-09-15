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

vi.mock("@assets/images/comments_icon.svg", () => ({
    default: () => <span data-testid="comments-icon" />,
}));

import PostCard from "@components/Post/PostCard";
import type { PostCardProps } from "@components/Post/PostCard";
import type { Post } from "@models/Post";

const defaultPost: Post = {
    id: 1,
    tag: "React",
    title: "Test Title",
    content: "Test content for the post.",
    author: "John Doe",
    commentsCount: 5,
    initialVoteCount: 10,
}

const defaultProps: PostCardProps = {
    post: defaultPost,
};

import { useScreenSize, ScreenSize } from "@utils/hooks/useScreenSize";
import { MemoryRouter, Route, Routes, useLocation } from "react-router";
interface RenderProps {
    post?: Post;
    className?: string;
}

describe("Post", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        cleanup();
    });

    const renderComponent = (props?: RenderProps) => {
        
        // This component serves as a location spy to be able to test location.
        function LocationSpy() {
            const location = useLocation();
            return (
                <div data-testid="location">
                    {location.pathname}
                    {location.hash}
                </div>
            );
        }

        return render(
            <MemoryRouter>
                <Routes>
                    <Route path="/" element={<PostCard  {...defaultProps} {...props} />} />
                    <Route path="/post/:id" element={<LocationSpy />} />
                </Routes>
            </MemoryRouter>
        );
    }

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
        renderComponent();
        hasAllElements();
    });

    it("renders desktop layout when screen size is desktop", () => {
        vi.mocked(useScreenSize).mockReturnValue(ScreenSize.Desktop);
        renderComponent();
        hasAllElements();
    });

    it("calls upvote and downvote callbacks when voter buttons are clicked", () => {
        vi.mocked(useScreenSize).mockReturnValue(ScreenSize.Mobile);
        renderComponent();

        const upvoteBtn = screen.getByTestId("upvote");
        const downvoteBtn = screen.getByTestId("downvote");

        fireEvent.click(upvoteBtn);
        expect(voterCallbacks.upvoteCallback).toHaveBeenCalled();

        fireEvent.click(downvoteBtn);
        expect(voterCallbacks.downvoteCallback).toHaveBeenCalled();
    });

    for (let test of [
        { commentsCount: 1, expectedText: "1 comment" },
        { commentsCount: 2, expectedText: "2 comments" },
    ]) {
        it(`renders "${test.expectedText}" for comment count = ${test.commentsCount}`, () => {
            vi.mocked(useScreenSize).mockReturnValue(ScreenSize.Desktop);
            renderComponent({ post: { ...defaultPost, commentsCount: test.commentsCount } });
            expect(screen.getByText(test.expectedText)).toBeInTheDocument();
        });
    }

    it("navigate to /post with correct post id when View Post button is clicked", () => {
        vi.mocked(useScreenSize).mockReturnValue(ScreenSize.Mobile);
        renderComponent();
        fireEvent.click(screen.getByTestId("view-post-btn"));
        expect(screen.getByTestId("location")).toHaveTextContent(`/post/${defaultPost.id}`);
    });

    it("navigate to /post when comment button is clicked with comments as hash", () => {
        vi.mocked(useScreenSize).mockReturnValue(ScreenSize.Mobile);
        renderComponent();
        fireEvent.click(screen.getByTestId("view-comments-btn"));
        expect(screen.getByTestId("location")).toHaveTextContent(`/post/${defaultPost.id}#comments`);
    });
});
