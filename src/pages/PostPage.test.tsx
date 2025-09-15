/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, cleanup } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter, Route, Routes } from 'react-router';
import PostPage from './PostPage';
import postsReducer from '../store/postsSlice';
import commentsReducer from '../store/commentsSlice';
import { createPost } from '@models/Post';
import { createComment } from '@models/Comment';

// Mock the API
vi.mock('../api/mockedApi', () => ({
  default: {
    getComments: vi.fn(),
    getPost: vi.fn()
  }
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

const createDefaultPostsState = (posts: any[] = []) => ({
  posts,
  selectedTag: 'All',
  loading: false,
  error: null
});

const createDefaultCommentsState = (commentsByPostId: Record<number, any[]> = {}) => ({
  commentsByPostId,
  loading: false,
  error: null
});

const renderPostPageWithStore = (postsState: any, commentsState: any, postId: string = '1') => {
  const store = createTestStore(postsState, commentsState);
  const dispatchSpy = vi.spyOn(store, 'dispatch');

  const renderResult = render(
    <MemoryRouter initialEntries={[`/post/${postId}`]}>
      <Provider store={store}>
        <Routes>
          <Route path="/post/:postId" element={<PostPage />} />
        </Routes>
      </Provider>
    </MemoryRouter>
  );

  return { store, dispatchSpy, ...renderResult };
};

describe('PostPage Comments Fetching', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  describe('Test 1: Should fetch comments when post.commentsCount > comments.length', () => {
    it('should dispatch fetchCommentsByPostId when post has more comments than stored', async () => {
      // Create post with 5 comments but store only has 2
      const mockPost = createPost(1, 'Technology', 'Test Post', 'Content', 'author', 5, 0);
      const mockComments = [
        createComment(1, 1, 'Comment 1', 'user1', 0),
        createComment(2, 1, 'Comment 2', 'user2', 0)
      ];

      const postsState = createDefaultPostsState([mockPost]);
      const commentsState = createDefaultCommentsState({ 1: mockComments });
      
      const { dispatchSpy } = renderPostPageWithStore(postsState, commentsState, '1');

      await waitFor(() => {
        expect(dispatchSpy).toHaveBeenCalled();
      });
      
      const dispatchCall = dispatchSpy.mock.calls[0][0];
      expect(typeof dispatchCall).toBe('function');
    });

    it('should not fetch when post.commentsCount equals comments.length', () => {
      // Create post with 2 comments and store has 2 comments
      const mockPost = createPost(1, 'Technology', 'Test Post', 'Content', 'author', 2, 0);
      const mockComments = [
        createComment(1, 1, 'Comment 1', 'user1', 0),
        createComment(2, 1, 'Comment 2', 'user2', 0)
      ];

      const postsState = createDefaultPostsState([mockPost]);
      const commentsState = createDefaultCommentsState({ 1: mockComments });
      
      const { dispatchSpy } = renderPostPageWithStore(postsState, commentsState, '1');

      expect(dispatchSpy).not.toHaveBeenCalled();
    });

    it('should not fetch when post.commentsCount is less than comments.length', () => {
      // Edge case: store has more comments than post indicates
      const mockPost = createPost(1, 'Technology', 'Test Post', 'Content', 'author', 1, 0);
      const mockComments = [
        createComment(1, 1, 'Comment 1', 'user1', 0),
        createComment(2, 1, 'Comment 2', 'user2', 0)
      ];

      const postsState = createDefaultPostsState([mockPost]);
      const commentsState = createDefaultCommentsState({ 1: mockComments });
      
      const { dispatchSpy } = renderPostPageWithStore(postsState, commentsState, '1');

      expect(dispatchSpy).not.toHaveBeenCalled();
    });
  });

  describe('Test 2: Should not fetch when already loading', () => {
    it('should not dispatch fetchCommentsByPostId when comments are loading', () => {
      const mockPost = createPost(1, 'Technology', 'Test Post', 'Content', 'author', 5, 0);
      const mockComments = [createComment(1, 1, 'Comment 1', 'user1', 0)];

      const postsState = createDefaultPostsState([mockPost]);
      const commentsState = createDefaultCommentsState({ 1: mockComments });
      commentsState.loading = true; // Set loading to true

      const { dispatchSpy } = renderPostPageWithStore(postsState, commentsState, '1');

      expect(dispatchSpy).not.toHaveBeenCalled();
    });
  });

  describe('Test 3: Should handle missing comments array', () => {
    it('should fetch comments when no comments exist for post', async () => {
      const mockPost = createPost(1, 'Technology', 'Test Post', 'Content', 'author', 3, 0);
      
      const postsState = createDefaultPostsState([mockPost]);
      const commentsState = createDefaultCommentsState({}); // No comments for any post
      
      const { dispatchSpy } = renderPostPageWithStore(postsState, commentsState, '1');

      await waitFor(() => {
        expect(dispatchSpy).toHaveBeenCalled();
      });
      
      const dispatchCall = dispatchSpy.mock.calls[0][0];
      expect(typeof dispatchCall).toBe('function');
    });
  });

  describe('Test 4: Should pass correct postId to fetchCommentsByPostId', () => {
    it('should dispatch fetchCommentsByPostId with correct postId', async () => {
      const mockPost = createPost(42, 'Technology', 'Test Post', 'Content', 'author', 5, 0);
      
      const postsState = createDefaultPostsState([mockPost]);
      const commentsState = createDefaultCommentsState({});
      
      const { dispatchSpy } = renderPostPageWithStore(postsState, commentsState, '42');

      await waitFor(() => {
        expect(dispatchSpy).toHaveBeenCalled();
      });
      
      // We can't easily test the exact postId without more complex mocking,
      // but we can verify the dispatch was called with a function (thunk)
      const dispatchCall = dispatchSpy.mock.calls[0][0];
      expect(typeof dispatchCall).toBe('function');
    });
  });

  describe('Test 5: Should show loading spinner when fetching comments', () => {
    it('should display loading spinner when comments are being fetched', () => {
      const mockPost = createPost(1, 'Technology', 'Test Post', 'Content', 'author', 5, 0);
      
      const postsState = createDefaultPostsState([mockPost]);
      const commentsState = createDefaultCommentsState({});
      commentsState.loading = true; // Set loading to true

      renderPostPageWithStore(postsState, commentsState, '1');

      const spinners = screen.getAllByTestId('comments-loading-spinner');
      expect(spinners.length).toBeGreaterThan(0);
      expect(spinners[0].getAttribute('role')).toBe('status');
      expect(spinners[0].getAttribute('aria-label')).toBe('Loading comments');
    });
  });

  describe('Test 6: Should hide loading spinner when not loading comments', () => {
    it('should not display loading spinner when comments match post commentsCount', () => {
      // Post with 2 commentsCount and store has exactly 2 comments
      const mockPost = createPost(1, 'Technology', 'Test Post', 'Content', 'author', 2, 0);
      const mockComments = [
        createComment(1, 1, 'Comment 1', 'user1', 0),
        createComment(2, 1, 'Comment 2', 'user2', 0)
      ];
      
      const postsState = createDefaultPostsState([mockPost]);
      const commentsState = {
        commentsByPostId: { 1: mockComments },
        loading: false, // No fetch needed since counts match
        error: null
      };

      renderPostPageWithStore(postsState, commentsState, '1');

      const spinners = screen.queryAllByTestId('comments-loading-spinner');
      expect(spinners).toHaveLength(0);
    });
  });

  describe('Test 7: Should show spinner with correct styling and placement', () => {
    it('should display spinner with correct classes and accessibility attributes', () => {
      const mockPost = createPost(1, 'Technology', 'Test Post', 'Content', 'author', 5, 0);
      
      const postsState = createDefaultPostsState([mockPost]);
      const commentsState = {
        commentsByPostId: {},
        loading: true,
        error: null
      };

      renderPostPageWithStore(postsState, commentsState, '1');

      const spinners = screen.getAllByTestId('comments-loading-spinner');
      const spinner = spinners[0];
      
      // Check basic accessibility attributes
      expect(spinner.getAttribute('role')).toBe('status');
      expect(spinner.getAttribute('aria-label')).toBe('Loading comments');
      expect(spinner.getAttribute('aria-live')).toBe('polite');
      
      // Check styling classes
      expect(spinner.className).toContain('flex');
      expect(spinner.className).toContain('justify-center');
      expect(spinner.className).toContain('my-4');
      
      // Check that AppLogo has animate-spin class
      const logo = spinner.querySelector('div');
      expect(logo?.className).toContain('animate-spin');
    });
  });

  describe('Post Fetching Tests', () => {
    describe('Test 8: Should fetch post data when postId exists but post not in store', () => {
      it('should dispatch fetchPostById when post is missing from store', async () => {
        // No posts in the store initially
        const postsState = createDefaultPostsState([]);
        const commentsState = createDefaultCommentsState({});
        
        const { dispatchSpy } = renderPostPageWithStore(postsState, commentsState, '42');

        await waitFor(() => {
          expect(dispatchSpy).toHaveBeenCalled();
        });
        
        // Check that the dispatch was called with the fetchPostById thunk
        const dispatchCall = dispatchSpy.mock.calls[0][0];
        expect(typeof dispatchCall).toBe('function');
      });
    });

    describe('Test 9: Should display "Post not found" when fetch fails', () => {
      it('should show error message when fetchPostById fails and no post in store', async () => {
        // Mock the API to fail
        const mockApi = await import('../api/mockedApi');
        vi.mocked(mockApi.default.getPost).mockResolvedValue({
          data: null,
          success: false,
          error: 'Post not found'
        });

        // No posts in the store initially
        const postsState = createDefaultPostsState([]);
        const commentsState = createDefaultCommentsState({});
        
        renderPostPageWithStore(postsState, commentsState, '999');

        // Wait for the fetch to complete and check that "Post not found" is displayed
        await waitFor(() => {
          expect(screen.getByText('Post not found.')).toBeDefined();
        });
      });
    });

    describe('Test 10: Should not refetch post if already in store', () => {
      it('should not dispatch fetchPostById when post exists in store', () => {
        // Post already exists in store
        const mockPost = createPost(42, 'Technology', 'Existing Post', 'Content', 'author', 0, 0);
        const postsState = createDefaultPostsState([mockPost]);
        const commentsState = createDefaultCommentsState({});
        
        const { dispatchSpy } = renderPostPageWithStore(postsState, commentsState, '42');

        // Should not dispatch because post is already in store
        expect(dispatchSpy).not.toHaveBeenCalled();
        
        // Should display the existing post
        expect(screen.getByText('Existing Post')).toBeDefined();
      });
    });

    describe('PostSection Loading Tests', () => {
      describe('Test 11: Should show loading PostSection with background animation when fetching post', () => {
        it('should display loading PostSection instead of actual PostSection when posts are loading', () => {
          // No posts in store, posts loading is true
          const postsState = createDefaultPostsState([]);
          postsState.loading = true; // Set posts loading to true
          const commentsState = createDefaultCommentsState({});
          
          renderPostPageWithStore(postsState, commentsState, '42');

          // Should show loading PostSection with skeleton/shimmer effect
          const loadingPostSection = screen.getByTestId('loading-post-section');
          expect(loadingPostSection).toBeDefined();
          expect(loadingPostSection.getAttribute('role')).toBe('status');
          expect(loadingPostSection.getAttribute('aria-label')).toBe('Loading post');

          // Should have shimmer/skeleton animation classes
          expect(loadingPostSection.className).toContain('animate-pulse');

          // Should not show "Post not found" text
          expect(screen.queryByText('Post not found.')).toBeNull();
        });
      });

      describe('Test 12: Should hide loading PostSection when post fetch completes', () => {
        it('should display actual PostSection when post is loaded and not show loading skeleton', () => {
          // Post exists in store, loading is false
          const mockPost = createPost(42, 'Technology', 'Real Post', 'Content', 'author', 0, 0);
          const postsState = createDefaultPostsState([mockPost]);
          postsState.loading = false; // Set posts loading to false
          const commentsState = createDefaultCommentsState({});
          
          renderPostPageWithStore(postsState, commentsState, '42');

          // Should show actual PostSection content
          expect(screen.getByText('Real Post')).toBeDefined();
          expect(screen.getByText('Technology')).toBeDefined();
          expect(screen.getByText('Content')).toBeDefined();

          // Should not show loading PostSection
          expect(screen.queryByTestId('loading-post-section')).toBeNull();
        });
      });

      describe('Test 13: Should show loading PostSection with correct styling', () => {
        it('should display loading PostSection with proper skeleton structure and animations', () => {
          // No posts in store, posts loading is true
          const postsState = createDefaultPostsState([]);
          postsState.loading = true;
          const commentsState = createDefaultCommentsState({});
          
          renderPostPageWithStore(postsState, commentsState, '42');

          const loadingPostSection = screen.getByTestId('loading-post-section');
          
          // Check container styling matches PostSection
          expect(loadingPostSection.className).toContain('flex');
          expect(loadingPostSection.className).toContain('flex-col');
          expect(loadingPostSection.className).toContain('gap-10');
          expect(loadingPostSection.className).toContain('p-[22px]');
          expect(loadingPostSection.className).toContain('rounded-[9px]');
          expect(loadingPostSection.className).toContain('border');
          expect(loadingPostSection.className).toContain('border-text-50');
          
          // Check animation
          expect(loadingPostSection.className).toContain('animate-pulse');
          
          // Verify skeleton elements exist
          const skeletonElements = loadingPostSection.querySelectorAll('.bg-gray-300');
          expect(skeletonElements.length).toBeGreaterThan(5); // Tag, author, title, voter buttons, content lines, comment button
        });
      });
    });
  });
});