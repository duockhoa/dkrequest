import { Box, Typography, Avatar, AvatarGroup, IconButton, Stack } from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import AddIcon from '@mui/icons-material/Add';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchRequestDetail } from '../../../redux/slice/requestDetailSlice';
import LoadingPage from '../LoadingPage';

function Follower() {
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

    if (loading) {
        return <LoadingPage />;
    }

    if (error) {
        return <Typography color="error">Error: {error}</Typography>;
    }

    return (
        <Box sx={{ bgcolor: 'background.paper', p: 2, borderRadius: 1 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                <Typography sx={{ fontSize: '1.6rem', fontWeight: 600 }}>NGƯỜI THEO DÕI</Typography>
                <IconButton size="small">
                    <KeyboardArrowUpIcon />
                </IconButton>
            </Stack>

            <Stack direction="row" alignItems="center" spacing={1}>
                <AvatarGroup
                    max={5}
                    sx={{
                        '& .MuiAvatar-root': {
                            width: 32,
                            height: 32,
                            fontSize: '1.4rem',
                        },
                    }}
                >
                    {requestDetail?.followers?.map((follower) => (
                        <Avatar key={follower.id} alt={follower.name} src={follower.avatar}>
                            {follower.name?.charAt(0)}
                        </Avatar>
                    ))}
                </AvatarGroup>
                <IconButton
                    size="small"
                    sx={{
                        width: 32,
                        height: 32,
                        bgcolor: 'grey.100',
                        '&:hover': {
                            bgcolor: 'grey.200',
                        },
                    }}
                >
                    <AddIcon fontSize="small" />
                </IconButton>
            </Stack>
        </Box>
    );
}

export default Follower;
