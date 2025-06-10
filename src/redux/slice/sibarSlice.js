import { createSlice } from '@reduxjs/toolkit';

const sidebarSlice = createSlice({
    name: 'sidebar',
    initialState: {
        activeSideBar: '/',
        requestTypeId: 0,
        activeCollapse: ['Tổ chức', 'Kế Toán'],
        isSidebarOpen: true,
    },
    reducers: {
        setActiveCollapse: (state, action) => {
            const item = action.payload;
            if (state.activeCollapse.includes(item)) {
                state.activeCollapse = state.activeCollapse.filter((i) => i !== item);
            } else {
                state.activeCollapse.push(item);
            }
        },
        setActiveSideBar: (state, action) => {
            state.activeSidebar = action.payload;
        },
        setRequestTypeId: (state, action) => {
            state.requestTypeId = action.payload;
        },
    },
});

export const { setActiveCollapse, setActiveSideBar, setRequestTypeActive, setRequestTypeId } = sidebarSlice.actions;
export default sidebarSlice.reducer;
