import React from 'react';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';

const LoadingPage = () => {
    return (
        <Stack
            sx={{
                width: '100%',
                height: '100vh', // Đảm bảo chiều cao toàn màn hình
                display: 'flex',
                justifyContent: 'center', // Căn giữa theo chiều ngang
                alignItems: 'center', // Căn giữa theo chiều dọc
                backgroundColor: 'rgba(0, 0, 0, 0.05)', // Màu nền nhẹ để tạo cảm giác loading
            }}
        >
            <CircularProgress size={60} thickness={4} />
        </Stack>
    );
};

export default LoadingPage;
