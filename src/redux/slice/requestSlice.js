import { createSlice } from '@reduxjs/toolkit';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { getAllRequestService } from '../../services/requestService';

const fetchRequests = createAsyncThunk('request/fetchRequests', async (requestTypeId) => {
    const response = await getAllRequestService(requestTypeId);
    if (response) {
        const sortedResponse = [...response].sort((a, b) => {
            return new Date(b.createAt) - new Date(a.createAt);
        });
        return sortedResponse;
    } else {
        throw new Error('Không thể lấy danh sách yêu cầu');
    }
});

// Add this helper function at the top of the file
const removeDiacritics = (str) => {
    return str
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase();
};

const requestSlice = createSlice({
    name: 'request',
    initialState: {
        requestData: [],
        originalData: [], // Add this to store original unfiltered data
        loading: false,
        error: null,
    },
    reducers: {
        setRequestData: (state, action) => {
            state.requestData = action.payload;
        },
        filterRequests: (state, action) => {
            const searchValue = removeDiacritics(action.payload);
            if (!searchValue) {
                state.requestData = state.originalData;
            } else {
                state.requestData = state.originalData.filter((request) => {
                    const nameMatch = removeDiacritics(request.requestName).includes(searchValue);
                    const requestorMatch = request.requestor?.name
                        ? removeDiacritics(request.requestor.name).includes(searchValue)
                        : false;
                    const statusMatch = request.status ? removeDiacritics(request.status).includes(searchValue) : false;

                    return nameMatch || requestorMatch || statusMatch;
                });
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchRequests.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchRequests.fulfilled, (state, action) => {
                state.requestData = action.payload;
                state.originalData = action.payload; // Store original data
                state.loading = false;
            })
            .addCase(fetchRequests.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export { fetchRequests };
export const { setRequestData, filterRequests } = requestSlice.actions;
export default requestSlice.reducer;
