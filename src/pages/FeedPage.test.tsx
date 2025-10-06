import {
  vi,
  describe,
  it,
  expect,
  afterEach,
  beforeEach,
  assert,
} from "vitest";
import { setupStore } from "@store/store";
import "@testing-library/jest-dom/vitest";
import { createStoreState, renderWithProviders } from "@test/test.utils.tsx";
import { screen, waitFor } from "@testing-library/dom";
import FeedPage from "./FeedPage";
import { SUBREDDITS } from "@config/reddit";
import { cleanup, fireEvent } from "@testing-library/react";
import * as postsSlice from "@store/postsSlice";
import type { Post } from "@models/Post";
import { generateMultiplePosts } from "@models/PostHelper";
import { act } from "@testing-library/react";

enum TEST_ID {
  TagSelector = "tag-selector",
  PostCard = "post-card",
  LoadingSpinner = "loading-spinner",
  PostSubreddit = "post-subreddit",
  PostTitle = "post-title",
}

/* MOCKS */
vi.mock("@components/Post/PostCard", () => ({
  default: ({ post }: { post: Post }) => (
    <div data-testid={TEST_ID.PostCard}>
      <h1 data-testid={TEST_ID.PostTitle}>{post.title}</h1>
      <div data-testid={TEST_ID.PostSubreddit}>{post.subreddit}</div>
    </div>
  ),
}));

vi.mock("@components/TagSelector/TagSelector", () => ({
  default: ({
    text,
    selected,
    onClick,
  }: {
    text: string;
    selected: boolean;
    onClick: () => void;
  }) => (
    <div data-testid={TEST_ID.TagSelector} onClick={onClick}>
      {text}-{selected ? "selected" : ""}
    </div>
  ),
}));

vi.mock("@components/LoadingSpinner/LoadingSpinner", () => ({
  default: () => <div data-testid={TEST_ID.LoadingSpinner}></div>,
}));

vi.mock("@config/reddit", async () => {
  const actual = await vi.importActual("@config/reddit");
  return {
    ...actual,
    SUBREDDITS: ["subreddit1", "subreddit2", "subreddit3", "subreddit4"],
  };
});

/* This mock is useful to avoid requests from reddit API */
vi.mock("@api/reddit/fetchPosts", () => ({
  fetchPosts: vi.fn(() => Promise.resolve({ data: { children: [] } })),
}));

const testStore = setupStore({}, false);
const dispatchSpy = vi.spyOn(testStore, "dispatch");
const fetchPostsBySubRedditSpy = vi.spyOn(postsSlice, "fetchPostsBySubReddit");
const setSelectedSubRedditSpy = vi.spyOn(postsSlice, "setSelectedSubReddit");

describe("FeedPage", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    cleanup();
    expect(document.body.innerHTML).toBe("");
  });

  describe("Initial rendering", () => {
    it("should mount without errors", async () => {
      renderWithProviders(<FeedPage />, { store: testStore });
    });

    it("should display all tags from SUBREDDITS constant", () => {
      renderWithProviders(<FeedPage />, { store: testStore });
      const tags = screen.getAllByTestId(TEST_ID.TagSelector);
      expect(tags.length).toEqual(SUBREDDITS.length);
      SUBREDDITS.forEach((subreddit, index) => {
        expect(tags[index]).toHaveTextContent(subreddit);
      });
    });

    it("should trigger fetchPostsBySubReddit on mount with initial selectedSubReddit", async () => {
      renderWithProviders(<FeedPage />, { store: testStore });

      // Expect one and good dispatch.
      expect(dispatchSpy.mock.calls.length).toEqual(1);
      expect(fetchPostsBySubRedditSpy.mock.calls.length).toEqual(1);

      // Expect the action to have been called with right argument
      const initialSubreddit = testStore.getState().posts.selectedSubReddit;
      const [lastCallArg] = fetchPostsBySubRedditSpy.mock.lastCall ?? [0];
      expect(lastCallArg).toEqual(initialSubreddit);
    });

    it("should mark the correct tag as selected based on selectedSubReddit from store", () => {
      renderWithProviders(<FeedPage />, { store: testStore });
      const tags = screen.getAllByTestId(TEST_ID.TagSelector);
      const selected = tags.filter((el) => el.innerHTML.includes("selected"));

      const initialSubreddit = testStore.getState().posts.selectedSubReddit;

      assert(selected.length === 1, "Not only one selected tags");
      assert(
        selected[0].innerHTML.includes(initialSubreddit),
        "Selected tag is not the one in the store"
      );
    });
  });

  describe("Post filtering", () => {
    const mockPosts = generateMultiplePosts(SUBREDDITS, 50);
    const selectedSubreddit = SUBREDDITS[0];
    const storeState = createStoreState(
      {
        posts: mockPosts,
        loading: false,
        selectedSubReddit: selectedSubreddit,
      },
      {
        isAuthenticated: true,
      }
    );

    it("should only display posts whose subreddit matches selectedSubReddit", () => {
      renderWithProviders(<FeedPage />, {
        preloadedState: storeState,
      });
      const displayedPosts = screen.getAllByTestId(TEST_ID.PostSubreddit);
      expect(
        displayedPosts.every((post) => post.innerHTML === selectedSubreddit)
      ).to.be.true;
    });

    it("should limit display to MAX_NUMBER_OF_SHOWN_POSTS (maximum 10 posts)", () => {
      // Generate a list of 20 posts for subreddit.
      const mockPosts = generateMultiplePosts([selectedSubreddit], 20);
      renderWithProviders(<FeedPage />, {
        preloadedState: createStoreState(
          {
            posts: mockPosts,
            loading: false,
            selectedSubReddit: selectedSubreddit,
          },
          {
            isAuthenticated: true,
          }
        ),
      });
      const displayedPosts = screen.getAllByTestId(TEST_ID.PostCard);
      expect(displayedPosts.length).toEqual(10);
    });

    it("should update feedPosts when allPosts changes, when new post are fetched", () => {
      const mockPosts = generateMultiplePosts([selectedSubreddit], 12);
      const initialPosts = mockPosts.slice(0, 9);
      const newPosts = mockPosts.slice(9);

      const storeState = createStoreState(
        {
          posts: initialPosts,
          loading: false,
          selectedSubReddit: selectedSubreddit,
        },
        {
          isAuthenticated: true,
        }
      );

      const { store } = renderWithProviders(<FeedPage />, {
        preloadedState: storeState,
      });

      const postsBeforeUpdate = screen.getAllByTestId(TEST_ID.PostCard);

      // We call store dispatch inside an act wrapper to ensure component will be fully updated
      // at the end.
      act(() => {
        newPosts.forEach((post: Post) =>
          store.dispatch(postsSlice.addPost(post))
        );
      });

      const postsAfterUpdate = screen.getAllByTestId(TEST_ID.PostCard);
      expect(postsBeforeUpdate).not.toEqual(postsAfterUpdate);
    });

    it("should update feedPosts when selectedSubReddit changes", () => {
      const { store } = renderWithProviders(<FeedPage />, {
        preloadedState: storeState,
      });

      const postsBeforeUpdate = screen.getAllByTestId(TEST_ID.PostCard);

      // We call store dispatch inside an act wrapper to ensure component will be fully updated
      // at the end.
      const newSelectedSubreddit = SUBREDDITS[1];
      act(() => {
        store.dispatch(postsSlice.setSelectedSubReddit(newSelectedSubreddit));
      });

      const postsAfterUpdate = screen.getAllByTestId(TEST_ID.PostCard);
      expect(postsBeforeUpdate).not.toEqual(postsAfterUpdate);
    });
  });

  describe("Tag selection", () => {
    it("should dispatch setSelectedSubReddit with new tag when tag is clicked", () => {
      renderWithProviders(<FeedPage />, {
        preloadedState: createStoreState(
          {
            posts: [],
            loading: false,
            selectedSubReddit: SUBREDDITS[0],
          },
          {
            isAuthenticated: true,
          }
        ),
      });

      vi.clearAllMocks();

      const tags = screen.getAllByTestId(TEST_ID.TagSelector);
      const newTagIndex = 1;

      fireEvent.click(tags[newTagIndex]);

      expect(setSelectedSubRedditSpy).toHaveBeenCalledWith(
        SUBREDDITS[newTagIndex]
      );
    });

    it("should not dispatch setSelectedSubReddit if same tag is clicked", () => {
      const selectedSubreddit = SUBREDDITS[0];
      renderWithProviders(<FeedPage />, {
        preloadedState: createStoreState(
          {
            posts: [],
            loading: false,
            selectedSubReddit: selectedSubreddit,
          },
          {
            isAuthenticated: true,
          }
        ),
      });

      vi.clearAllMocks();

      const tags = screen.getAllByTestId(TEST_ID.TagSelector);

      fireEvent.click(tags[0]);

      expect(setSelectedSubRedditSpy).not.toHaveBeenCalled();
    });

    it("should pass selected=true to selected tag", () => {
      const selectedSubreddit = SUBREDDITS[2];
      renderWithProviders(<FeedPage />, {
        preloadedState: createStoreState(
          {
            posts: [],
            loading: false,
            selectedSubReddit: selectedSubreddit,
          },
          {
            isAuthenticated: true,
          }
        ),
      });

      const tags = screen.getAllByTestId(TEST_ID.TagSelector);
      const selectedTag = tags.find((tag) =>
        tag.innerHTML.includes(selectedSubreddit)
      );

      expect(selectedTag).toBeDefined();
      expect(selectedTag?.innerHTML).toContain("selected");
    });

    it("should pass selected=false to non-selected tags", () => {
      const selectedSubreddit = SUBREDDITS[0];
      renderWithProviders(<FeedPage />, {
        preloadedState: createStoreState(
          {
            posts: [],
            loading: false,
            selectedSubReddit: selectedSubreddit,
          },
          {
            isAuthenticated: true,
          }
        ),
      });

      const tags = screen.getAllByTestId(TEST_ID.TagSelector);
      const nonSelectedTags = tags.filter(
        (tag) => !tag.innerHTML.includes(selectedSubreddit)
      );

      nonSelectedTags.forEach((tag) => {
        expect(tag.innerHTML).not.toContain("selected");
      });
    });

    it("should call handleTagSelection with correct subreddit when TagSelector onClick is triggered", () => {
      renderWithProviders(<FeedPage />, {
        preloadedState: createStoreState(
          {
            posts: [],
            loading: false,
            selectedSubReddit: SUBREDDITS[0],
          },
          {
            isAuthenticated: true,
          }
        ),
      });

      vi.clearAllMocks();

      const tags = screen.getAllByTestId(TEST_ID.TagSelector);
      const targetTagIndex = 2;

      fireEvent.click(tags[targetTagIndex]);

      expect(setSelectedSubRedditSpy).toHaveBeenCalledWith(
        SUBREDDITS[targetTagIndex]
      );
      expect(setSelectedSubRedditSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe("Loading states", () => {
    it("should display LoadingSpinner when loading is true", () => {
      renderWithProviders(<FeedPage />, {
        preloadedState: createStoreState(
          {
            posts: [],
            loading: true,
            selectedSubReddit: SUBREDDITS[0],
          },
          {
            isAuthenticated: true,
          }
        ),
      });

      const spinner = screen.getByTestId(TEST_ID.LoadingSpinner);
      expect(spinner).toBeInTheDocument();
    });

    it("should not display LoadingSpinner when loading is false and there is enough posts", async () => {
      const mockPosts = generateMultiplePosts(SUBREDDITS, 50);
      const selectedSubreddit = SUBREDDITS[0];
      const storeState = createStoreState(
        {
          posts: mockPosts,
          loading: false,
          selectedSubReddit: selectedSubreddit,
        },
        {
          isAuthenticated: true,
        }
      );

      const { store } = renderWithProviders(<FeedPage />, {
        preloadedState: storeState,
      });

      await waitFor(() => {
        expect(store.getState().posts.loading).toBe(false);
      });

      const spinner = screen.queryByTestId(TEST_ID.LoadingSpinner);
      expect(spinner).not.toBeInTheDocument();
    });

    it("should display posts while loading", () => {
      const mockPosts = generateMultiplePosts([SUBREDDITS[0]], 5);
      renderWithProviders(<FeedPage />, {
        preloadedState: createStoreState(
          {
            posts: mockPosts,
            loading: true,
            selectedSubReddit: SUBREDDITS[0],
          },
          {
            isAuthenticated: true,
          }
        ),
      });

      const spinner = screen.getByTestId(TEST_ID.LoadingSpinner);
      expect(spinner).toBeInTheDocument();

      const posts = screen.queryAllByTestId(TEST_ID.PostCard);
      expect(posts.length).toBe(5);
    });
  });
});
