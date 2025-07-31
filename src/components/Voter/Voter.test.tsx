import { describe, expect, it, vi, afterEach, beforeEach, beforeAll, afterAll } from 'vitest';
import { cleanup, render, screen, fireEvent, renderHook, act } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import Voter, { voterState, useVoter, voterSize } from '@components/Voter/Voter';
import { voterLayout, type voterCallbacks, type useVoterReturn, type VoterProps } from '@components/Voter/Voter';

function getSvgByTestId(testId: string): SVGSVGElement {
    const element = screen.getByTestId(testId);
    if (!(element instanceof SVGSVGElement)) {
        throw new Error(`Element with testId=${testId} is not an SVGSVGElement`);
    }
    return element;
}

describe('Voter component', () => {

    interface voterPropsOverrides {
        layout?: voterLayout;
        voteCount?: number;
        callbacks?: voterCallbacks;
        state?: voterState;
        className?: string;
        size?: voterSize;
    }

    const setup = (propsOverrides: voterPropsOverrides = {}) => {
        const upvoteCallback = vi.fn();
        const downvoteCallback = vi.fn();

        const props: VoterProps = {
            layout: voterLayout.Vertical,
            voteCount: 0,
            callbacks: { upvoteCallback, downvoteCallback },
            state: voterState.None,
            ...propsOverrides,
        };

        render(<Voter {...props} />);
        return { upvoteCallback, downvoteCallback };
    };

    const dummyVoteCount = 1234;

    describe('base render', () => {

        afterEach(() => {
            cleanup();
        });

        it('renders the value passed as prop', () => {

            setup({ voteCount: dummyVoteCount });
            const valueElement = screen.getByText(dummyVoteCount.toString());
            expect(valueElement).toBeInTheDocument();
        });

        it('renders the upvote button', () => {
            setup();
            const upvoteButton = screen.getByRole("button", { name: "upvote" });
            expect(upvoteButton).toBeInTheDocument();
        });

        it('renders the downvote button', () => {
            setup();
            const downvoteButton = screen.getByRole("button", { name: "downvote" });
            expect(downvoteButton).toBeInTheDocument();
        });
    })

    describe('layout', () => {
        afterEach(() => {
            cleanup();
        });

        it("renders correctly in vertical", () => {
            setup({ voteCount: dummyVoteCount, layout: voterLayout.Vertical });

            expect(screen.getByText(dummyVoteCount.toString())).toBeInTheDocument();
            expect(screen.getAllByRole("button")).toHaveLength(2);
        });

        it("renders correctly in horizontal", () => {
            setup({ voteCount: dummyVoteCount, layout: voterLayout.Horizontal });

            expect(screen.getByText(dummyVoteCount.toString())).toBeInTheDocument();
            expect(screen.getAllByRole("button")).toHaveLength(2);
        });
    });

    describe('size', () => {
        afterEach(() => {
            cleanup();
        });

        const getTextAndIcons = () => {
            const text = screen.getByText(dummyVoteCount.toString());
            const upvoteIcon = getSvgByTestId("button-upvote-icon");
            const downvoteIcon = getSvgByTestId("button-downvote-icon");

            return [text, upvoteIcon, downvoteIcon];
        };

        it("renders correctly in small size", () => {
            setup({ voteCount: dummyVoteCount, size: voterSize.Small });

            const [text, upvoteIcon, downvoteIcon] = getTextAndIcons();

            expect(screen.getByText(dummyVoteCount.toString())).toBeInTheDocument();
            expect(screen.getAllByRole("button")).toHaveLength(2);

            expect(text.classList).toContain("text-xs")
            expect(upvoteIcon.classList).toContain("w-4");
            expect(upvoteIcon.classList).toContain("h-4");
            expect(downvoteIcon.classList).toContain("w-4");
            expect(downvoteIcon.classList).toContain("h-4");
        });

        it("renders correctly in medium size", () => {
            setup({ voteCount: dummyVoteCount, size: voterSize.Medium });

            const [text, upvoteIcon, downvoteIcon] = getTextAndIcons();

            expect(screen.getByText(dummyVoteCount.toString())).toBeInTheDocument();
            expect(screen.getAllByRole("button")).toHaveLength(2);

            expect(text.classList).toContain("text-sm")
            expect(upvoteIcon.classList).toContain("w-5");
            expect(upvoteIcon.classList).toContain("h-5");
            expect(downvoteIcon.classList).toContain("w-5");
            expect(downvoteIcon.classList).toContain("h-5");
        });

        it("renders correctly in large size", () => {
            setup({ voteCount: dummyVoteCount, size: voterSize.Large });

            const [text, upvoteIcon, downvoteIcon] = getTextAndIcons();

            expect(screen.getByText(dummyVoteCount.toString())).toBeInTheDocument();
            expect(screen.getAllByRole("button")).toHaveLength(2);

            expect(text.classList).toContain("text-base")
            expect(upvoteIcon.classList).toContain("w-6");
            expect(upvoteIcon.classList).toContain("h-6");
            expect(downvoteIcon.classList).toContain("w-6");
            expect(downvoteIcon.classList).toContain("h-6");
        })
    });

    describe('callbacks', () => {
        let upvoteCallback = vi.fn();
        let downvoteCallback = vi.fn();

        beforeAll(() => {
            ({ upvoteCallback, downvoteCallback } = setup());
        });

        afterAll(() => {
            cleanup();
        })

        it("calls upvoteCallback on upvote button click", () => {
            const upvoteButton = screen.getByLabelText("upvote");
            fireEvent.click(upvoteButton);
            expect(upvoteCallback).toHaveBeenCalledOnce();
        });

        it("calls downvoteCallback on downvote button click", () => {
            const downvoteButton = screen.getByLabelText("downvote");
            fireEvent.click(downvoteButton);
            expect(downvoteCallback).toHaveBeenCalledOnce();
        });
    });

    describe('when state is none', () => {
        beforeAll(() => {
            setup({ state: voterState.None });
        });

        afterAll(() => {
            cleanup();
        });

        it("applies default style to both upvote and downvote icons", () => {
            const upvoteIcon = getSvgByTestId("button-upvote-icon");
            const downvoteIcon = getSvgByTestId("button-downvote-icon");

            expect(upvoteIcon.classList).toContain("stroke-text-base");
            expect(upvoteIcon.classList).toContain("fill-none");

            expect(downvoteIcon.classList).toContain("stroke-text-base");
            expect(downvoteIcon.classList).toContain("fill-none");
        });

    });

    describe('when state is upvote', () => {
        beforeAll(() => {
            setup({ state: voterState.Upvote });
        });

        afterAll(() => {
            cleanup();
        });

        it("upvote button icon should be accent", () => {
            const upvoteIcon = getSvgByTestId("button-upvote-icon");
            expect(upvoteIcon.classList).toContain("fill-accent-base");
            expect(upvoteIcon.classList).toContain("stroke-accent-base");
        });

        it("downvote button icon should be default", () => {
            const downvoteIcon = getSvgByTestId("button-downvote-icon");
            expect(downvoteIcon.classList).toContain("stroke-text-base");
            expect(downvoteIcon.classList).toContain("fill-none");
        });
    });

    describe('when state is downvote', () => {
        beforeAll(() => {
            setup({ state: voterState.Downvote });
        });

        afterAll(() => {
            cleanup();
        });

        it("upvote button icon should be default", () => {
            const upvoteIcon = getSvgByTestId("button-upvote-icon");
            expect(upvoteIcon.classList).toContain("stroke-text-base");
            expect(upvoteIcon.classList).toContain("fill-none");
        });

        it("downvote button icon should be accent", () => {
            const downvoteIcon = getSvgByTestId("button-downvote-icon");
            expect(downvoteIcon.classList).toContain("stroke-accent-base");
            expect(downvoteIcon.classList).toContain("fill-accent-base");
        });
    });
});

describe('useVoter hook', () => {
    let result: { current: useVoterReturn };
    let unmount: () => void;
    const baseValue = 10 as number;

    describe('should initialize', () => {
        it('value with initial value passed in as param', () => {
            let initialVal = 1;

            ({ result, unmount } = renderHook(() => useVoter(initialVal, voterState.None)));
            const [_, count] = result.current;
            expect(count).toStrictEqual(initialVal);
            unmount();

            initialVal = 1234;
            ({ result, unmount } = renderHook(() => useVoter(initialVal, voterState.None)));
            const [_1, count1] = result.current;
            expect(count1).toStrictEqual(initialVal);
        });

        it('state with initial state passed in as param', () => {
            let initialState = voterState.None;

            ({ result, unmount } = renderHook(() => useVoter(0, initialState)));
            const [state] = result.current;
            expect(state).toStrictEqual(initialState);
            unmount();

            initialState = voterState.Upvote;
            ({ result, unmount } = renderHook(() => useVoter(0, initialState)));
            const [state0] = result.current;
            expect(state0).toStrictEqual(initialState);
            unmount();
        });
    });

    describe('when state is none', () => {
        beforeEach(() => {
            ({ result, unmount } = renderHook(() => useVoter(baseValue, voterState.None)));
        });

        afterEach(() => {
            unmount();
        });

        it('upvoting should update state to upvote', () => {
            act(() => {
                const [_0, _1, upvoteHandle] = result.current;
                upvoteHandle();
            });
            const [state] = result.current;
            expect(state).toStrictEqual(voterState.Upvote);
        });

        it('upvoting should increment value by 1', () => {
            act(() => {
                const [_0, _1, upvoteHandle] = result.current;
                upvoteHandle();
            });
            const [_state, count] = result.current;
            expect(count).toStrictEqual(baseValue + 1);
        });

        it('downvoting should update state to downvote', () => {
            act(() => {
                const [_0, _1, _2, downvoteHandle] = result.current;
                downvoteHandle();
            });

            const [state] = result.current;
            expect(state).toStrictEqual(voterState.Downvote);
        });

        it('downvoting should decrement base value by 1', () => {
            act(() => {
                const [_0, _1, _2, downvoteHandle] = result.current;
                downvoteHandle();
            });
            const [_state, count] = result.current;
            expect(count).toStrictEqual(baseValue - 1);
        });
    });

    describe('when state is upvote', () => {
        beforeEach(() => {
            ({ result, unmount } = renderHook(() => useVoter(baseValue, voterState.Upvote)));
        });

        afterEach(() => {
            unmount();
        });

        it('upvoting should reset state to none', () => {
            act(() => {
                const [_0, _1, upvoteHandle] = result.current;
                upvoteHandle();
            });
            const [state] = result.current;
            expect(state).toStrictEqual(voterState.None);
        });

        it('upvoting should decrement value by 1', () => {
            act(() => {
                const [_0, _1, upvoteHandle] = result.current;
                upvoteHandle();
            });
            const [_state, count] = result.current;
            expect(count).toStrictEqual(baseValue - 1);
        });

        it('downvoting should update state to downvote', () => {
            act(() => {
                const [_0, _1, _2, downvoteHandle] = result.current;
                downvoteHandle();
            });
            const [state] = result.current;
            expect(state).toStrictEqual(voterState.Downvote);
        });

        it('downvoting should decrement value by 2', () => {
            act(() => {
                const [_0, _1, _2, downvoteHandle] = result.current;
                downvoteHandle();
            });
            const [_state, count] = result.current;
            expect(count).toStrictEqual(baseValue - 2);
        });
    });

    describe('when state is downvote', () => {
        beforeEach(() => {
            ({ result, unmount } = renderHook(() => useVoter(baseValue, voterState.Downvote)));
        });

        afterEach(() => {
            unmount();
        });

        it('upvoting should update state to upvote', () => {
            act(() => {
                const [_0, _1, upvoteHandle] = result.current;
                upvoteHandle();
            });
            const [state] = result.current;
            expect(state).toStrictEqual(voterState.Upvote);
        });

        it('upvoting should increment value by 2', () => {
            act(() => {
                const [_0, _1, upvoteHandle] = result.current;
                upvoteHandle();
            });
            const [_state, count] = result.current;
            expect(count).toStrictEqual(baseValue + 2);
        });

        it('downvoting should reset state to none', () => {
            act(() => {
                const [_0, _1, _2, downvoteHandle] = result.current;
                downvoteHandle();
            });
            const [state] = result.current;
            expect(state).toStrictEqual(voterState.None);
        });

        it('downvoting should increment value by 1', () => {
            act(() => {
                const [_0, _1, _2, downvoteHandle] = result.current;
                downvoteHandle();
            });
            const [_state, count] = result.current;
            expect(count).toStrictEqual(baseValue + 1);
        });
    });
});