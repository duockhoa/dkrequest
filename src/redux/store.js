import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slice/userSlice';
import sideBarSlice from './slice/sibarSlice';
import searchReducer from './slice/searchSlice';    

export default configureStore({
    reducer: {
        user: userReducer,
        sidebar: sideBarSlice,
        search: searchReducer,
    },
});
