import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit'
import { type Comment } from '@models/Comment';
import api from '../api/mockedApi';

interface CommentsState {
    commentsByPostId: { [postId: number]: Comment[] };
    loading: boolean;
    error: string | null;
}

const initialState: CommentsState = {
    commentsByPostId: {},
    loading: false,
    error: null,
};

export const fetchComments = createAsyncThunk(
    "comments/fetchComments",
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.getComments();
            if (!response.success) {
                throw new Error(response.error || 'Failed to fetch comments');
            }
            return response.data;
        } catch (error) {
            return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
        }
    }
);

export const fetchCommentsByPostId = createAsyncThunk(
    "comments/fetchCommentsByPostId",
    async (postId: number, { rejectWithValue }) => {
        try {
            const response = await api.getComments(postId);
            if (!response.success) {
                throw new Error(response.error || 'Failed to fetch comments');
            }
            return { postId, comments: response.data };
        } catch (error) {
            return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
        }
    }
);
const commentsSlice = createSlice({
    name: 'comments',
    initialState,
    reducers: {
        addComment: (state, action: PayloadAction<Comment>) => {
            const { postId } = action.payload;
            if (!state.commentsByPostId[postId]) {
                state.commentsByPostId[postId] = [];
            }
            state.commentsByPostId[postId].push(action.payload);
        },
        updateComment: (state, action: PayloadAction<Comment>) => {
            const { postId, id } = action.payload;
            const comments = state.commentsByPostId[postId];
            if (comments) {
                const index = comments.findIndex(comment => comment.id === id);
                if (index !== -1) {
                    comments[index] = action.payload;
                }
            }
        },
        deleteComment: (state, action: PayloadAction<{ postId: number; commentId: number }>) => {
            const { postId, commentId } = action.payload;
            const comments = state.commentsByPostId[postId];
            if (comments) {
                state.commentsByPostId[postId] = comments.filter(comment => comment.id !== commentId);
            }
        },
        setCommentsForPost: (state, action: PayloadAction<{ postId: number; comments: Comment[] }>) => {
            const { postId, comments } = action.payload;
            state.commentsByPostId[postId] = comments;
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
            // fetchComments
            .addCase(fetchComments.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchComments.fulfilled, (state, action) => {
                state.loading = false;
                // Group comments by postId and add new ones
                action.payload.forEach(comment => {
                    if (!state.commentsByPostId[comment.postId]) {
                        state.commentsByPostId[comment.postId] = [];
                    }
                    // Add comment if it doesn't already exist
                    const existingIds = new Set(state.commentsByPostId[comment.postId].map(c => c.id));
                    if (!existingIds.has(comment.id)) {
                        state.commentsByPostId[comment.postId].push(comment);
                    }
                });
            })
            .addCase(fetchComments.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // fetchCommentsByPostId
            .addCase(fetchCommentsByPostId.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCommentsByPostId.fulfilled, (state, action) => {
                state.loading = false;
                const { postId, comments } = action.payload;
                if (!state.commentsByPostId[postId]) {
                    state.commentsByPostId[postId] = [];
                }
                // Add new comments that don't already exist
                const existingIds = new Set(state.commentsByPostId[postId].map(c => c.id));
                const newComments = comments.filter(comment => !existingIds.has(comment.id));
                state.commentsByPostId[postId].push(...newComments);
            })
            .addCase(fetchCommentsByPostId.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const {
    addComment,
    updateComment,
    deleteComment,
    setCommentsForPost,
    setLoading,
    setError
} = commentsSlice.actions;

export default commentsSlice.reducer;