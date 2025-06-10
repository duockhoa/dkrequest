import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getRequestApprover } from '../../services/requestApproverService';

const fetchRequestApprovers = createAsyncThunk(
    'requestApprover/fetchRequestApprovers',
    async ({ requestTypeId, userId }) => {
        const response = await getRequestApprover(requestTypeId, userId);
        if (response) {
            return response;
        } else {
            throw new Error('Không thể lấy danh sách người phê duyệt');
        }
    },
);

const requestApproverSlice = createSlice({
    name: 'requestApprover',
    initialState: {
        approverData: [],
        loading: false,
        error: null,
    },
    reducers: {
        setApproverData: (state, action) => {
            state.approverData = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchRequestApprovers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchRequestApprovers.fulfilled, (state, action) => {
                state.approverData = action.payload;
                state.loading = false;
            })
            .addCase(fetchRequestApprovers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export { fetchRequestApprovers };
export const { setApproverData } = requestApproverSlice.actions;
export default requestApproverSlice.reducer;
