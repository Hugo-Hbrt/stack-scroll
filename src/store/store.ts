import { configureStore } from '@reduxjs/toolkit';
import postsReducer from './postsSlice';
import commentsReducer from './commentsSlice';
import authReducer from './authSlice';

import logger from './middleware/logger';

export const store = configureStore({
    reducer: {
        posts: postsReducer,
        comments: commentsReducer,
        auth: authReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(logger),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;