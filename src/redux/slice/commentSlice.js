import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getCommentsByRequestIdService, createCommentService } from '../../services/commentService';

// Fetch comments thunk
export const fetchComments = createAsyncThunk('comments/fetchComments', async (requestId, { signal }) => {
    const response = await getCommentsByRequestIdService(requestId, signal);
    if (response) {
        return response;
    } else {
        throw new Error('Không thể lấy danh sách bình luận');
    }
});

// Create comment thunk
export const createComment = createAsyncThunk('comments/createComment', async (payload) => {
    const response = await createCommentService(payload);
    if (response) {
        return response;
    } else {
        throw new Error('Không thể tạo bình luận');
    }
});

const commentSlice = createSlice({
    name: 'comments',
    initialState: {
        comments: [],
        requestId: null,
        activeFetchId: null,
        activeCreateId: null,
        createdDuringFetch: [],
        submitting: false,
        loading: false,
        error: null,
    },
    reducers: {
        clearComments: (state) => {
            state.comments = [];
            state.requestId = null;
            state.activeFetchId = null;
            state.activeCreateId = null;
            state.createdDuringFetch = [];
            state.loading = false;
            state.submitting = false;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch comments cases
            .addCase(fetchComments.pending, (state, action) => {
                if (String(state.requestId) !== String(action.meta.arg)) {
                    state.comments = [];
                    state.submitting = false;
                    state.activeCreateId = null;
                }
                state.requestId = action.meta.arg;
                state.activeFetchId = action.meta.requestId;
                state.createdDuringFetch = [];
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchComments.fulfilled, (state, action) => {
                if (state.activeFetchId !== action.meta.requestId) return;
                const fetchedIds = new Set(action.payload.map(comment => comment.id));
                state.comments = [...action.payload, ...state.createdDuringFetch.filter(comment => !fetchedIds.has(comment.id))];
                state.createdDuringFetch = [];
                state.activeFetchId = null;
                state.loading = false;
            })
            .addCase(fetchComments.rejected, (state, action) => {
                if (state.activeFetchId !== action.meta.requestId) return;
                state.activeFetchId = null;
                state.loading = false;
                state.error = action.meta.aborted ? null : action.error.message;
            })
            // Create comment cases
            .addCase(createComment.pending, (state, action) => {
                state.activeCreateId = action.meta.requestId;
                state.submitting = true;
                state.error = null;
            })
            .addCase(createComment.fulfilled, (state, action) => {
                if (state.activeCreateId !== action.meta.requestId) return;
                state.activeCreateId = null;
                state.submitting = false;
                if (String(state.requestId) !== String(action.payload.request_id)) return;
                if (!state.comments.some(comment => comment.id === action.payload.id)) state.comments.push(action.payload);
                if (state.loading) state.createdDuringFetch.push(action.payload);
            })
            .addCase(createComment.rejected, (state, action) => {
                if (state.activeCreateId !== action.meta.requestId) return;
                state.activeCreateId = null;
                state.submitting = false;
                state.error = action.error.message;
            });
    },
});

export const { clearComments } = commentSlice.actions;
export default commentSlice.reducer;
