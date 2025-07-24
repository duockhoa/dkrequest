import { Box, Typography, Stack, Divider, Chip, IconButton, Popover } from '@mui/material';
import { useSelector } from 'react-redux';
import { format } from 'date-fns';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useState } from 'react';
import Action from '../Action/MainAction';
import LoadingPage from '../LoadingPage';
import LeaveDetail from '../DetailComponents/LeaveDetail';
import OverTimeRequestDetail from '../DetailComponents/OverTimeDetail';
import TaskConfirmDetail from '../DetailComponents/TaskConfirmDetail';
import PaymentDetail from '../DetailComponents/PaymentDetail';
import AdvanceMoneyDetail from '../DetailComponents/AdvanceMoneyDetail';
import AttachmentsDetail from '../DetailComponents/AttachmentsDetail';
import SupplyStationeryDetail from '../DetailComponents/SupplyStationeryDetail';
import MeetingRoomRequestDetail from '../DetailComponents/MeetingRoomRequestDetail';
import OtherAction from '../Action/OtherAction';
import RecruitmentDetail from '../DetailComponents/RecuitmentDetail';
import ExpressDeliveryDetail from '../DetailComponents/ExpressDeliveryDetail';
import OfficeEquipmentRepairDetail from '../DetailComponents/OfficeEquipmentRepairDetail';
import OfficeDocumentDetail from '../DetailComponents/OfficeDocumentDetail';
import OfficeEquipmentRequestDetail from '../DetailComponents/SupplyOfficeEquipmentDetail';
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
    const user = useSelector((state) => state.user.userInfo);

    // State for popover
    const [anchorEl, setAnchorEl] = useState(null);

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

    // Handler cho popover
    const handleMoreClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClosePopover = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'other-action-popover' : undefined;

    return (
        <Box sx={{ bgcolor: 'background.paper', p: 3, borderRadius: 1 }}>
            {/* Title Section with ExpandMore Button */}
            <Box sx={{ mb: 3 }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Typography
                        sx={{
                            fontSize: '1.8rem',
                            fontWeight: 'bold',
                            color: 'primary.main',
                            mb: 1,
                            flex: 1,
                        }}
                    >
                        {requestDetail?.requestName || '-'}
                    </Typography>

                    <IconButton
                        onClick={handleMoreClick}
                        sx={{
                            color: 'primary.main',
                            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
                            transition: 'transform 0.3s ease-in-out',
                        }}
                        size="large"
                        aria-describedby={id}
                    >
                        <ExpandMoreIcon sx={{ fontSize: '2rem' }} />
                    </IconButton>
                </Stack>

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

            {/* Popover for OtherAction */}
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClosePopover}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                sx={{
                    '& .MuiPopover-paper': {
                        p: 1,
                        boxShadow: 3,
                        borderRadius: 2,
                        minWidth: 200,
                    },
                }}
            >
                <OtherAction onClose={handleClosePopover} />
            </Popover>

            {/* Content - Always visible */}
            <Divider sx={{ my: 2 }} />

            {/* Action Buttons - LUÔN HIỆN Action, logic ẩn/hiện chuyển sang Action/MainAction */}
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
                {requestTypeId === 1 ? <PaymentDetail /> : ''}
                {requestTypeId === 2 ? <AdvanceMoneyDetail /> : ''}
                {requestTypeId === 3 ? <LeaveDetail /> : ''}
                {requestTypeId === 4 ? <SupplyStationeryDetail /> : ''}
                {requestTypeId === 7 ? <OverTimeRequestDetail /> : ''}
                {requestTypeId === 8 ? <TaskConfirmDetail /> : ''}
                {requestTypeId === 9 ? <RecruitmentDetail /> : ''}
                {requestTypeId === 14 ? <MeetingRoomRequestDetail /> : ''}
                {requestTypeId === 15 ? <ExpressDeliveryDetail /> : ''}
                {requestTypeId === 16 ? <OfficeEquipmentRepairDetail /> : ''}
                {requestTypeId === 17 ? <OfficeDocumentDetail /> : ''}
                {requestTypeId === 18 ? <OfficeEquipmentRequestDetail /> : ''}

                <DetailItem label="Mô tả" value={description} />
                <AttachmentsDetail />
            </Stack>
        </Box>
    );
}

export default RequestDetail;
