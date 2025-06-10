import { createSlice } from '@reduxjs/toolkit';

const sidebarSlice = createSlice({
    name: 'sidebar',
    initialState: {
        activeSidebar: '/',
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
    },
});

export const { setActiveCollapse, setActiveSideBar, setRequestTypeActive } = sidebarSlice.actions;
export default sidebarSlice.reducer;
