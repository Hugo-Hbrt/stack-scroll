import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit'
import { type Post } from '@models/Post';
import { fetchPosts, type RedditPostData } from '@api/reddit/fetchPosts';
import api from '@api/mockedApi';
import type { RootState } from '@store/store';
import { SUBREDDITS } from '@config/reddit';

export interface PostsState {
    posts: Post[];
    selectedSubReddit: string;
    loading: boolean;
    error: string | null;
}

const initialState: PostsState = {
    posts: [],
    selectedSubReddit: SUBREDDITS[0],
    loading: false,
    error: null,
};

// Transform Reddit post data to our Post model
const transformRedditPostToPost = (redditPost: RedditPostData): Post => {
    return {
        id: parseInt(redditPost.id, 36), // Convert Reddit's base36 ID to number
        redditId: redditPost.id, // Keep original Reddit ID for API calls
        subreddit: redditPost.subreddit,
        title: redditPost.title,
        content: redditPost.selftext || redditPost.url || '',
        author: redditPost.author,
        commentsCount: redditPost.num_comments,
        initialVoteCount: redditPost.score
    };
};

export const fetchPostsBySubReddit = createAsyncThunk(
    "posts/fetchPostsBySubReddit",
    async (subreddit: string, {getState, rejectWithValue }) => {
        try {
            const state = getState() as RootState;
            
            const accessToken = state.auth.accessToken;
            const userInfo = state.auth.userInfo;
            if (!accessToken) {
                throw new Error("No access token.");
            }
            
            if (!userInfo) {
                throw new Error("No user info.");
            }

            // fetchPosts returns RedditResponse directly
            const redditResponse = await fetchPosts(subreddit, accessToken, userInfo);
            
            // Transform Reddit posts to our Post model
            const transformedPosts = redditResponse.data.children.map(child => 
                transformRedditPostToPost(child.data)
            );

            return transformedPosts; 
        } catch (error) {
            return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
        }
    }
);

export const fetchPostById = createAsyncThunk(
    "posts/fetchPostById",
    async (postId: number, { rejectWithValue }) => {
        try {
            const response = await api.getPost(postId);
            if (!response.success || !response.data) {
                throw new Error(response.error || 'Post not found');
            }
            return response.data;
        } catch (error) {
            return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
        }
    }
);

const postsSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {
        setSelectedSubReddit: (state, action: PayloadAction<string>) => {
            state.selectedSubReddit = action.payload;
        },
        addPost: (state, action: PayloadAction<Post>) => {
            state.posts = [...state.posts, action.payload]
        },
        deletePost: (state, action: PayloadAction<number>) => {
            state.posts = state.posts.filter(post => post.id !== action.payload);
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            // fetchPostsByTag
            .addCase(fetchPostsBySubReddit.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPostsBySubReddit.fulfilled, (state, action) => {
                state.loading = false;
                // Add new posts that don't already exist
                const existingIds = new Set(state.posts.map(post => post.id));
                const newPosts = action.payload.filter((post: Post) => !existingIds.has(post.id));
                state.posts.push(...newPosts);
            })
            .addCase(fetchPostsBySubReddit.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // fetchPostById
            .addCase(fetchPostById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPostById.fulfilled, (state, action) => {
                state.loading = false;
                // Add the post if it doesn't already exist
                const existingIds = new Set(state.posts.map(post => post.id));
                if (!existingIds.has(action.payload.id)) {
                    state.posts.push(action.payload);
                }
            })
            .addCase(fetchPostById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const {
    setSelectedSubReddit,
    addPost,
    deletePost,
    setLoading,
    setError
} = postsSlice.actions;

export default postsSlice.reducer;