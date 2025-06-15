import { Box, Typography, Stack, Divider, Chip } from '@mui/material';
import { useSelector } from 'react-redux';
import { format } from 'date-fns';
import Action from '../Action';
import LoadingPage from '../LoadingPage';
import LeaveDetail from '../DetailComponents/LeaveDetail';
import OverTimeRequestDetail from '../DetailComponents/OverTimeDetail';
import TaskConfirmDetail from '../DetailComponents/TaskConfirmDetail';

const DetailItem = ({ label, value }) => (
    <Stack direction="row" spacing={2} sx={{ py: 1 }}>
        <Typography
            sx={{
                minWidth: 120,
                color: 'text.secondary',
                fontSize: '1.4rem',
            }}
        >
            {label}
        </Typography>
        <Typography sx={{ fontSize: '1.4rem' }}>{value}</Typography>
    </Stack>
);

function RequestDetail() {
    const requestDetail = useSelector((state) => state.requestDetail.requestDetailvalue);
    const loading = useSelector((state) => state.requestDetail.loading);
    const error = useSelector((state) => state.requestDetail.error);

    // Loading state
    if (loading) {
        return <LoadingPage />;
    }

    // Error state
    if (error) {
        return (
            <Box sx={{ p: 3 }}>
                <Typography color="error">Error: {error}</Typography>
            </Box>
        );
    }

    // No data state
    if (!requestDetail) {
        return (
            <Box sx={{ p: 3 }}>
                <Typography>No data available</Typography>
            </Box>
        );
    }

    const formatDate = (dateString) => {
        return dateString ? format(new Date(dateString), 'dd/MM/yyyy HH:mm') : '-';
    };

    // Safe access to nested properties
    const requestorName = requestDetail?.requestor?.name || '-';
    const requestorDept = requestDetail?.requestor?.department || '-';
    const description = requestDetail?.description || '-';
    const requestTypeId = requestDetail?.requestType_id || 0;

    return (
        <Box sx={{ bgcolor: 'background.paper', p: 3, borderRadius: 1 }}>
            {/* Title Section */}
            <Box sx={{ mb: 3 }}>
                <Typography
                    sx={{
                        fontSize: '1.8rem',
                        fontWeight: 'bold',
                        color: 'primary.main',
                        mb: 1,
                    }}
                >
                    {requestDetail?.requestName || '-'}
                </Typography>

                <Stack direction="row" spacing={3} alignItems="center" sx={{ mb: 1 }}>
                    <Typography
                        sx={{
                            fontSize: '1.4rem',
                            color: 'text.secondary',
                        }}
                    >
                        {`Người đề nghị: ${requestorName} (${requestorDept})`}
                    </Typography>

                    <Stack direction="row" spacing={1} alignItems="center">
                        <Typography
                            sx={{
                                fontSize: '1.4rem',
                                color: 'text.secondary',
                            }}
                        >
                            Trạng thái:
                        </Typography>
                        <Chip
                            label={
                                requestDetail.status === 'approved'
                                    ? 'Đã duyệt'
                                    : requestDetail.status === 'rejected'
                                    ? 'Từ chối'
                                    : 'Đang chờ duyệt'
                            }
                            color={
                                requestDetail.status === 'approved'
                                    ? 'success'
                                    : requestDetail.status === 'rejected'
                                    ? 'error'
                                    : 'warning'
                            }
                            size="small"
                            sx={{
                                fontSize: '1.2rem',
                                '& .MuiChip-icon': { fontSize: '1.6rem' },
                            }}
                        />
                    </Stack>
                </Stack>
            </Box>

            {/* Divider */}
            <Divider sx={{ my: 2 }} />

            {/* Action Buttons */}
            <Box sx={{ mb: 3 }}>
                <Action />
            </Box>

            {/* Details Section */}
            <Typography variant="h6" sx={{ mb: 2, fontSize: '1.6rem', fontWeight: 'bold' }}>
                THÔNG TIN CHI TIẾT
            </Typography>
            <Stack divider={<Divider />}>
                <DetailItem label="Tên đề nghị" value={requestDetail?.requestName || '-'} />
                <DetailItem label="Ngày đề nghị" value={formatDate(requestDetail?.createAt)} />
                <DetailItem label="Người đề nghị" value={`${requestorName} - ${requestorDept}`} />
                {requestTypeId == 3 ? <LeaveDetail /> : ''}
                {requestTypeId == 7 ? <OverTimeRequestDetail /> : ''}
                {requestTypeId == 8 ? <TaskConfirmDetail /> : ''}

                <DetailItem label="Mô tả" value={description} />
            </Stack>
        </Box>
    );
}

export default RequestDetail;
