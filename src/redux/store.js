import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slice/userSlice';
import sidebarSlice from './slice/sibarSlice';
import searchReducer from './slice/searchSlice';
import departmetReducer from './slice/departmentSlice';
import requestReducer from './slice/requestSlice';
import requestFormDataReducer from './slice/requestFormDataSlice';
import usersReducer from './slice/usersSlice';
import requestApproverReducer from './slice/requestApproverSlice';
import requestDetailReducer from './slice/requestDetailSlice';
import requestIdReducer from './slice/requestId';
import commentReducer from './slice/commentSlice';
import notificationReducer from './slice/notificationSlice';
import itemsReducer from './slice/itemsSlice';
export default configureStore({
    reducer: {
        user: userReducer,
        sidebar: sidebarSlice,
        search: searchReducer,
        department: departmetReducer,
        request: requestReducer,
        requestFormData: requestFormDataReducer,
        users: usersReducer,
        requestApprover: requestApproverReducer,
        requestDetail: requestDetailReducer,
        requestId: requestIdReducer,
        comment: commentReducer,
        notification: notificationReducer,
        items: itemsReducer,
    },
});
