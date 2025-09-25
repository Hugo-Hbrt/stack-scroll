import { vi, describe, it, expect, afterEach, beforeEach, assert } from "vitest";
import { setupStore } from '@store/store';
import '@testing-library/jest-dom/vitest';
import { createStoreState, renderWithProviders } from "@test/test.utils.tsx";
import { screen } from "@testing-library/dom";
import FeedPage from "./FeedPage";
import { SUBREDDITS } from "@config/reddit";
import { cleanup } from "@testing-library/react";
import * as postsSlice from '@store/postsSlice';

enum TEST_ID {
  TagSelector = "tag-selector",
  PostCard = "post-card",
  LoadingSpinner = "loading-spinner",
};

/* MOCKS */
vi.mock("@components/Post/PostCard", () => ({
  default: () => <div data-testid={TEST_ID.PostCard}></div>
}));

vi.mock("@components/TagSelector/TagSelector", () => ({
  default: ({ text, selected }: { text: string, selected: boolean }) => <div data-testid={TEST_ID.TagSelector}>{text}-{selected ? "selected" : ""}</div>
}));

vi.mock("@components/LoadingSpinner/LoadingSpinner", () => ({
  default: () => <div data-testid={TEST_ID.LoadingSpinner}></div>
}));

vi.mock("@config/reddit", async () => {
  const actual = await vi.importActual("@config/reddit");
  return {
    ...actual,
    SUBREDDITS: ["subreddit1", "subreddit2", "subreddit3", "subreddit4"]
  }
});

const testStore = setupStore({}, false);
const dispatchSpy = vi.spyOn(testStore, "dispatch");
const fetchPostsBySubRedditSpy = vi.spyOn(postsSlice, "fetchPostsBySubReddit");

describe('FeedPage', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    cleanup();
    expect(document.body.innerHTML).toBe('');
  })

  describe('Initial rendering', () => {
    it('should mount without errors', async () => {
      renderWithProviders(<FeedPage />, { store: testStore });
    });

    it('should display all tags from SUBREDDITS constant', () => {
      renderWithProviders(<FeedPage />, { store: testStore });
      const tags = screen.getAllByTestId(TEST_ID.TagSelector);
      expect(tags.length).toEqual(SUBREDDITS.length);
      SUBREDDITS.forEach((subreddit, index) => {
        expect(tags[index]).toHaveTextContent(subreddit)
      });
    });

    it('should trigger fetchPostsBySubReddit on mount with initial selectedSubReddit', async () => {
      renderWithProviders(<FeedPage />, { store: testStore });

      // Expect one and good dispatch.
      expect(dispatchSpy.mock.calls.length).toEqual(1);
      expect(fetchPostsBySubRedditSpy.mock.calls.length).toEqual(1);
      
      // Expect the action to have been called with right argument
      const initialSubreddit = testStore.getState().posts.selectedSubReddit;
      const [lastCallArg] = fetchPostsBySubRedditSpy.mock.lastCall??[0];
      expect(lastCallArg).toEqual(initialSubreddit);
    });

    it('should mark the correct tag as selected based on selectedSubReddit from store', () => {
      renderWithProviders(<FeedPage />, { store: testStore });
      const tags = screen.getAllByTestId(TEST_ID.TagSelector);
      const selected = tags.filter((el) => el.innerHTML.includes("selected"));

      const initialSubreddit = testStore.getState().posts.selectedSubReddit;

      assert(selected.length === 1, "Not only one selected tags");
      assert(selected[0].innerHTML.includes(initialSubreddit), "Selected tag is not the one in the store");
    });
  });

  describe('Post filtering', () => {
    it.todo('should filter posts by current selectedSubReddit', () => {
      // TODO: Implement test
    });

    it.todo('should only display posts whose subreddit matches selectedSubReddit', () => {
      // TODO: Implement test
    });

    it.todo('should limit display to MAX_NUMBER_OF_SHOWN_POSTS (maximum 10 posts)', () => {
      // TODO: Implement test
    });

    it.todo('should update feedPosts when allPosts changes', () => {
      // TODO: Implement test
    });

    it.todo('should update feedPosts when selectedSubReddit changes', () => {
      // TODO: Implement test
    });
  });

  describe('Tag selection', () => {
    it.todo('should dispatch setSelectedSubReddit with new tag when handleTagSelection is called', () => {
      // TODO: Implement test
    });

    it.todo('should not dispatch anything if same tag is clicked', () => {
      // TODO: Implement test
    });

    it.todo('should pass selected=true to selected tag', () => {
      // TODO: Implement test
    });

    it.todo('should pass selected=false to non-selected tags', () => {
      // TODO: Implement test
    });

    it.todo('should call handleTagSelection with correct subreddit when TagSelector onClick is triggered', () => {
      // TODO: Implement test
    });
  });

  describe('Loading states', () => {
    it.todo('should display LoadingSpinner when loading is true', () => {
      // TODO: Implement test
    });
  });
});