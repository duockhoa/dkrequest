import { Box, Typography } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

function ErrorMessage({ message = 'Đã xảy ra lỗi. Vui lòng thử lại!' }) {
    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                bgcolor: 'error.lighter',
                color: 'error.main',
                p: 2,
                borderRadius: 2,
                gap: 1.5,
            }}
        >
            <ErrorOutlineIcon sx={{ fontSize: 28 }} />
            <Typography sx={{ fontWeight: 500, fontSize: '1.1rem' }}>{message}</Typography>
        </Box>
    );
}

export default ErrorMessage;
