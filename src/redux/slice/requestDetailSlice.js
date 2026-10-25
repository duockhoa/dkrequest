import { createSlice } from '@reduxjs/toolkit';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { getRequestByIdService } from '../../services/requestService';

const fetchRequestDetail = createAsyncThunk('requestDetail/fetchRequestDetail', async (id, { signal }) => {
    const response = await getRequestByIdService(id, signal);
    if (response) {
        return response;
    } else {
        throw new Error('Không thể lấy danh sách phòng ban');
    }
});

const requestSlice = createSlice({
    name: 'requestDetail',
    initialState: {
        requestDetailvalue: {},
        currentRequestId: null,
        loading: false,
        error: null,
    },
    reducers: {
        clearRequestDetail: state => {
            state.requestDetailvalue = {};
            state.currentRequestId = null;
            state.loading = false;
            state.error = null;
        },
        setRequestDetail: (state, action) => {
            state.requestDetailvalue = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchRequestDetail.pending, (state, action) => {
                state.currentRequestId = action.meta.requestId;
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchRequestDetail.fulfilled, (state, action) => {
                if (state.currentRequestId !== action.meta.requestId) return;
                state.currentRequestId = null;
                state.requestDetailvalue = action.payload;
                state.loading = false;
            })
            .addCase(fetchRequestDetail.rejected, (state, action) => {
                if (state.currentRequestId !== action.meta.requestId) return;
                state.currentRequestId = null;
                state.loading = false;
                state.error = action.meta.aborted ? null : action.error.message;
            });
    },
});

export { fetchRequestDetail };
export const { setRequestDetail } = requestSlice.actions;
export default requestSlice.reducer;
