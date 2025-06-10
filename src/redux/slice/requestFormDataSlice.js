import { createSlice } from '@reduxjs/toolkit';

const initialLeaveRegistration = {
    start_time: '',
    end_time: '',
    hours: '',
    reason: '',
    description: '',
    handover: '',
};

const initialState = {
    value: {
        requestName: '',
        requestor_id: '',
        requestType_id: '',
        approvers: [],
        followers: [],
        leave_registration: initialLeaveRegistration,
    },
};

const requestFormData = createSlice({
    name: 'requestFormData',
    initialState,
    reducers: {
        setRequestFormData: (state, action) => {
            state.value = {
                ...state.value,
                ...action.payload,
                leave_registration: {
                    ...initialLeaveRegistration,
                    ...state.value.leave_registration,
                    ...action.payload.leave_registration,
                },
            };
        },
        clearRequestFormData: (state) => {
            state.value = initialState.value;
        },
        updateLeaveRegistration: (state, action) => {
            state.value.leave_registration = {
                ...state.value.leave_registration,
                ...action.payload,
            };
        },
    },
});

export const { setRequestFormData, clearRequestFormData, updateLeaveRegistration } = requestFormData.actions;
export default requestFormData.reducer;
