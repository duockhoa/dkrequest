import { useState } from 'react';
import { Box, Button, Stack, Dialog, DialogContent } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ForwardIcon from '@mui/icons-material/Forward';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import ConfirmForm from '../../../Form/ConfirmForm';
import RejectForm from '../../../Form/RejectForm';
import ForwardForm from '../../../Form/ForwardForm';
import { approverUpdateStatus, approverForward } from '../../../../services/approverService';
import { useSelector, useDispatch } from 'react-redux';
import { fetchRequestDetail } from '../../../../redux/slice/requestDetailSlice';
import { fetchRequests } from '../../../../redux/slice/requestSlice';

function Action() {
    const dispatch = useDispatch();
    const [open, setOpen] = useState(false);
    const [actionType, setActionType] = useState('approved');
    const userId = useSelector((state) => state.user.userInfo.id);
    const requestId = useSelector((state) => state.requestId.requestId);
    const requestDetail = useSelector((state) => state.requestDetail.requestDetailvalue);
    const requestTypeId = useSelector((state) => state.requestId.requestTypeId);
    const page = useSelector((state) => state.request.page);
    const pageSize = useSelector((state) => state.request.pageSize);

    // Logic kiểm tra quyền hiển thị Action
    const canShowAction = (() => {
        if (!requestDetail || !userId) return false;
        if (requestDetail.status !== 'pending') return false;
        if (!Array.isArray(requestDetail.approvers)) return false;
        // Tìm các approver đang pending
        const pendingApprovers = requestDetail.approvers.filter((a) => a.status === 'pending');
        if (pendingApprovers.length === 0) return false;
        // Tìm step nhỏ nhất
        const nextStep = Math.min(...pendingApprovers.map((a) => a.step));
        // Kiểm tra user hiện tại có phải là người duyệt ở step tiếp theo không
        return pendingApprovers.some((a) => a.step === nextStep && a.user_id === userId);
    })();

    if (!canShowAction) return null;

    const handleApprove = () => {
        setActionType('approved');
        setOpen(true);
    };

    const handleForward = () => {
        setActionType('forward');
        setOpen(true);
    };

    const handleReject = () => {
        setActionType('rejected');
        setOpen(true);
    };

    const handleClose = () => setOpen(false);

    const handleSubmitConfirm = async (formData) => {
        try {
            const payload = {
                request_id: requestId,
                user_id: userId,
                status: 'approved',
                note: formData.note || null,
            };
            const response = await approverUpdateStatus(payload);
            dispatch(fetchRequestDetail(requestId));
            dispatch(
                fetchRequests({
                    requestTypeId: requestTypeId,
                    user_id: userId,
                    page,
                    pageSize,
                    
                }),
            );
            handleClose();
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const handleSubmitReject = async (formData) => {
        try {
            const payload = {
                request_id: requestId,
                user_id: userId,
                status: 'rejected',
                note: formData.note || null,
            };
            const response = await approverUpdateStatus(payload);
            dispatch(fetchRequestDetail(requestId));
            dispatch(
                fetchRequests({
                    requestTypeId: requestTypeId,
                    user_id: userId,
                    page,
                    pageSize,
                }),
            );

            handleClose();
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const handleSubmitForward = async (formData) => {
        const payload = {
            request_id: requestId,
            user_id: userId,
            new_user_id: formData.new_user_id,
            note: formData.note || null,
        };
        console.log('Forward payload:', payload);
        try {
            const response = await approverForward(payload);
            console.log('Forward response:', response);
            dispatch(fetchRequestDetail(requestId));
            handleClose();
        } catch (error) {
            console.error('Error in handleSubmitForward:', error);
        }
    };

    const renderForm = () => {
        switch (actionType) {
            case 'approved':
                return (
                    <ConfirmForm
                        question="Bạn có chắc chắn muốn xác nhận yêu cầu này?"
                        onCancel={handleClose}
                        onSubmit={handleSubmitConfirm}
                    />
                );
            case 'rejected':
                return (
                    <RejectForm
                        question="Bạn có chắc chắn muốn từ chối yêu cầu này?"
                        onCancel={handleClose}
                        onSubmit={handleSubmitReject}
                    />
                );
            case 'forward':
                return <ForwardForm onCancel={handleClose} onSubmit={handleSubmitForward} />;
            default:
                return null;
        }
    };

    return (
        <Box sx={{ bgcolor: 'background.paper', p: 2, borderRadius: 1 }}>
            <Stack direction="row" spacing={2} justifyContent="center" flexWrap="wrap" rowGap={2}>
                <Button
                    variant="contained"
                    color="success"
                    startIcon={<CheckCircleOutlineIcon />}
                    onClick={handleApprove}
                    sx={{
                        fontSize: '1.4rem',
                        textTransform: 'none',
                        minWidth: 120,
                    }}
                >
                    Chấp thuận
                </Button>

                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<ForwardIcon />}
                    onClick={handleForward}
                    sx={{
                        fontSize: '1.4rem',
                        textTransform: 'none',
                        minWidth: 120,
                    }}
                >
                    Chuyển tiếp
                </Button>

                <Button
                    variant="contained"
                    color="error"
                    startIcon={<CancelOutlinedIcon />}
                    onClick={handleReject}
                    sx={{
                        fontSize: '1.4rem',
                        textTransform: 'none',
                        minWidth: 120,
                    }}
                >
                    Từ chối
                </Button>
            </Stack>

            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogContent>{renderForm()}</DialogContent>
            </Dialog>
        </Box>
    );
}

export default Action;
