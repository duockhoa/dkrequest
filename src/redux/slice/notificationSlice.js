import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
    getNotificationsByUserId,
    markNotificationAsRead,
    markAllNotificationsAsRead,
} from '../../services/notificationService';
import { set } from 'date-fns';

// Fetch notifications thunk
export const fetchNotifications = createAsyncThunk('notifications/fetchNotifications', async (userId) => {
    const response = await getNotificationsByUserId(userId);
    if (response) {
        return response;
    } else {
        throw new Error('Không thể lấy danh sách thông báo');
    }
});

// Mark notification as read thunk
export const markAsRead = createAsyncThunk('notifications/markAsRead', async (notificationId) => {
    const response = await markNotificationAsRead(notificationId);
    if (response) {
        return { notificationId, ...response };
    } else {
        throw new Error('Không thể đánh dấu thông báo đã đọc');
    }
});

// Mark all notifications as read thunk
export const markAllAsRead = createAsyncThunk('notifications/markAllAsRead', async (userId) => {
    const response = await markAllNotificationsAsRead(userId);
    if (response) {
        return response;
    } else {
        throw new Error('Không thể đánh dấu tất cả thông báo đã đọc');
    }
});

const notificationSlice = createSlice({
    name: 'notifications',
    initialState: {
        notifications: [],
        unreadCount: 0,
        loading: false,
        error: null,
    },
    reducers: {
        clearNotifications: (state) => {
            state.notifications = [];
            state.unreadCount = 0;
            state.error = null;
        },
        addNewNotification: (state, action) => {
            state.notifications.unshift(action.payload);
            if (!action.payload.is_read) {
                state.unreadCount += 1;
            }
        },
        setNotifications: (state, action) => {
            state.notifications = action.payload;
            state.unreadCount = action.payload.filter((n) => !n.is_read).length;
        },
        updateUnreadCount: (state) => {
            state.unreadCount = state.notifications.filter((n) => !n.is_read).length;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch notifications cases
            .addCase(fetchNotifications.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchNotifications.fulfilled, (state, action) => {
                state.notifications = action.payload;
                state.unreadCount = action.payload.filter((n) => !n.is_read).length;
                state.loading = false;
            })
            .addCase(fetchNotifications.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            // Mark as read cases
            .addCase(markAsRead.pending, (state) => {
                state.error = null;
            })
            .addCase(markAsRead.fulfilled, (state, action) => {
                const { notificationId } = action.payload;
                const notification = state.notifications.find((n) => n.id === notificationId);
                if (notification && !notification.is_read) {
                    notification.is_read = true;
                    state.unreadCount = Math.max(0, state.unreadCount - 1);
                }
            })
            .addCase(markAsRead.rejected, (state, action) => {
                state.error = action.error.message;
            })
            // Mark all as read cases
            .addCase(markAllAsRead.pending, (state) => {
                state.error = null;
            })
            .addCase(markAllAsRead.fulfilled, (state) => {
                state.notifications.forEach((notification) => {
                    notification.is_read = true;
                });
                state.unreadCount = 0;
            })
            .addCase(markAllAsRead.rejected, (state, action) => {
                state.error = action.error.message;
            });
    },
});

export const { clearNotifications, addNewNotification, updateUnreadCount, setNotifications } =
    notificationSlice.actions;
export default notificationSlice.reducer;
