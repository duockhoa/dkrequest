import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getItems } from '../../services/itemsService';

const fetchItems = createAsyncThunk('items/fetchItems', async () => {
    const response = await getItems();
    if (response) {
        return response;
    } else {
        throw new Error('Không thể lấy danh sách mặt hàng');
    }
});

const itemsSlice = createSlice({
    name: 'items',
    initialState: {
        items: [],
        loading: false,
        error: null,
    },
    reducers: {
        setItems: (state, action) => {
            state.items = action.payload;
        },
        clearItems: (state) => {
            state.items = [];
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchItems.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchItems.fulfilled, (state, action) => {
                state.items = action.payload;
                state.loading = false;
            })
            .addCase(fetchItems.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export const { setItems, clearItems, clearError } = itemsSlice.actions;
export { fetchItems };
export default itemsSlice.reducer;
