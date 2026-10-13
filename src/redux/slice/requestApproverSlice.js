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
        activeRequestId: null,
        loadedFor: null,
    },
    reducers: {
        setApproverData: (state, action) => {
            state.approverData = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchRequestApprovers.pending, (state, action) => {
                state.loading = true;
                state.error = null;
                state.approverData = [];
                state.loadedFor = null;
                state.activeRequestId = action.meta.requestId;
            })
            .addCase(fetchRequestApprovers.fulfilled, (state, action) => {
                if (state.activeRequestId !== action.meta.requestId) return;
                state.approverData = action.payload;
                state.loading = false;
                state.loadedFor = action.meta.arg;
            })
            .addCase(fetchRequestApprovers.rejected, (state, action) => {
                if (state.activeRequestId !== action.meta.requestId) return;
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export { fetchRequestApprovers };
export const { setApproverData } = requestApproverSlice.actions;
export default requestApproverSlice.reducer;
