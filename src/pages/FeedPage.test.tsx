/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi, beforeEach, assert} from 'vitest';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import FeedPage from './FeedPage';
import postsReducer from '../store/postsSlice';
import commentsReducer from '../store/commentsSlice';

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

describe('FeedPage Basic Behavior', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Test 1: Should fetch posts on mount', () => {
    it('should dispatch fetchPostsBySubReddit when component loads', async () => {
      const postsState = createPostsState([]);
      const { dispatchSpy } = renderFeedPageWithStore(postsState);

      // Should dispatch fetchPostsBySubReddit on mount
      expect(dispatchSpy).toHaveBeenCalled();
      // Simply check that dispatch was called with a thunk function
      const dispatchCall = dispatchSpy.mock.calls[0][0];
      expect(typeof dispatchCall).toBe('function');
    });
  });

  describe('Test 2: Should fetch posts when subreddit changes', () => {
    it('should dispatch fetchPostsBySubReddit when tag selection changes', async () => {
      const postsState = createPostsState([], 'Technology', false);
      const { store, dispatchSpy } = renderFeedPageWithStore(postsState);

      // Clear initial dispatch calls (first call is fetchPostsBySubReddit on mount)
      dispatchSpy.mockClear();

      // Change subreddit using the correct action
      store.dispatch({ type: 'posts/setSelectedSubReddit', payload: 'Python' });

      // Wait for effect to trigger
      await new Promise(resolve => setTimeout(resolve, 50));

      // Should dispatch fetchPostsBySubReddit for new tag
      expect(dispatchSpy).toHaveBeenCalled();

      // Find the fetchPostsBySubReddit call (should be a thunk function)
      const fetchCall = dispatchSpy.mock.calls.find(call => typeof call[0] === 'function');
      
      if (fetchCall === undefined)
      {
        assert.fail("fetchCall not defined.")
      }
      expect(typeof fetchCall[0]).toBe('function');
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


    describe('Test 2: Should show spinner with correct props/styling', () => {
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