import { useState, useEffect } from 'react';
import { Box, List, ListItem, ListItemAvatar, ListItemText, Avatar, Typography, Button } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import CheckIcon from '@mui/icons-material/Check';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

function NotificationList() {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    // Fetch notifications
    useEffect(() => {
        // TODO: Implement fetch notifications from API
        const mockNotifications = [
            {
                id: 1,
                type: 'request_approved',
                message: 'Đề nghị của bạn đã được phê duyệt',
                requestId: 123,
                createdAt: new Date(),
                read: false,
                actor: {
                    name: 'Nguyễn Văn A',
                    avatar: null,
                },
            },
            {
                id: 2,
                type: 'comment',
                message: 'đã bình luận về đề nghị của bạn',
                requestId: 124,
                createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
                read: true,
                actor: {
                    name: 'Trần Thị B',
                    avatar: 'https://example.com/avatar.jpg',
                },
            },
        ];
        setNotifications(mockNotifications);
        setUnreadCount(mockNotifications.filter((n) => !n.read).length);
    }, []);

    const formatNotificationTime = (date) => {
        return format(new Date(date), 'HH:mm - dd/MM/yyyy', { locale: vi });
    };

    const getNotificationIcon = (type) => {
        // TODO: Implement different icons for different notification types
        return <NotificationsIcon />;
    };

    const handleNotificationClick = (notification) => {
        // TODO: Implement navigation and mark as read
        console.log('Clicked notification:', notification);
    };

    const handleMarkAllAsRead = () => {
        // TODO: Implement mark all as read functionality
        console.log('Mark all notifications as read');
    };

    return (
        <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
            {/* Header */}
            <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                <Typography
                    variant="h6"
                    sx={{
                        fontSize: '1.6rem',
                        fontWeight: 600,
                        color: 'primary.main',
                    }}
                >
                    Thông báo
                </Typography>
            </Box>

            {/* Notifications List */}
            <List sx={{ maxHeight: 400, overflow: 'auto', p: 0 }}>
                {notifications.map((notification) => (
                    <ListItem
                        key={notification.id}
                        alignItems="flex-start"
                        sx={{
                            bgcolor: notification.read ? 'inherit' : 'action.hover',
                            '&:hover': { bgcolor: 'action.hover' },
                            cursor: 'pointer',
                            flexDirection: 'column', // Thêm dòng này để xếp dọc các phần tử con
                            alignItems: 'flex-start', // Căn trái các phần tử con
                            gap: 0.5,
                        }}
                        onClick={() => handleNotificationClick(notification)}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                            <ListItemAvatar>
                                <Avatar src={notification.actor.avatar}>{notification.actor.name.charAt(0)}</Avatar>
                            </ListItemAvatar>
                            <ListItemText
                                primary={
                                    <Typography
                                        component="span"
                                        sx={{
                                            fontSize: '1.4rem',
                                            fontWeight: notification.read ? 400 : 600,
                                        }}
                                    >
                                        {notification.actor.name} {notification.message}
                                    </Typography>
                                }
                            />
                        </Box>
                        <Typography
                            component="span"
                            sx={{
                                fontSize: '1.2rem',
                                color: 'text.secondary',
                                pl: 7, // căn lề cho khớp với nội dung bên trên
                            }}
                        >
                            {formatNotificationTime(notification.createdAt)}
                        </Typography>
                    </ListItem>
                ))}
            </List>

            {/* Mark All as Read Button */}
            <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
                <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<CheckIcon />}
                    onClick={handleMarkAllAsRead}
                    sx={{
                        fontSize: '1.4rem',
                        textTransform: 'none',
                        borderRadius: 2,
                    }}
                >
                    Đánh dấu tất cả đã đọc
                </Button>
            </Box>
        </Box>
    );
}

export default NotificationList;
