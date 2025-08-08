import { Box, Typography, Avatar, Stack, IconButton, Chip } from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { useSelector } from 'react-redux';
import LoadingPage from '../LoadingPage';

function Approver() {
    const requestDetail = useSelector((state) => state.requestDetail.requestDetailvalue);
    const loading = useSelector((state) => state.requestDetail.loading);
    const error = useSelector((state) => state.requestDetail.error);

    if (loading) {
        return <LoadingPage />;
    }
    if (error) {
        return <Typography color="error">Error: {error}</Typography>;
    }

    return (
        <Box sx={{ bgcolor: 'background.paper', p: 2, borderRadius: 1 }}>
            {/* Header */}
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                <Typography sx={{ fontSize: '1.6rem', fontWeight: 600 }}>NGƯỜI XÉT DUYỆT</Typography>
                <IconButton size="small">
                    <KeyboardArrowUpIcon />
                </IconButton>
            </Stack>

            {/* Progress Banner */}
            <Box
                sx={{
                    bgcolor: 'primary.lighter',
                    p: 1.5,
                    borderRadius: 1,
                    mb: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}
            >
                <Stack direction="row" spacing={1} alignItems="center">
                    <AccessTimeIcon sx={{ color: 'primary.main' }} />
                    <Typography sx={{ fontSize: '1.4rem', color: 'primary.main' }}>
                        Tiến trình của người duyệt
                    </Typography>
                </Stack>
                <IconButton size="small">
                    <KeyboardArrowRightIcon sx={{ color: 'primary.main' }} />
                </IconButton>
            </Box>

            {/* Approvers List */}
            <Stack spacing={2}>
                {requestDetail?.approvers?.map((approver) => (
                    <Stack key={approver.id} direction="row" spacing={2} alignItems="center">
                        <Avatar src={approver.approver.avatar} sx={{ width: 40, height: 40 }}>
                            {approver.approver.name.charAt(0)}
                        </Avatar>
                        <Typography sx={{ fontSize: '1.4rem', flexGrow: 1 }}>
                            {approver.approver.name}
                            <Typography
                                component="span"
                                sx={{
                                    fontSize: '1.2rem',
                                    color: 'text.secondary',
                                    ml: 1,
                                }}
                            >
                                {approver.role}
                            </Typography>
                        </Typography>
                        {approver.status === 'approved' ? (
                            <CheckCircleIcon sx={{ color: 'success.main' }} />
                        ) : approver.status === 'rejected' ? (
                            <CancelIcon sx={{ color: 'error.main', fontSize: 24 }} />
                        ) : (
                            <FiberManualRecordIcon
                                sx={{
                                    color: 'grey.300',
                                    fontSize: '1.2rem',
                                }}
                            />
                        )}
                    </Stack>
                ))}
            </Stack>
        </Box>
    );
}

export default Approver;
