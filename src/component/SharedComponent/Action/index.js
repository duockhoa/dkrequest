import { useState } from 'react';
import { Box, Button, Stack, Dialog, DialogContent } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ForwardIcon from '@mui/icons-material/Forward';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import ConfirmForm from '../../Form/ConfirmForm';
import RejectForm from '../../Form/RejectForm';
import ForwardForm from '../../Form/ForwardForm';
import { approverUpdateStatus, approverForward } from '../../../services/approverService';
import { useSelector, useDispatch } from 'react-redux';
import { fetchRequestDetail } from '../../../redux/slice/requestDetailSlice';
import { fetchRequests } from '../../../redux/slice/requestSlice';

function Action() {
    const dispatch = useDispatch();
    const [open, setOpen] = useState(false);
    const [actionType, setActionType] = useState('approved'); // 'approved' | 'rejected' | 'forwarded'
    const userId = useSelector((state) => state.user.userInfo.id); // Assuming user ID is stored in Redux state
    const requestId = useSelector((state) => state.requestId.requestId); // Assuming current request ID is stored in Redux state
    const requestDetail = useSelector((state) => state.requestDetail.requestDetailvalue);
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

    const handleSubmitConfirm = async () => {
        try {
            const payload = {
                request_id: requestId,
                user_id: userId,
                status: actionType === 'approved' ? 'approved' : 'rejected',
            };
            const response = await approverUpdateStatus(payload);
            dispatch(fetchRequestDetail(requestId)); // Refresh request detail after update
            dispatch(fetchRequests(requestDetail.requestType_id)); // Refresh requests list
            handleClose();
        } catch (error) {
            console.error('Error updating status:', error);
            // Handle error (e.g., show notification)
        }
    };

    const handleSubmitForward = async (new_user_id) => {
        console.log('Forward to:', new_user_id);
        const payload = {
            request_id: requestId,
            user_id: userId, // Current user ID
            new_user_id: new_user_id, // Assuming new user ID is passed from ForwardForm
        };
        console.log('Forward payload:', payload);
        try {
            const response = await approverForward(payload);
            console.log('Forward response:', response);
            dispatch(fetchRequestDetail(requestId)); // Refresh request detail after forwarding
        } catch (error) {
            console.error('Error in handleSubmitForward:', error);
        }

        handleClose();
    };

    const question =
        actionType === 'approved'
            ? 'Bạn có chắc chắn muốn xác nhận yêu cầu này?'
            : 'Bạn có chắc chắn muốn từ chối yêu cầu này?';

    return (
        <Box sx={{ bgcolor: 'background.paper', p: 3, borderRadius: 1 }}>
            <Stack direction="row" spacing={2} justifyContent="center">
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

            <Dialog open={open} onClose={handleClose} maxWidth={actionType === 'forward' ? 'sm' : 'xs'} fullWidth>
                <DialogContent>
                    {actionType === 'forward' ? (
                        <ForwardForm onCancel={handleClose} onSubmit={handleSubmitForward} />
                    ) : (
                        <ConfirmForm question={question} onCancel={handleClose} onSubmit={handleSubmitConfirm} />
                    )}
                </DialogContent>
            </Dialog>
        </Box>
    );
}

export default Action;
