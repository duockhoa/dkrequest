import { Box, Typography, Stack, CircularProgress } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/PendingOutlined';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import CancelIcon from '@mui/icons-material/Cancel';
import { useSelector } from 'react-redux';
import { format, parseISO } from 'date-fns';

function Progress() {
    const requestDetail = useSelector((state) => state.requestDetail.requestDetailvalue);
    const loading = useSelector((state) => state.requestDetail.loading);
    const error = useSelector((state) => state.requestDetail.error);

    const formatDateTime = (dateString) => {
        if (!dateString) return '';
        try {
            return format(new Date(dateString), 'HH:mm:ss dd-MM-yyyy');
        } catch (error) {
            console.error('Invalid date format:', error);
            return '';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'created':
                return <AddCircleOutlineIcon sx={{ color: 'primary.main', fontSize: '2rem' }} />;
            case 'approved':
                return <CheckCircleIcon sx={{ color: 'success.main', fontSize: '2rem' }} />;
            case 'rejected':
                return <CancelIcon sx={{ color: 'error.main', fontSize: '2rem' }} />;
            case 'completed':
                return <TaskAltIcon sx={{ color: 'info.main', fontSize: '2rem' }} />;
            case 'pending':
                return <PendingIcon sx={{ color: 'warning.main', fontSize: '2rem' }} />;
            default:
                return <PendingIcon sx={{ color: 'grey.400', fontSize: '2rem' }} />;
        }
    };

    const buildActivities = () => {
        const activities = [];

        if (!requestDetail?.requestor) return activities;

        try {
            // Add creation activity
            activities.push({
                id: 'creation',
                status: 'created',
                title: `${requestDetail.requestor.name || 'Unknown'} (${
                    requestDetail.requestor.department || 'Unknown'
                })`,
                action: 'đã tạo yêu cầu vào lúc',
                timestamp: formatDateTime(requestDetail.createAt),
                sortDate: new Date(requestDetail.createAt),
            });

            // Add approver activities - chỉ hiển thị khi có trạng thái approved/rejected
            requestDetail.approvers?.forEach((approver) => {
                if (!approver) return;

                // Chỉ thêm activity nếu approver đã có action (approved hoặc rejected)
                if (approver.status === 'approved' || approver.status === 'rejected') {
                    activities.push({
                        id: approver.id || `approver-${activities.length + 1}`,
                        status: approver.status,
                        title: `${approver.approver?.name || 'Unknown'} (Bước ${approver.step || '?'})`,
                        action: `${approver.status === 'approved' ? 'đã chấp nhận' : 'đã từ chối'} yêu cầu vào lúc`,
                        timestamp: formatDateTime(approver.approved_at),
                        sortDate: new Date(approver.approved_at),
                        note: approver.note || '',
                    });
                }
            });

            // Add completer activity if request is completed
            if (requestDetail.isCompleted) {
                const completionDate = requestDetail.completed_at || requestDetail.updateAt;

                if (requestDetail.completer) {
                    // Case 1: Completer exists
                    activities.push({
                        id: 'completion',
                        status: 'completed',
                        title: `${requestDetail.completer.name || 'Unknown'} (${
                            requestDetail.completer.department || 'Unknown'
                        })`,
                        action: 'đã đánh dấu hoàn thành yêu cầu vào lúc',
                        timestamp: formatDateTime(completionDate),
                        sortDate: new Date(completionDate),
                    });
                } else {
                    // Case 2: Completer is null but request is completed
                    activities.push({
                        id: 'completion',
                        status: 'completed',
                        title: 'Hệ thống',
                        action: 'đã tự động đánh dấu hoàn thành yêu cầu vào lúc',
                        timestamp: formatDateTime(completionDate),
                        sortDate: new Date(completionDate),
                    });
                }
            }

            // Sắp xếp activities theo thời gian (từ cũ đến mới)
            activities.sort((a, b) => a.sortDate - b.sortDate);
        } catch (error) {
            console.error('Error building activities:', error);
        }

        return activities;
    };

    if (loading) {
        return (
            <Box sx={{ p: 3, bgcolor: 'background.paper', borderRadius: 1 }}>
                <Stack alignItems="center" spacing={2}>
                    <CircularProgress />
                    <Typography>Đang tải thông tin...</Typography>
                </Stack>
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ p: 3, bgcolor: 'background.paper', borderRadius: 1 }}>
                <Typography color="error" sx={{ fontSize: '1.4rem' }}>
                    Có lỗi xảy ra: {error}
                </Typography>
            </Box>
        );
    }

    if (!requestDetail) {
        return (
            <Box sx={{ p: 3, bgcolor: 'background.paper', borderRadius: 1 }}>
                <Typography sx={{ fontSize: '1.4rem' }}>Không có thông tin hoạt động</Typography>
            </Box>
        );
    }

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
                {buildActivities().map((activity) => (
                    <Stack key={activity.id} direction="row" spacing={2} alignItems="flex-start">
                        {getStatusIcon(activity.status)}
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
                            <Stack direction="row" spacing={1} flexWrap="wrap" alignItems="center">
                                <Typography sx={{ fontSize: '1.3rem' }}>{activity.action}</Typography>
                                {activity.timestamp && (
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
                                )}
                            </Stack>
                            {activity.note && (
                                <Typography
                                    sx={{
                                        fontSize: '1.3rem',
                                        color: 'text.secondary',
                                        mt: 1,
                                    }}
                                >
                                    Ghi chú: {activity.note}
                                </Typography>
                            )}
                        </Box>
                    </Stack>
                ))}
            </Stack>
        </Box>
    );
}

export default Progress;
