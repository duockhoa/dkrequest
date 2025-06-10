import { createSlice } from '@reduxjs/toolkit';

const requestIdSlice = createSlice({
    name: 'requestId',
    initialState: {
        requestId: null,
        requestTypeId: null,
        previousRequestId: null,
        previousRequestTypeId: null,
    },
    reducers: {
        setRequestId: (state, action) => {
            state.previousRequestId = state.requestId;
            state.requestId = action.payload;
        },
        setRequestTypeId: (state, action) => {
            state.previousRequestTypeId = state.requestTypeId;
            state.requestTypeId = action.payload;
        },
        clearRequestIds: (state) => {
            state.previousRequestId = state.requestId;
            state.previousRequestTypeId = state.requestTypeId;
            state.requestId = null;
            state.requestTypeId = null;
        },
    },
});

export const { setRequestId, setRequestTypeId, clearRequestIds } = requestIdSlice.actions;
export default requestIdSlice.reducer;
