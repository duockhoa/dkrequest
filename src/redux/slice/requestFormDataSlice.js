import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    value: {
        requestName: '',
        requestor_id: '',
        requestType_id: '',
        approvers: [],
        followers: [],
    },
    errors: {
        requestName: '',
        requestor_id: '',
        requestType_id: '',
        approvers: '',
        followers: '',
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
            };
        },
        clearRequestFormData: (state) => {
            state.value = initialState.value;
            state.errors = initialState.errors;
        },
        updateLeaveRegistration: (state, action) => {
            state.value.leave_registration = {
                ...state.value.leave_registration,
                ...action.payload,
            };
        },
        setFieldError: (state, action) => {
            const { field, message } = action.payload;
            if (field.includes('leave_registration.')) {
                const leaveField = field.split('.')[1];
                state.errors.leave_registration[leaveField] = message;
            } else {
                state.errors[field] = message;
            }
        },
        clearErrors: (state) => {
            state.errors = initialState.errors;
        },
        setFormErrors: (state, action) => {
            state.errors = {
                ...initialState.errors,
                ...action.payload,
            };
        },
    },
});

export const {
    setRequestFormData,
    clearRequestFormData,
    updateLeaveRegistration,
    setFieldError,
    clearErrors,
    setFormErrors,
} = requestFormData.actions;

export default requestFormData.reducer;
