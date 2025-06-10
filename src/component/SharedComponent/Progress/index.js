import { Box, Typography, Stack } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

function Progress() {
    const activities = [
        {
            id: 1,
            status: 'created',
            title: 'Request created',
            user: 'Trần Thị Huyền',
            action: 'đã tạo yêu cầu vào lúc',
            timestamp: '14:16:12 09-06-2025',
        },
        {
            id: 2,
            status: 'approved',
            title: 'Bùi Việt Anh ( TPKDDN )',
            user: '',
            action: 'chấp nhận yêu cầu vào lúc',
            timestamp: '14:31:05 09-06-2025',
        },
        {
            id: 3,
            status: 'approved',
            title: 'Kế toán nội bộ',
            user: '',
            action: 'chấp nhận yêu cầu vào lúc',
            timestamp: '15:20:38 09-06-2025',
        },
    ];

    return (
        <Box sx={{ p: 3, bgcolor: 'background.paper', borderRadius: 1 }}>
            <Typography
                variant="h6"
                sx={{
                    fontSize: '1.6rem',
                    fontWeight: 600,
                    mb: 3,
                }}
            >
                LỊCH SỬ HOẠT ĐỘNG
            </Typography>

            <Stack spacing={3}>
                {activities.map((activity) => (
                    <Stack key={activity.id} direction="row" spacing={2} alignItems="flex-start">
                        {activity.status === 'created' ? (
                            <AddCircleOutlineIcon
                                sx={{
                                    color: 'primary.main',
                                    fontSize: '2rem',
                                }}
                            />
                        ) : (
                            <CheckCircleIcon
                                sx={{
                                    color: 'success.main',
                                    fontSize: '2rem',
                                }}
                            />
                        )}
                        <Box>
                            <Typography
                                sx={{
                                    fontSize: '1.4rem',
                                    fontWeight: 500,
                                    mb: 0.5,
                                }}
                            >
                                {activity.title}
                            </Typography>
                            <Stack direction="row" spacing={1}>
                                <Typography sx={{ fontSize: '1.3rem' }}>
                                    {activity.user} {activity.action}
                                </Typography>
                                <Typography
                                    sx={{
                                        fontSize: '1.3rem',
                                        bgcolor: 'grey.200',
                                        px: 1,
                                        py: 0.5,
                                        borderRadius: 1,
                                    }}
                                >
                                    {activity.timestamp}
                                </Typography>
                            </Stack>
                        </Box>
                    </Stack>
                ))}
            </Stack>
        </Box>
    );
}

export default Progress;
