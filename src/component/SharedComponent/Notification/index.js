import React from 'react';
import { IconButton, Badge } from '@mui/material'; // Import Badge và IconButton từ Material-UI
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined'; // Import biểu tượng chuông dạng outline

function Notification({ notifications }) {
    return (
        <IconButton
            sx={{
                paddingLeft: 1,
                color: 'text.primary',
            }}
        >
            <Badge badgeContent={notifications?.length || 0} color="error">
                <NotificationsOutlinedIcon sx={{ fontSize: '2.5rem' }} /> {/* Chuông dạng outline */}
            </Badge>
        </IconButton>
    );
}

export default Notification;
