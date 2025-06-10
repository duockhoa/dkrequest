import { createSlice } from '@reduxjs/toolkit';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { getDepartmentsServiceInclude } from '../../services/departmentService';

const fetchDepartments = createAsyncThunk('department/fetchDepartments', async () => {
    const response = await getDepartmentsServiceInclude();
    if (response) {
        return response;
    } else {
        throw new Error('Không thể lấy danh sách phòng ban');
    }
});

const departmentSlice = createSlice({
    name: 'department',
    initialState: {
        departments: [],
        loading: false,
        error: null,
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchDepartments.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchDepartments.fulfilled, (state, action) => {
                state.departments = action.payload;
                state.loading = false;
            })
            .addCase(fetchDepartments.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export const { setDepartments } = departmentSlice.actions;
export { fetchDepartments };
export default departmentSlice.reducer;
