import React, { type PropsWithChildren, type JSX } from 'react'
import { render } from '@testing-library/react'
import type { RenderOptions } from '@testing-library/react'
import { Provider } from 'react-redux'

import { setupStore } from '@store/store';
import type { AppStore, RootState } from '@store/store';
import type { RedditToken } from "@utils/sessionStorage/tokenStorage";
import type { UserInfo } from "@utils/sessionStorage/userStorage";
import type { AuthState } from '@store/authSlice';
import type { PostsState } from '@store/postsSlice';
import type { CommentsState } from '@store/commentsSlice';
import { SUBREDDITS } from '@config/reddit';

const DEFAULT_REDDIT_TOKEN: RedditToken = {
  accessToken: "test-access-token",
  expiresAt: Date.now() + 1000 * 60 * 60, // 1 hour from now
  scope: "test scope",
};

const DEFAULT_USER_INFO: UserInfo = {
  name: "test-user",
  verified: true,
  id: '',
  icon_img: '',
  link_karma: 0,
  comment_karma: 0,
  created_utc: 0,
  is_gold: false
};

const DEFAULT_AUTH_STATE: AuthState = {
  isAuthenticated: true,
  accessToken: DEFAULT_REDDIT_TOKEN,
  userInfo: DEFAULT_USER_INFO,
};

const DEFAULT_POSTS_STATE: PostsState = {
  posts: [],
  selectedSubReddit: SUBREDDITS[0],
  loading: false,
  error: null,
};

const DEFAULT_COMMENTS_STATE: CommentsState = {
  commentsByPostId: {},
  loading: false,
  error: null,
};

export const createStoreState = (
  postsOverrides: Partial<PostsState> = {},
  authOverrides: Partial<AuthState> = {},
  commentsOverrides: Partial<CommentsState> = {}
): Partial<RootState> => ({
  auth: {
    ...DEFAULT_AUTH_STATE,
    ...authOverrides,
  },
  posts: {
    ...DEFAULT_POSTS_STATE,
    ...postsOverrides,
  },
  comments: {
    ...DEFAULT_COMMENTS_STATE,
    ...commentsOverrides,
  },
});

// This type interface extends the default options for render from RTL, as well
// as allows the user to specify other things such as initialState, store.
interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
  preloadedState?: Partial<RootState>
  store?: AppStore
}
export function renderWithProviders(
  ui: React.ReactElement,
  {
    preloadedState = {},
    // Automatically create a store instance if no store was passed in
    store = setupStore(preloadedState),
    ...renderOptions
  }: ExtendedRenderOptions = {}
) {
  function Wrapper({ children }: PropsWithChildren<{}>): JSX.Element {
    return <Provider store={store}>{children}</Provider>
  }
  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) }
}