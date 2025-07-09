import { useState } from 'react';
import { MenuItem, ListItemIcon, ListItemText, Dialog, DialogContent } from '@mui/material';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import ConfirmForm from '../../../Form/ConfirmForm';
import { useSelector, useDispatch } from 'react-redux';
import { fetchRequestDetail } from '../../../../redux/slice/requestDetailSlice';
import { fetchRequests } from '../../../../redux/slice/requestSlice';
import { markCompleted } from '../../../../services/requestService';

function MarkCompleted({ onClose }) {
    const dispatch = useDispatch();
    const [open, setOpen] = useState(false);
    const user = useSelector((state) => state.user.userInfo);
    const requestId = useSelector((state) => state.requestId.requestId);
    const requestDetail = useSelector((state) => state.requestDetail.requestDetailvalue);

    // Check if request is completed
    const isCompleted = requestDetail?.isCompleted;

    // Check if user has permission to mark as completed
    const hasPermission = !isCompleted && user.department === requestDetail?.requestType?.department.name;

    const handleComplete = () => {
        setOpen(true);
    };

    const handleClose = () => setOpen(false);

    const handleSubmitConfirm = async () => {
        try {
            const payload = {
                requestId: requestId,
                completedBy: user.id,
            };
            await markCompleted(payload);
            dispatch(fetchRequestDetail(requestId));
            dispatch(fetchRequests(requestDetail.requestType_id));
            handleClose();
            if (onClose) onClose(); // Close popover after action
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const question = 'Bạn có chắc chắn muốn xác nhận hoàn thành yêu cầu này?';

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
                        backgroundColor: 'success.light',
                        color: 'success.contrastText',
                    },
                }}
            >
                <ListItemIcon sx={{ color: 'inherit' }}>
                    <DoneAllIcon />
                </ListItemIcon>
                <ListItemText 
                    primary="Đánh dấu hoàn thành"
                    primaryTypographyProps={{
                        fontSize: '14px',
                        fontWeight: 500,
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

export default MarkCompleted;