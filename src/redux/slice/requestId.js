import { createSlice } from '@reduxjs/toolkit';

const requestIdSlice = createSlice({
    name: 'requestId',
    initialState: {
        requestId: null,
        requestTypeId: null,
        department: 'ĐBCL',
        previousRequestId: null,
        previousRequestTypeId: null,
    },
    reducers: {
        setRequestId: (state, action) => {
            state.requestId = action.payload;
        },
        setRequestTypeId: (state, action) => {
            state.requestTypeId = action.payload;
        },
        setDepartment: (state, action) => {
            state.department = action.payload;
        },
        clearRequestId: (state) => {
            state.requestId = null;
        },
    },
});

export const { setRequestId, setRequestTypeId, clearRequestId, setDepartment } = requestIdSlice.actions;
export default requestIdSlice.reducer;
