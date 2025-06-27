import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { createRequestService } from '../../services/requestService'; // Import any necessary service if needed

const fetchCreateRequest = createAsyncThunk('requestFormData/fetchCreateRequest', async (payload) => {
    const response = await createRequestService(payload);
    if (response) {
        return response;
    } else {
        throw new Error('Không thể tạo yêu cầu');
    }
});

const initialState = {
    value: {
        requestName: '',
        requestor_id: '',
        requestType_id: '',
        approvers: [],
        followers: [],
        files: {}, // Add files object to store different file types
    },
    errors: {},
    loading: false,
    error: null,
};

const requestFormDataSlice = createSlice({
    name: 'requestFormData',
    initialState,
    reducers: {
        setRequestFormData: (state, action) => {
            state.value = action.payload;
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

        // Add specific file operations
        addFiles: (state, action) => {
            const { fieldName, files } = action.payload;
            if (!state.value.files) {
                state.value.files = {};
            }
            if (!state.value.files[fieldName]) {
                state.value.files[fieldName] = [];
            }
            state.value.files[fieldName].push(...files);
        },

        removeFile: (state, action) => {
            const { fieldName, fileId } = action.payload;
            if (state.value.files && state.value.files[fieldName]) {
                state.value.files[fieldName] = state.value.files[fieldName].filter((file) => file.id !== fileId);
            }
        },

        clearFiles: (state, action) => {
            const { fieldName } = action.payload;
            if (state.value.files && fieldName) {
                state.value.files[fieldName] = [];
            } else {
                state.value.files = {};
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCreateRequest.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCreateRequest.fulfilled, (state, action) => {
                state.value = action.payload; // Assuming the payload contains the created request data
                state.loading = false;
            })
            .addCase(fetchCreateRequest.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export const {
    setRequestFormData,
    clearRequestFormData,
    updateLeaveRegistration,
    setFieldError,
    clearErrors,
    setFormErrors,
    addFiles,
    removeFile,
    clearFiles,
} = requestFormDataSlice.actions;
export { fetchCreateRequest };

export default requestFormDataSlice.reducer;
