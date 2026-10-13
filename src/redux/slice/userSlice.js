import { createAsyncThunk } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import { getMe, getRequestReportPermissions } from '../../services/usersService';

const fetchUser = createAsyncThunk('user/fetchUser', async () => {
    const response = await getMe();
    return response.data;
});

const fetchReportPermissions = createAsyncThunk('user/fetchReportPermissions', async () => {
    return getRequestReportPermissions();
});

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        userInfo: {
            id: '',
            name: '',
            email: '',
            phone: '',
            avatar: '',
            createdAt: '',
            updatedAt: '',
        },
        loading: false,
        error: null,
        onEditUser: false,
    },
    reducers: {
        setOnEdit: (state, action) => {
            state.onEditUser = action.payload;
        },
        setUserInfo: (state, action) => {
            state.userInfo = action.payload;
        },
    },

    extraReducers: (builder) => {
        builder.addCase(fetchUser.fulfilled, (state, action) => {
            if (action.payload) {
                state.userInfo = action.payload;
            }
            state.loading = false;
            state.error = null;
        });
        builder.addCase(fetchUser.pending, (state) => {
            state.error = null;
            state.loading = true;
        });
        builder.addCase(fetchUser.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        });
        builder.addCase(fetchReportPermissions.fulfilled, (state, action) => {
            if (state.userInfo.id !== action.meta.arg) return;
            state.userInfo.permissions = {
                ...state.userInfo.permissions,
                exportFuelPaymentReport: action.payload.exportFuelPaymentReport === true,
            };
        });
        builder.addCase(fetchReportPermissions.rejected, (state, action) => {
            if (state.userInfo.id !== action.meta.arg) return;
            state.userInfo.permissions = {
                ...state.userInfo.permissions,
                exportFuelPaymentReport: false,
            };
        });
    },
});

export { fetchUser, fetchReportPermissions };
export const { setOnEdit, setUserInfo } = userSlice.actions;
export default userSlice.reducer;
