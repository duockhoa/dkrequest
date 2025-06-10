import { Box, Typography, Stack, Divider, Avatar } from '@mui/material';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { fetchRequestDetail } from '../../../redux/slice/requestDetailSlice';
import { format } from 'date-fns';
import LoadingPage from '../LoadingPage';
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

const ApproverItem = ({ approver }) => (
    <Stack direction="row" spacing={2} alignItems="center" sx={{ py: 1 }}>
        <Avatar src={approver.approver.avatar} alt={approver.approver.name} sx={{ width: 40, height: 40 }} />
        <Box>
            <Typography sx={{ fontSize: '1.4rem' }}>{approver.approver.name}</Typography>
            <Typography sx={{ fontSize: '1.2rem', color: 'text.secondary' }}>
                Bước {approver.step} - {approver.status === 'pending' ? 'Đang chờ' : 'Đã duyệt'}
            </Typography>
        </Box>
    </Stack>
);

function RequestDetailsd() {
    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();
    const requestDetail = useSelector((state) => state.requestDetail.requestDetail);
    const loading = useSelector((state) => state.requestDetail.loading);
    const error = useSelector((state) => state.requestDetail.error);
    const requestId = searchParams.get('requestid');

    useEffect(() => {
        if (requestId) {
            dispatch(fetchRequestDetail(requestId));
        }
    }, [dispatch, requestId]);

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
    const leaveStart = requestDetail?.leaveRegistration?.start_time;
    const leaveEnd = requestDetail?.leaveRegistration?.end_time;
    const leaveHours = requestDetail?.leaveRegistration?.hours || 0;
    const leaveReason = requestDetail?.leaveRegistration?.reason || '-';
    const leaveDesc = requestDetail?.leaveRegistration?.description || '-';

    return (
        <Box sx={{ bgcolor: 'background.paper', p: 3, borderRadius: 1 }}>
            <Typography variant="h6" sx={{ mb: 2, fontSize: '1.6rem', fontWeight: 'bold' }}>
                THÔNG TIN CHI TIẾT
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Stack divider={<Divider />}>
                <DetailItem label="Tên đề nghị" value={requestDetail?.requestName || '-'} />
                <DetailItem label="Ngày đề nghị" value={formatDate(requestDetail?.createAt)} />
                <DetailItem label="Người đề nghị" value={`${requestorName} - ${requestorDept}`} />
                <DetailItem label="Từ" value={formatDate(leaveStart)} />
                <DetailItem label="Đến" value={formatDate(leaveEnd)} />
                <DetailItem label="Số giờ nghỉ" value={`${leaveHours} giờ`} />
                <DetailItem label="Lý do" value={leaveReason} />
                <DetailItem label="Mô tả" value={leaveDesc} />
            </Stack>
        </Box>
    );
}

export default RequestDetailsd;
