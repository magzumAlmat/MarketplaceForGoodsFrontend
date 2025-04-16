import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
// import END_POINT from '@/components/config/index';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { END_POINT } from '../../components/config';
// import { setAuth, setError } from './authSlice';

import jwtDecode from 'jwt-decode';

const initialState = {
  isAuth: false,
  currentUser: null,
  authToken: null,
  error: null,
  uploadProgress: 0,
  
};
const host = "http://localhost:8000"
export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth: (state, action) => {
      const { token, user } = action.payload;
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', token);
      }
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      state.authToken = token;
      state.currentUser = user;
      state.isAuth = true;
      state.error = null;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    setUploadProgress: (state, action) => {
      state.uploadProgress = action.payload;
    },
    clearUploadProgress: (state) => {
      state.uploadProgress = 0;
    },
    logout: (state) => {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
      }
      axios.defaults.headers.common['Authorization'] = '';
      state.authToken = null;
      state.currentUser = null;
      state.isAuth = false;
      state.error = null;
    },
  },
});

export const { setAuth, setError, clearError, setUploadProgress, clearUploadProgress, logout } = authSlice.actions;


export const loginAction = createAsyncThunk(
  'auth/login',
  async ({ username, password }, { dispatch, rejectWithValue }) => {
    try {
      console.log('loginAction: Starting with', { username, password });
      
      const response = await axios.post(`http://localhost:8000/api/auth/login`, {
        username,
        password,
      });
      
      console.log('loginAction: Server response:', response.data);
      
      const { token, user } = response.data;
      
      if (!token || !user || !user.id || !user.username) {
        throw new Error('Некорректный ответ сервера');
      }
      
      const userData = {
        id: user.id,
        username: user.username,
      };
      
      dispatch(setAuth({ token, user: userData }));
      
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Ошибка входа';
      console.error('loginAction: Error:', {
        message: errorMessage,
        status: error.response?.status,
        details: error.response?.data || error.message,
      });
      dispatch(setError(errorMessage));
      return rejectWithValue(errorMessage);
    }
  }
);
export const checkAuth = () => async (dispatch) => {
  if (typeof window === 'undefined') {
    console.log('checkAuth: Skipping on server-side');
    return;
  }
  
  const token = localStorage.getItem('token');
  console.log('checkAuth: Token retrieved', { tokenExists: !!token });
  
  if (!token) {
    console.log('checkAuth: No token found, dispatching logout');
    dispatch(logout());
    return;
  }
  
  try {
    const decoded = jwtDecode(token);
    console.log('checkAuth: Token decoded', decoded);
    
    const isExpired = decoded.exp * 1000 < Date.now();
    if (isExpired) {
      console.log('checkAuth: Token expired, removing token and dispatching logout');
      localStorage.removeItem('token');
      dispatch(logout());
      return;
    }
    
    if (!decoded.id || !decoded.username) {
      throw new Error('Токен не содержит необходимых данных пользователя');
    }
    
    const user = {
      id: decoded.id,
      username: decoded.username,
    };
    
    dispatch(setAuth({ token, user }));
    console.log('checkAuth: Authentication successful', user);
  } catch (error) {
    console.error('checkAuth: Error occurred', {
      message: error.message,
      details: error,
    });
    localStorage.removeItem('token');
    dispatch(logout());
  }
};

export const logoutAction = () => (dispatch) => {
  dispatch(logout());
};

export default authSlice.reducer;