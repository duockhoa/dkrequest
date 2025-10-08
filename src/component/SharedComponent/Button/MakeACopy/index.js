import { useState } from 'react';
import { MenuItem, ListItemIcon, ListItemText, Dialog} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { fetchRequestDetail } from '../../../../redux/slice/requestDetailSlice';
import { fetchRequests } from '../../../../redux/slice/requestSlice';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import AddRequestFrom from '../../../Form/AddRequestForm';

function MakeACopy({ onClose }) {
    const [open, setOpen] = useState(false);
    const user = useSelector((state) => state.user.userInfo);
    const requestId = useSelector((state) => state.requestId.requestId);
    const requestDetail = useSelector((state) => state.requestDetail.requestDetailvalue);

    // Check if request is completed
    const isCompleted = requestDetail?.isCompleted;


    const handleComplete = () => {
        setOpen(true);
    };

    const handleClose = () => setOpen(false);

    

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
                    <ContentCopyIcon />
                </ListItemIcon>
                <ListItemText
                    primary="Tạo bản sao"
                    primaryTypographyProps={{
                        fontSize: '14px',
                        fontWeight: 500,
                    }}
                />
            </MenuItem>

            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                    <AddRequestFrom onClose={handleClose} isCopy={true} />
            </Dialog>
        </>
    );
}

export default MakeACopy;
