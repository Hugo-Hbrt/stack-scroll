import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { SecureTokenStorage } from '@utils/tokenStorage/tokenStorage';
import { type RedditToken } from '@utils/tokenStorage/tokenStorage';
import { fetchUserInfo } from '@api/reddit/fetchUserInfo';

interface UserInfo {
  id: string;
  name: string;
  icon_img: string;
  link_karma: number;
  comment_karma: number;
  created_utc: number;
  verified: boolean;
  is_gold: boolean;
}
interface AuthState {
  isAuthenticated: boolean;
  accessToken: RedditToken | null;
  userInfo: UserInfo | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  accessToken: null,
  userInfo: null,
};

// Async thunk to authenticate user and fetch their info
export const authenticateUser = createAsyncThunk(
  'auth/authenticateUser',
  async (accessToken: RedditToken, { rejectWithValue }) => {
    try {
      // Store token first
      SecureTokenStorage.setToken(accessToken);
      
      // Fetch user info from Reddit
      const userInfo = await fetchUserInfo(accessToken);
      
      return { accessToken, userInfo };
    } catch (error) {
      // Clear token if user info fetch fails
      SecureTokenStorage.clearToken();
      return rejectWithValue(error instanceof Error ? error.message : 'Authentication failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action: PayloadAction<{ accessToken: RedditToken, userInfo?: UserInfo }>) => {
      state.accessToken = action.payload.accessToken;
      state.userInfo = action.payload.userInfo || null;
      state.isAuthenticated = true;
    },
    updateLoginStatus: (state) => {
      if (state.isAuthenticated) {
        if (!SecureTokenStorage.hasValidToken()) {
          SecureTokenStorage.clearToken();
          state.accessToken = null;
          state.userInfo = null;
          state.isAuthenticated = false;
        }
      }
    },
    logout: (state) => {
      SecureTokenStorage.clearToken();
      state.accessToken = null;
      state.userInfo = null;
      state.isAuthenticated = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(authenticateUser.pending, () => {
        // Keep current state during authentication
      })
      .addCase(authenticateUser.fulfilled, (state, action) => {
        state.accessToken = action.payload.accessToken;
        state.userInfo = action.payload.userInfo;
        state.isAuthenticated = true;
      })
      .addCase(authenticateUser.rejected, (state) => {
        state.accessToken = null;
        state.userInfo = null;
        state.isAuthenticated = false;
      });
  }
});

export const { loginSuccess, updateLoginStatus, logout } = authSlice.actions;
export default authSlice.reducer;