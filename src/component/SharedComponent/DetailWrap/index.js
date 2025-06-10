import { Box, Paper, Stack } from '@mui/material';
import RequestDetail from '../RequestDetail';
import Comment from '../Comment';
import Approver from '../Approver';
import Follower from '../Follower';
import Progress from '../Progress';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRequestDetail } from '../../../redux/slice/requestDetailSlice';

export default function DetailWrap() {
    const dispatch = useDispatch();
    const requestId = useSelector((state) => state.requestId.requestId);

    useEffect(() => {
        if (requestId) {
            dispatch(fetchRequestDetail(requestId));
        }
        return () => {
            dispatch({ type: 'requestDetail/clearRequestDetail' });
        };
    }, [requestId, dispatch]);

    return (
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ flex: 1 }}>
            <Box
                sx={{
                    flex: 1,
                    minWidth: { md: '300px' },
                    height: '100%',
                    bgcolor: '#ffffff',
                }}
            >
                <Paper
                    elevation={2}
                    sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 3,
                        p: 3,
                        overflow: 'auto',
                    }}
                >
                    <RequestDetail />
                    <Comment />
                </Paper>
            </Box>

            <Box
                sx={{
                    flex: 1,
                    minWidth: { md: '300px' },
                    height: '100%',
                    bgcolor: '#ffffff',
                }}
            >
                <Paper
                    elevation={2}
                    sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 3,
                        p: 3,
                        overflow: 'auto',
                    }}
                >
                    <Approver />
                    <Follower />
                    <Progress />
                </Paper>
            </Box>
        </Stack>
    );
}
