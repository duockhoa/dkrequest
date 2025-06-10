import { createSlice } from '@reduxjs/toolkit';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { getRequestByIdService } from '../../services/requestService';

const fetchRequestDetail = createAsyncThunk('requestDetail/fetchRequestDetail', async (id) => {
    const response = await getRequestByIdService(id);
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
        loading: false,
        error: null,
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchRequestDetail.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchRequestDetail.fulfilled, (state, action) => {
                state.requestDetailvalue = action.payload;
                state.loading = false;
            })
            .addCase(fetchRequestDetail.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export { fetchRequestDetail };
export default requestSlice.reducer;
