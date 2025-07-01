import Requests from '../../component/SharedComponent/Requests';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { useLocation, useSearchParams } from 'react-router-dom';
import { setRequestTypeId, setRequestId } from '../../redux/slice/requestId';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRequestDetail } from '../../redux/slice/requestDetailSlice';
import { getAllRequestTypeService } from '../../services/requestTypeService';
import RequestDetail from '../../component/SharedComponent/RequestDetail';
import Comment from '../../component/SharedComponent/Comment';
import Grid2 from '@mui/material/Unstable_Grid2';
import Approver from '../../component/SharedComponent/Approver';
import Follower from '../../component/SharedComponent/Follower';
import Progress from '../../component/SharedComponent/Progress';
import { useElementWidth } from '../../hooks/useElementWidth';
import { Divider } from '@mui/material';

export default function Request() {
    const requestId = useSelector((state) => state.requestId.requestId);
    const [searchParams] = useSearchParams();
    const location = useLocation();
    const dispatch = useDispatch();
    const [requestTypes, setRequestTypes] = useState([]);
    const elementRef = useRef(null);
    const width = useElementWidth(elementRef);

    useEffect(() => {
        if (requestId) {
            dispatch(fetchRequestDetail(requestId));
        }
        return () => {
            dispatch({ type: 'requestDetail/clearRequestDetail' });
        };
    }, [requestId, dispatch]);

    useEffect(() => {
        const fetchRequestTypes = async () => {
            try {
                const types = await getAllRequestTypeService();
                setRequestTypes(types);
            } catch (error) {
                console.error('Error fetching request types:', error);
            }
        };
        fetchRequestTypes();
    }, []);

    // Update requestTypeId based on path
    useEffect(() => {
        if (requestTypes.length > 0) {
            const currentPath = location.pathname;
            const matchedType = requestTypes.find((type) => currentPath.includes(type.path));
            if (matchedType) {
                dispatch(setRequestTypeId(matchedType.id));
            } else {
                // Optional: Clear requestTypeId if no match, or handle default
                dispatch(setRequestTypeId('all')); // Set to 'all' or handle as needed
            }
        }
    }, [location.pathname, requestTypes, dispatch]);

    // Handle requestId changes from searchParams
    useEffect(() => {
        const idFromParams = searchParams.get('requestid');
        if (idFromParams) {
            dispatch(setRequestId(parseInt(idFromParams, 10)));
        }
    }, [searchParams, dispatch]); // Removed location from deps as it's covered by searchParams

    const view = searchParams.get('view');

    return (
        <Grid2 container spacing={1} sx={{ width: '100%', height: '100%', overflow: 'hidden' }} ref={elementRef}>
            <Grid2
                xs={view === 'detail' ? 5 : 12}
                borderRadius={2}
                height={'100%'}
                display={view === 'detail' && width < 720 ? 'none' : 'block'}
            >
                <Box
                    height={'100%'}
                    sx={{ overflowY: 'auto' }}
                    backgroundColor={'#fff'}
                    borderRadius={2}
                    overflowY={'auto'}
                >
                    <Requests />
                </Box>
            </Grid2>
            {view === 'detail' && (
                <Grid2
                    xs={width < 720 ? 12 : 7}
                    sx={{ overflowY: 'auto' }}
                    spacing={1}
                    container
                    overflow={'auto'}
                    height={'100%'}
                >
                    <Grid2 item xs={width < 1200 ? 12 : 7} height={width > 1200 ? '100%' : 'auto'}>
                        <Box borderRadius={2} overflow={'hidden'} backgroundColor={'#fff'} height={'100%'}>
                            <Stack sx={{ p: 1 }} overflow={'auto'} height={'100%'} spacing={1}>
                                <RequestDetail />
                                <Divider sx={{ borderColor: 'black', mb: 1 }} />
                                <Comment />
                            </Stack>
                        </Box>
                    </Grid2>
                    <Grid2 item xs={width < 1200 ? 12 : 5} height={width > 1200 ? '100%' : 'auto'}>
                        <Box borderRadius={2} overflow={'hidden'} backgroundColor={'#fff'} height={'100%'}>
                            <Stack sx={{ p: 1 }} overflow={'auto'} height={'100%'} spacing={1}>
                                <Approver />
                                <Divider sx={{ borderColor: 'black', mb: 1 }} />
                                <Follower />
                                <Divider sx={{ borderColor: 'black', mb: 1 }} />
                                <Progress />
                            </Stack>
                        </Box>
                    </Grid2>
                </Grid2>
            )}
        </Grid2>

        // <Stack flexDirection={'row'} gap={1} flexWrap={'wrap'} overflow={'auto'} flexGrow={1}>
        //     <Box
        //         sx={{
        //             bgcolor: '#ffffff',
        //             borderRadius: 2,
        //             minWidth: { xs: '100%', sm: 320, md: 375 },
        //         }}
        //         height={width < 750 ? 'auto' : '100%'}
        //         maxWidth={width < 750 ? '100%' : '55%'}
        //         overflow={'auto'}
        //         flex={1}
        //     >
        //         <Box
        //             sx={{
        //                 display: 'flex',
        //                 flexDirection: 'column',
        //                 gap: 3,
        //                 p: 3,
        //             }}
        //         >
        //             <RequestDetail />
        //             <Comment />
        //         </Box>
        //     </Box>
        //     <Box
        //         sx={{
        //             bgcolor: '#ffffff',
        //             borderRadius: 2,
        //             minWidth: { xs: '100%', sm: 320, md: 375 },
        //         }}
        //         height={width < 750 ? 'auto' : '100%'}
        //         maxWidth={width < 750 ? '100%' : '45%'}
        //         flex={1}
        //     >
        //         <Box
        //             sx={{
        //                 height: '100%',
        //                 display: 'flex',
        //                 flexDirection: 'column',
        //                 gap: 3,
        //                 p: 3,
        //                 overflow: 'auto',
        //             }}
        //         >
        //             <Approver />
        //             <Follower />
        //             <Progress />
        //         </Box>
        //     </Box>
        // </Stack>
    );
}
