import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getRequestFollower } from '../../services/requestFollowerService';

const fetchRequestFollowers = createAsyncThunk(
    'requestFollower/fetchRequestFollowers',
    async ({ requestTypeId, userId }) => {
        const response = await getRequestFollower(requestTypeId, userId);
        if (response) {
            return response;
        } else {
            throw new Error('Không thể lấy danh sách người phê duyệt');
        }
    },
);

const requestFollowerSlice = createSlice({
    name: 'requestFollower',
    initialState: {
        followerData: [],
        loading: false,
        error: null,
    },
    reducers: {
        setFollowerData: (state, action) => {
            state.followerData = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchRequestFollowers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchRequestFollowers.fulfilled, (state, action) => {
                state.followerData = action.payload;
                state.loading = false;
            })
            .addCase(fetchRequestFollowers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export { fetchRequestFollowers };
export const { setFollowerData } = requestFollowerSlice.actions;
export default requestFollowerSlice.reducer;
