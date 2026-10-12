import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  registerUserApi,
  getUserApi,
  loginUserApi,
  forgotPasswordApi,
  resetPasswordApi,
  updateUserApi,
  logoutApi,
  saveTokens
} from '../utils/burger-api';
import { TUser } from '@utils-types';
import { deleteCookie, setCookie } from '../utils/cookie';

interface AuthState {
  user: TUser | null;
  isAuthChecked: boolean;
  isLoading: boolean;
  error: string | null;
  resetEmailSent: boolean;
}

const initialState: AuthState = {
  isAuthChecked: false,
  user: null,
  isLoading: false,
  error: null,
  resetEmailSent: false
};

export const forgotPasswordAsync = createAsyncThunk<
  void,
  { email: string },
  { rejectValue: string }
>('user/forgotPassword', async (data, { rejectWithValue }) => {
  try {
    await forgotPasswordApi(data);
  } catch (error: any) {
    return rejectWithValue(error.message || 'Ошибка восстановления пароля');
  }
});

export const resetPasswordAsync = createAsyncThunk<
  void,
  { password: string; token: string },
  { rejectValue: string }
>('user/resetPassword', async (data, { rejectWithValue }) => {
  try {
    await resetPasswordApi(data);
  } catch (error: any) {
    return rejectWithValue(error.message || 'Ошибка сброса пароля');
  }
});

export const updateUserAsync = createAsyncThunk<
  TUser,
  Partial<TUser>,
  { rejectValue: string }
>('user/update', async (userData, { rejectWithValue }) => {
  try {
    const response = await updateUserApi(userData);
    return response.user;
  } catch (error: any) {
    return rejectWithValue(error.message || 'Не удалось обновить пользователя');
  }
});

export const logoutAsync = createAsyncThunk<
  void,
  void,
  { rejectValue: string }
>('user/logoutUser', async (_, { dispatch, rejectWithValue }) => {
  try {
    await logoutApi();
    localStorage.removeItem('refreshToken');
    deleteCookie('accessToken');
    dispatch(userLogout());
  } catch (err: any) {
    console.error('Ошибка выполнения выхода', err);
    return rejectWithValue(err?.message || 'Ошибка выполнения выхода');
  }
});

export const registerUserAsync = createAsyncThunk(
  'user/register',
  async (userData: { email: string; password: string; name: string }) => {
    const response = await registerUserApi(userData);
    saveTokens(response);
    return response.user;
  }
);

export const loginUserAsync = createAsyncThunk(
  'user/login',
  async (
    userData: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await loginUserApi(userData);
      setCookie('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      return response.user;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Ошибка авторизации');
    }
  }
);

export const getUser = createAsyncThunk<TUser, void, { rejectValue: string }>(
  'user/getUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getUserApi();
      return response.user;
    } catch (error) {
      return rejectWithValue('Не удалось получить данные пользователя');
    }
  }
);

export const checkUserAuth = createAsyncThunk(
  'user/checkUser',
  async (_, { dispatch }) => {
    if (document.cookie.includes('accessToken')) {
      await dispatch(getUser());
    }
    dispatch(authChecked());
  }
);

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    authChecked: (state) => {
      state.isAuthChecked = true;
    },
    userLogout: (state) => {
      state.user = null;
    }
  },
  selectors: {
    userSelector(state) {
      return state.user;
    }
  },
  extraReducers: (builder) => {
    builder

      .addCase(updateUserAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserAsync.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isLoading = false;
      })
      .addCase(updateUserAsync.rejected, (state, action) => {
        state.error = action.payload || 'Ошибка обновления';
        state.isLoading = false;
      })

      .addCase(forgotPasswordAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.resetEmailSent = false;
      })
      .addCase(forgotPasswordAsync.fulfilled, (state) => {
        state.isLoading = false;
        state.resetEmailSent = true;
      })
      .addCase(forgotPasswordAsync.rejected, (state, action) => {
        state.error = action.payload || 'Ошибка восстановления пароля';
        state.isLoading = false;
      })

      .addCase(resetPasswordAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(resetPasswordAsync.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(resetPasswordAsync.rejected, (state, action) => {
        state.error = action.payload || 'Ошибка сброса пароля';
        state.isLoading = false;
      })

      .addCase(registerUserAsync.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthChecked = true;
      })

      .addCase(loginUserAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUserAsync.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthChecked = true;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(loginUserAsync.rejected, (state, action) => {
        state.error = action.payload as string;
        state.isLoading = false;
      })
      .addCase(getUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUser.fulfilled, (state, action: PayloadAction<TUser>) => {
        state.user = action.payload;
        state.isLoading = false;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.user = null;
        state.error = action.payload as string;
        state.isLoading = false;
      });
  }
});

export const { userSelector } = userSlice.selectors;
export const { authChecked, userLogout } = userSlice.actions;
export default userSlice.reducer;
