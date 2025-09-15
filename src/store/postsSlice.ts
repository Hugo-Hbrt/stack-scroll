import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit'
import { type Post } from '@models/Post';
import api from '../api/mockedApi';

interface PostsState {
    posts: Post[];
    selectedTag: string;
    loading: boolean;
    error: string | null;
}

const initialState: PostsState = {
    posts: [],
    selectedTag: "Technology",
    loading: false,
    error: null,
};

export const fetchPosts = createAsyncThunk(
    "posts/fetchPosts",
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.getPosts();
            if (!response.success) {
                throw new Error(response.error || 'Failed to fetch posts');
            }
            return response.data;
        } catch (error) {
            return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
        }
    }
);

export const fetchPostsByTag = createAsyncThunk(
    "posts/fetchPostsByTag",
    async (tag: string, { rejectWithValue }) => {
        try {
            const response = await api.getPostsByTag(tag);
            if (!response.success) {
                throw new Error(response.error || 'Failed to fetch posts');
            }
            return response.data;
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
        setSelectedTag: (state, action: PayloadAction<string>) => {
            state.selectedTag = action.payload;
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
            // fetchPosts
            .addCase(fetchPosts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPosts.fulfilled, (state, action) => {
                state.loading = false;
                // Add new posts that don't already exist
                const existingIds = new Set(state.posts.map(post => post.id));
                const newPosts = action.payload.filter(post => !existingIds.has(post.id));
                state.posts.push(...newPosts);
            })
            .addCase(fetchPosts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // fetchPostsByTag
            .addCase(fetchPostsByTag.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPostsByTag.fulfilled, (state, action) => {
                state.loading = false;
                // Add new posts that don't already exist
                const existingIds = new Set(state.posts.map(post => post.id));
                const newPosts = action.payload.filter(post => !existingIds.has(post.id));
                state.posts.push(...newPosts);
            })
            .addCase(fetchPostsByTag.rejected, (state, action) => {
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
    setSelectedTag,
    addPost,
    deletePost,
    setLoading,
    setError
} = postsSlice.actions;

export default postsSlice.reducer;