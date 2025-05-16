import { createSlice, isAction } from '@reduxjs/toolkit';

const sideBarSlice = createSlice({
    name: 'sidebar',
    initialState: {
        activeSideBar: '',
        activeCollapse: [],
    },
    reducers: {
        setActiveCollapse: (state, action) => {
            const item = action.payload;
            if (state.activeCollapse.includes(item)) {
                state.activeCollapse = state.activeCollapse.filter(i => i !== item);
            } else {
                state.activeCollapse.push(item);
            }
        },
        setActiveSideBar: (state, action) => {
            state.activeSideBar = action.payload
        },
    },
});

export const { setActiveCollapse, setActiveSideBar } = sideBarSlice.actions;
export default sideBarSlice.reducer;
