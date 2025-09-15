/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import FeedPage from './FeedPage';
import postsReducer from '../store/postsSlice';
import commentsReducer from '../store/commentsSlice';
import { createPost } from '@models/Post';

// Mock the API
vi.mock('../api/mockedApi', () => ({
  default: {
    getPostsByTag: vi.fn(),
    getPosts: vi.fn()
  }
}));

// Mock React Router
vi.mock('react-router', () => ({
  useNavigate: () => vi.fn(),
  useLocation: () => ({ pathname: '/feed' }),
  useParams: () => ({}),
  Link: ({ children, to }: { children: React.ReactNode; to: string }) => (
    <a href={to}>{children}</a>
  )
}));

const createTestStore = (postsState: any, commentsState: any) => {
  return configureStore({
    reducer: {
      posts: postsReducer,
      comments: commentsReducer
    },
    preloadedState: {
      posts: postsState,
      comments: commentsState
    }
  });
};

const createDefaultCommentsState = () => ({
  commentsByPostId: {},
  loading: false,
  error: null
});

const renderFeedPageWithStore = (postsState: any) => {
  const store = createTestStore(postsState, createDefaultCommentsState());

  const dispatchSpy = vi.spyOn(store, 'dispatch');

  const renderResult = render(
    <Provider store={store}>
      <FeedPage />
    </Provider>
  );

  return { store, dispatchSpy, ...renderResult };
};

const createPostsState = (posts: any[] = [], selectedTag = 'Technology', loading = false, error = null) => ({
  posts,
  selectedTag,
  loading,
  error
});

describe('FeedPage Retry Behavior', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Test 1: Should fetch posts when feedPosts.length < MIN_POSTS', () => {
    it('should dispatch fetchPostsByTag when no posts exist for selected tag', async () => {
      const postsState = createPostsState([]);
      const { dispatchSpy } = renderFeedPageWithStore(postsState);

      // Should dispatch fetchPostsByTag because no posts exist
      expect(dispatchSpy).toHaveBeenCalled();
      // Simply check that dispatch was called - the function is the thunk
      const dispatchCall = dispatchSpy.mock.calls[0][0];
      expect(typeof dispatchCall).toBe('function');
    });

    it('should not fetch when enough posts exist', async () => {
      const mockPosts = [
        createPost(1, 'Technology', 'Test Post', 'Content', 'author', 0, 10)
      ];
      
      const postsState = createPostsState(mockPosts);
      const { dispatchSpy } = renderFeedPageWithStore(postsState);

      // Should not dispatch fetchPostsByTag because we have enough posts
      expect(dispatchSpy).not.toHaveBeenCalled();
    });
  });

  describe('Test 2: Should not fetch if already loading', () => {
    it('should not dispatch fetchPostsByTag when loading is true', async () => {
      const postsState = createPostsState([], 'Technology', true);
      const { dispatchSpy } = renderFeedPageWithStore(postsState);

      // Should not dispatch because already loading
      expect(dispatchSpy).not.toHaveBeenCalled();
    });

    it('should not dispatch when loading is true even with no posts', async () => {
      const postsState = createPostsState([], 'Technology', true);
      const { dispatchSpy } = renderFeedPageWithStore(postsState);

      // Should not dispatch even though no posts exist because already loading
      expect(dispatchSpy).not.toHaveBeenCalled();
    });
  });

  describe('Test 3: Should retry once if first fetch returns 0 posts', () => {
    it('should dispatch fetchPostsByTag again after first fetch returns 0 posts', async () => {
      // Mock API to return empty array
      const mockedApi = await import('../api/mockedApi');
      vi.mocked(mockedApi.default.getPostsByTag).mockResolvedValueOnce({
        success: true,
        data: []
      });

      const postsState = createPostsState([], 'Technology', false);
      const { dispatchSpy } = renderFeedPageWithStore(postsState);

      // First dispatch should happen
      expect(dispatchSpy).toHaveBeenCalledTimes(1);

      // Wait for the async operation to complete and then check for retry
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Should dispatch again for retry
      expect(dispatchSpy).toHaveBeenCalledTimes(2);
    });

    it('should not retry if first fetch returns some posts', async () => {
      // Mock API to return posts
      const mockedApi = await import('../api/mockedApi');
      const mockPosts = [createPost(1, 'Technology', 'Test Post', 'Content', 'author', 0, 10)];
      vi.mocked(mockedApi.default.getPostsByTag).mockResolvedValueOnce({
        success: true,
        data: mockPosts
      });

      const postsState = createPostsState([], 'Technology', false);
      const { dispatchSpy } = renderFeedPageWithStore(postsState);

      // First dispatch should happen
      expect(dispatchSpy).toHaveBeenCalledTimes(1);

      // Wait for the async operation to complete
      await new Promise(resolve => setTimeout(resolve, 100));

      // Should not retry because we got posts
      expect(dispatchSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('Test 4: Should not retry more than once', () => {
    it('should not dispatch a third time after two failed fetches', async () => {
      // Mock API to return empty array for both calls
      const mockedApi = await import('../api/mockedApi');
      vi.mocked(mockedApi.default.getPostsByTag)
        .mockResolvedValueOnce({ success: true, data: [] })  // First fetch returns 0 posts
        .mockResolvedValueOnce({ success: true, data: [] }); // Retry returns 0 posts

      const postsState = createPostsState([], 'Technology', false);
      const { dispatchSpy } = renderFeedPageWithStore(postsState);

      // First dispatch should happen
      expect(dispatchSpy).toHaveBeenCalledTimes(1);

      // Wait for first fetch to complete
      await new Promise(resolve => setTimeout(resolve, 100));

      // Should dispatch again for retry
      expect(dispatchSpy).toHaveBeenCalledTimes(2);

      // Wait for retry to complete
      await new Promise(resolve => setTimeout(resolve, 100));

      // Should NOT dispatch a third time
      expect(dispatchSpy).toHaveBeenCalledTimes(2);
    });

    it('should respect retry limit even if posts are still needed', async () => {
      // Mock API to always return empty array
      const mockedApi = await import('../api/mockedApi');
      vi.mocked(mockedApi.default.getPostsByTag).mockResolvedValue({
        success: true,
        data: []
      });

      const postsState = createPostsState([], 'Technology', false);
      const { dispatchSpy } = renderFeedPageWithStore(postsState);

      // First dispatch
      expect(dispatchSpy).toHaveBeenCalledTimes(1);

      // Wait for operations to complete
      await new Promise(resolve => setTimeout(resolve, 200));

      // Should have made exactly 2 calls (initial + 1 retry)
      expect(dispatchSpy).toHaveBeenCalledTimes(2);
    });
  });

  describe('Test 5: Should stop fetching after 1 failed retry', () => {
    it('should stop fetching when retry fails with error', async () => {
      // Mock API to fail on both calls
      const mockedApi = await import('../api/mockedApi');
      vi.mocked(mockedApi.default.getPostsByTag)
        .mockRejectedValueOnce(new Error('Network error'))  // First fetch fails
        .mockRejectedValueOnce(new Error('Network error')); // Retry fails

      const postsState = createPostsState([], 'Technology', false);
      const { dispatchSpy } = renderFeedPageWithStore(postsState);

      // First dispatch should happen
      expect(dispatchSpy).toHaveBeenCalledTimes(1);

      // Wait for first fetch to fail
      await new Promise(resolve => setTimeout(resolve, 100));

      // Should dispatch again for retry
      expect(dispatchSpy).toHaveBeenCalledTimes(2);

      // Wait for retry to fail
      await new Promise(resolve => setTimeout(resolve, 100));

      // Should NOT dispatch a third time after failed retry
      expect(dispatchSpy).toHaveBeenCalledTimes(2);
    });

    it('should stop fetching when retry succeeds but returns 0 posts', async () => {
      // Mock API: first fails, retry succeeds but returns empty
      const mockedApi = await import('../api/mockedApi');
      vi.mocked(mockedApi.default.getPostsByTag)
        .mockRejectedValueOnce(new Error('Network error'))  // First fetch fails
        .mockResolvedValueOnce({ success: true, data: [] }); // Retry succeeds with 0 posts

      const postsState = createPostsState([], 'Technology', false);
      const { dispatchSpy } = renderFeedPageWithStore(postsState);

      // First dispatch should happen
      expect(dispatchSpy).toHaveBeenCalledTimes(1);

      // Wait for operations to complete
      await new Promise(resolve => setTimeout(resolve, 200));

      // Should have made exactly 2 calls and stop
      expect(dispatchSpy).toHaveBeenCalledTimes(2);
    });
  });

  describe('Test 6: Should reset retry state when tag changes', () => {
    it('should allow fresh retries when switching to a different tag', async () => {
      // Mock API to return empty array for both tags
      const mockedApi = await import('../api/mockedApi');
      vi.mocked(mockedApi.default.getPostsByTag).mockResolvedValue({
        success: true,
        data: []
      });

      const postsState = createPostsState([], 'Technology', false);
      const { store, dispatchSpy } = renderFeedPageWithStore(postsState);

      // Should make 2 calls for 'Technology' tag (initial + retry)
      await new Promise(resolve => setTimeout(resolve, 200));
      const callsAfterTechnology = dispatchSpy.mock.calls.length;
      expect(callsAfterTechnology).toBe(2);

      // Switch to 'Travel' tag - this resets retry count
      store.dispatch({ type: 'posts/setSelectedTag', payload: 'Travel' });

      // Wait for tag change to process and new fetches
      await new Promise(resolve => setTimeout(resolve, 200));

      const totalCalls = dispatchSpy.mock.calls.length;
      // Should have made fresh retries for Travel tag (exactly 3 more due to reset behavior)
      expect(totalCalls).toBe(callsAfterTechnology + 3);
    });

    it('should reset retry count to 0 when tag changes', async () => {
      // Mock API to exhaust retries for first tag, then succeed for second tag
      const mockedApi = await import('../api/mockedApi');
      vi.mocked(mockedApi.default.getPostsByTag)
        .mockResolvedValueOnce({ success: true, data: [] })  // Technology: first call
        .mockResolvedValueOnce({ success: true, data: [] })  // Technology: retry
        .mockResolvedValueOnce({ success: true, data: [createPost(1, 'Travel', 'Test', 'Content', 'author', 0, 10)] }); // Travel: first call

      const postsState = createPostsState([], 'Technology', false);
      const { store, dispatchSpy } = renderFeedPageWithStore(postsState);

      // Wait for Technology tag retries to complete (2 calls)
      await new Promise(resolve => setTimeout(resolve, 200));
      const callsAfterTechnology = dispatchSpy.mock.calls.length;
      expect(callsAfterTechnology).toBe(2);

      // Switch to Travel tag - this should reset retry count
      store.dispatch({ type: 'posts/setSelectedTag', payload: 'Travel' });

      // Wait for Travel tag fetch
      await new Promise(resolve => setTimeout(resolve, 100));

      const totalCalls = dispatchSpy.mock.calls.length;
      // Should have made 2 more calls for Travel (retry count was reset, 1 initial + 1 success)
      expect(totalCalls).toBe(callsAfterTechnology + 2);
    });
  });

  describe('Loading Spinner Tests', () => {
    describe('Test 1: Should show spinner when loading is true', () => {
      it('should display spinning AppLogo when loading state is true', () => {
        const postsState = createPostsState([], 'Technology', true);
        renderFeedPageWithStore(postsState);

        const loadingSpinners = screen.getAllByTestId('loading-spinner');
        expect(loadingSpinners.length).toBeGreaterThan(0);
        
        const spinner = loadingSpinners[0];
        const spinningLogo = spinner.querySelector('.animate-spin');
        
        expect(spinner).toBeTruthy();
        expect(spinningLogo).toBeTruthy();
      });
    });

    describe('Test 2: Should hide spinner when loading is false', () => {
      it('should not display spinner when loading state is false', () => {
        // Create state with posts so fetch doesn't trigger and set loading to true
        const mockPosts = [createPost(1, 'Technology', 'Test Post', 'Content', 'author', 0, 10)];
        const postsState = createPostsState(mockPosts, 'Technology', false);
        const { container } = renderFeedPageWithStore(postsState);

        // Should not show spinner when not loading
        const loadingSpinner = container.querySelector('[data-testid="loading-spinner"]');
        expect(loadingSpinner).toBeFalsy();
      });
    });

    describe('Test 3: Should show spinner with correct props/styling', () => {
      it('should render AppLogo with medium size and proper container styling', () => {
        const postsState = createPostsState([], 'Technology', true);
        const { container } = renderFeedPageWithStore(postsState);

        const loadingSpinner = container.querySelector('[data-testid="loading-spinner"]');
        expect(loadingSpinner).toBeTruthy();

        // Check container has proper centering classes
        expect(loadingSpinner?.classList.contains('flex')).toBe(true);
        expect(loadingSpinner?.classList.contains('justify-center')).toBe(true);
        expect(loadingSpinner?.classList.contains('my-4')).toBe(true);

        // Check AppLogo has animate-spin class  
        const appLogo = loadingSpinner?.querySelector('.animate-spin');
        expect(appLogo).toBeTruthy();

        // Check SVG has medium size (32x32)
        const svg = appLogo?.querySelector('svg');
        expect(svg?.getAttribute('width')).toBe('32');
        expect(svg?.getAttribute('height')).toBe('32');
      });
    });
  });
});