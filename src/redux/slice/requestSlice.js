import { createSlice } from '@reduxjs/toolkit';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { getAllRequestService } from '../../services/requestService';

const fetchRequests = createAsyncThunk('request/fetchRequests', async ({ requestTypeId, user_id, page, pageSize }, { signal }) => {
    const response = await getAllRequestService(requestTypeId, user_id, page, pageSize, signal);
    if (response) {
        return response;
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
        originalData: [], 
        page: 1,
        totalPages: 1,
        total: 0,
        pageSize: 100,
        listRequestTypeId: null,
        currentRequestId: null,
        loading: false,
        error: null,
    },
    reducers: {
        setRequestData: (state, action) => {
            state.requestData = action.payload;
        },
        setPage: (state, action) => {
            state.page = action.payload;
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
            .addCase(fetchRequests.pending, (state, action) => {
                state.currentRequestId = action.meta.requestId;
                state.listRequestTypeId = action.meta.arg.requestTypeId;
                state.page = action.meta.arg.page || 1;
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchRequests.fulfilled, (state, action) => {
                if (state.currentRequestId !== action.meta.requestId) return;
                state.currentRequestId = null;
                state.requestData = action.payload.result;
                state.originalData = action.payload.result;
                state.page = action.payload.pagination.page;
                state.totalPages = action.payload.pagination.totalPages;
                state.total = action.payload.pagination.total;

                state.loading = false;
            })
            .addCase(fetchRequests.rejected, (state, action) => {
                if (state.currentRequestId !== action.meta.requestId) return;
                state.currentRequestId = null;
                state.loading = false;
                state.error = action.meta.aborted ? null : action.error.message;
            });
    },
});

export { fetchRequests };
export const { setRequestData, filterRequests , setPage } = requestSlice.actions;
export default requestSlice.reducer;
