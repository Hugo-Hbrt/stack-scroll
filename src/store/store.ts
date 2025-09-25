import { combineReducers, configureStore } from '@reduxjs/toolkit';
import postsReducer from './postsSlice';
import commentsReducer from './commentsSlice';
import authReducer from './authSlice';
import logger from './middleware/logger';

// Create the root reducer independently to obtain the RootState type
const rootReducer = combineReducers({
    posts: postsReducer,
    comments: commentsReducer,
    auth: authReducer
});

export function setupStore(preloadedState?: Partial<RootState>, enableLogger: boolean = true) {
        
    return configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => {
        const middleware = getDefaultMiddleware();
        return enableLogger ? middleware.concat(logger) : middleware;
    },
    preloadedState
  });
}

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore["dispatch"];