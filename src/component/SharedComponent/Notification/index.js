import { useState, useEffect } from 'react';
import { IconButton, Badge, Popover } from '@mui/material';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import NotificationList from '../NotificationList';
import { useSelector, useDispatch } from 'react-redux';
import { fetchNotifications } from '../../../redux/slice/notificationSlice';

function Notification() {
    const [anchorEl, setAnchorEl] = useState(null);
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user.userInfo);
    const unreadCount = useSelector((state) => state.notification.unreadCount);

    useEffect(() => {
        if (user && user.id) {
            dispatch(fetchNotifications(user.id));
        }
    }, [user, dispatch]);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);

    return (
        <>
            <IconButton
                onClick={handleClick}
                sx={{
                    paddingLeft: 1,
                    color: 'text.primary',
                }}
            >
                <Badge badgeContent={unreadCount} color="error">
                    <NotificationsOutlinedIcon sx={{ fontSize: '2.5rem' }} />
                </Badge>
            </IconButton>

            <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
            >
                <NotificationList onClose={handleClose} />
            </Popover>
        </>
    );
}

export default Notification;
