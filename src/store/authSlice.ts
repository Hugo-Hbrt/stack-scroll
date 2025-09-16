import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { SecureTokenStorage } from '@utils/tokenStorage/tokenStorage';
import { type RedditToken } from '@utils/tokenStorage/tokenStorage';

interface AuthState {
  isAuthenticated: boolean;
  accessToken: RedditToken | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  accessToken: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action: PayloadAction<{ accessToken: RedditToken }>) => {
      state.accessToken = action.payload.accessToken;
      state.isAuthenticated = true;
    },
    updateLoginStatus: (state) => {
      if (state.isAuthenticated) {
        if (!SecureTokenStorage.hasValidToken()) {
          SecureTokenStorage.clearToken();
          state.accessToken = null
          state.isAuthenticated = false;
        }
      }
    },
    logout: (state) => {
      SecureTokenStorage.clearToken();
      state.accessToken = null;
      state.isAuthenticated = false;
    },
  }
});

export const { loginSuccess, updateLoginStatus, logout } = authSlice.actions;
export default authSlice.reducer;