import { useState } from 'react';
import { MenuItem, ListItemIcon, ListItemText, Dialog, DialogContent } from '@mui/material';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead'; // Icon mới cho tiếp nhận
import ConfirmForm from '../../../Form/ConfirmForm';
import { useSelector, useDispatch } from 'react-redux';
import { fetchRequestDetail } from '../../../../redux/slice/requestDetailSlice';
import { fetchRequests } from '../../../../redux/slice/requestSlice';
import { markReceived } from '../../../../services/requestService';

function MarkReceived({ onClose }) {
    const dispatch = useDispatch();
    const [open, setOpen] = useState(false);
    const user = useSelector((state) => state.user.userInfo);
    const requestId = useSelector((state) => state.requestId.requestId);
    const requestDetail = useSelector((state) => state.requestDetail.requestDetailvalue);

    // Check if request is received
    const isReceived = requestDetail?.isReceived;

    // Check if user has permission to mark as received
    const hasPermission =
        !isReceived &&
        requestDetail?.status === 'approved' &&
        user?.department === requestDetail?.requestType?.department?.name;

    const handleComplete = () => {
        setOpen(true);
    };

    const handleClose = () => setOpen(false);

    const handleSubmitConfirm = async () => {
        try {
            const payload = {
                requestId: requestId,
                receivedBy: user.id,
            };
            await markReceived(payload);
            dispatch(fetchRequestDetail(requestId));
            dispatch(
                fetchRequests({
                    requestTypeId: requestDetail.requestType_id,
                    user_id: user.id,
                }),
            );
            handleClose();
            if (onClose) onClose(); // Close popover after action
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const question = 'Bạn có chắc chắn muốn xác nhận tiếp nhận yêu cầu này?';

    // Don't render if user doesn't have permission
    if (!hasPermission) {
        return null;
    }

    return (
        <>
            <MenuItem
                onClick={handleComplete}
                sx={{
                    py: 1.5,
                    px: 2,
                    '&:hover': {
                        backgroundColor: 'info.light', // Đổi sang màu xanh dương
                        color: 'info.contrastText',
                    },
                }}
            >
                <ListItemIcon sx={{ color: 'info.main' }}>
                    {/* Màu icon xanh dương */}
                    <MarkEmailReadIcon />
                </ListItemIcon>
                <ListItemText
                    primary="Đánh dấu tiếp nhận"
                    primaryTypographyProps={{
                        fontSize: '14px',
                        fontWeight: 500,
                        color: 'info.main', // Màu text xanh dương
                    }}
                />
            </MenuItem>

            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogContent>
                    <ConfirmForm question={question} onCancel={handleClose} onSubmit={handleSubmitConfirm} />
                </DialogContent>
            </Dialog>
        </>
    );
}

export default MarkReceived;
