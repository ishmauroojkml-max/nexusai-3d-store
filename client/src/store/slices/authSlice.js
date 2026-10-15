import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

const getUserFromStorage = () => {
  try {
    const user = localStorage.getItem('nexusai_user');
    const token = localStorage.getItem('nexusai_token');
    return user ? { user: JSON.parse(user), token, isAuthenticated: true } : null;
  } catch { return null; }
};

const savedAuth = getUserFromStorage();

export const loginUser = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/auth/login', credentials);
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Login failed');
  }
});

export const registerUser = createAsyncThunk('auth/register', async (userData, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/auth/register', userData);
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Registration failed');
  }
});

export const demoLogin = createAsyncThunk('auth/demoLogin', async (role, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/auth/demo-login', { role });
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Demo login failed');
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: savedAuth?.user || null,
    token: savedAuth?.token || null,
    isAuthenticated: !!savedAuth,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('nexusai_user');
      localStorage.removeItem('nexusai_token');
    },
    clearError: (state) => { state.error = null; },
    setUser: (state, action) => { state.user = action.payload; },
  },
  extraReducers: (builder) => {
    const handlePending = (state) => { state.loading = true; state.error = null; };
    const handleFulfilled = (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.accessToken;
      state.isAuthenticated = true;
      localStorage.setItem('nexusai_user', JSON.stringify(action.payload.user));
      localStorage.setItem('nexusai_token', action.payload.accessToken);
    };
    const handleRejected = (state, action) => {
      state.loading = false;
      state.error = action.payload;
    };
    builder
      .addCase(loginUser.pending, handlePending)
      .addCase(loginUser.fulfilled, handleFulfilled)
      .addCase(loginUser.rejected, handleRejected)
      .addCase(registerUser.pending, handlePending)
      .addCase(registerUser.fulfilled, handleFulfilled)
      .addCase(registerUser.rejected, handleRejected)
      .addCase(demoLogin.pending, handlePending)
      .addCase(demoLogin.fulfilled, handleFulfilled)
      .addCase(demoLogin.rejected, handleRejected);
  },
});

export const { logout, clearError, setUser } = authSlice.actions;
export const selectUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectIsAdmin = (state) => state.auth.user?.role === 'admin';
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;
export default authSlice.reducer;

