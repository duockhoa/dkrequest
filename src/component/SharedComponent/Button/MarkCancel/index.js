import { useState } from 'react';
import { MenuItem, ListItemIcon, ListItemText, Dialog, DialogContent } from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import ConfirmForm from '../../../Form/ConfirmForm';
import { useSelector, useDispatch } from 'react-redux';
import { fetchRequestDetail } from '../../../../redux/slice/requestDetailSlice';
import { fetchRequests } from '../../../../redux/slice/requestSlice';
import { markCanceled } from '../../../../services/requestService';

function MarkCancel({ onClose }) {
    const dispatch = useDispatch();
    const [open, setOpen] = useState(false);
    const user = useSelector((state) => state.user.userInfo);
    const requestId = useSelector((state) => state.requestId.requestId);
    const requestDetail = useSelector((state) => state.requestDetail.requestDetailvalue);

    // Kiểm tra đã bị huỷ chưa
    const isCanceled = requestDetail?.requestStatus?.isCanceled;

    // Kiểm tra đã có ai duyệt chưa (tức là có approver nào approved_at khác null)
    const isAnyApproved = Array.isArray(requestDetail?.approvers) && requestDetail.approvers.some((a) => a.approved_at);

    const isOwner = user?.id === requestDetail?.requestor?.id;
    // Phân quyền: chỉ được huỷ khi chưa ai duyệt và chưa huỷ
    const hasPermission = !isCanceled && !isAnyApproved && isOwner;

    const handleComplete = () => {
        setOpen(true);
    };

    const handleClose = () => setOpen(false);

    const handleSubmitConfirm = async () => {
        try {
            const payload = {
                request_id: requestId,
                user_id: user.id,
            };
            await markCanceled(payload);
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

    const question = 'Bạn có chắc chắn muốn xác nhận huỷ yêu cầu này?';

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
                        backgroundColor: 'error.light', // Đỏ nhạt khi hover
                        color: 'error.contrastText',
                    },
                }}
            >
                <ListItemIcon sx={{ color: 'error.main' }}>
                    {/* Icon màu đỏ */}
                    <CancelIcon />
                </ListItemIcon>
                <ListItemText
                    primary="Đánh dấu huỷ"
                    primaryTypographyProps={{
                        fontSize: '14px',
                        fontWeight: 500,
                        color: 'error.main', // Màu text đỏ
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

export default MarkCancel;
