import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getAllRequestTypeService } from '../../services/requestTypeService';

const CACHE_TTL_MS = 5 * 60 * 1000;
export const fetchRequestTypes = createAsyncThunk('requestTypes/fetch', getAllRequestTypeService, {
    condition: (_, { getState }) => {
        const state = getState().requestTypes;
        return !state.loading && (!state.loadedAt || Date.now() - state.loadedAt >= CACHE_TTL_MS);
    },
});

const slice = createSlice({
    name: 'requestTypes',
    initialState: { data: [], loading: false, loadedAt: null, error: null },
    reducers: {},
    extraReducers: builder => builder
        .addCase(fetchRequestTypes.pending, state => { state.loading = true; state.error = null; })
        .addCase(fetchRequestTypes.fulfilled, (state, action) => {
            state.data = action.payload;
            state.loading = false;
            state.loadedAt = Date.now();
        })
        .addCase(fetchRequestTypes.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        }),
});
export default slice.reducer;
