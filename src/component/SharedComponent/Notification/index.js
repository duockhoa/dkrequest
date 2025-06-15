import React, { useState } from 'react';
import { IconButton, Badge, Popover } from '@mui/material'; // Import Badge và IconButton từ Material-UI
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined'; // Import biểu tượng chuông dạng outline
import NotificationList from '../NotificationList';

function Notification({ notifications }) {
    const [anchorEl, setAnchorEl] = useState(null);

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
                <Badge badgeContent={notifications?.length || 2} color="error">
                    <NotificationsOutlinedIcon sx={{ fontSize: '2.5rem' }} /> {/* Chuông dạng outline */}
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
                <NotificationList notifications={notifications} />
            </Popover>
        </>
    );
}

export default Notification;
