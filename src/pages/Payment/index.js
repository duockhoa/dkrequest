import Requests from '../../component/SharedComponent/Requests';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { useLocation, useSearchParams } from 'react-router-dom';
import { setRequestTypeId, setRequestId, setDepartment } from '../../redux/slice/requestId';
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
import Payments from '../../component/SharedComponent/Payments';
import { useElementWidth } from '../../hooks/useElementWidth';
import { Divider } from '@mui/material';

export default function Payment() {
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
                dispatch(setDepartment(matchedType.despartmentName));
            } else {
                dispatch(setRequestTypeId('all'));
            }
        }
    }, [location.pathname, requestTypes, dispatch]);

    // Handle requestId changes from searchParams
    useEffect(() => {
        const idFromParams = searchParams.get('requestid');
        if (idFromParams) {
            dispatch(setRequestId(parseInt(idFromParams, 10)));
        }
    }, [searchParams, dispatch]);

    const view = searchParams.get('view');

    return (
        <Grid2
            container
            spacing={1}
            sx={{
                width: '100%',
                height: '100%',
                overflow: 'hidden',
            }}
            ref={elementRef}
        >
            <Grid2
                xs={view === 'detail' ? 5 : 12}
                sx={{
                    borderRadius: 2,
                    height: '100%',
                    display: view === 'detail' && width < 720 ? 'none' : 'block',
                }}
            >
                <Box
                    sx={{
                        height: '100%',
                        overflowY: 'auto',
                        backgroundColor: '#fff',
                        borderRadius: 2,
                    }}
                >
                   <Payments />
                </Box>
            </Grid2>

            {view === 'detail' && (
                <Grid2
                    xs={width < 720 ? 12 : 7}
                    container
                    spacing={1}
                    sx={{
                        height: '100%',
                        overflow: 'auto',
                    }}
                >
                    <Grid2
                        xs={width < 1200 ? 12 : 7}
                        sx={{
                            height: width > 1200 ? '100%' : 'auto',
                        }}
                    >
                        <Box
                            sx={{
                                borderRadius: 2,
                                overflow: 'hidden',
                                backgroundColor: '#fff',
                                height: '100%',
                            }}
                        >
                            <Stack
                                sx={{
                                    p: 1,
                                    overflow: 'auto',
                                    height: '100%',
                                }}
                                spacing={1}
                            >
                                <RequestDetail />
                                <Divider sx={{ borderColor: 'black', mb: 1 }} />
                                <Comment />
                            </Stack>
                        </Box>
                    </Grid2>

                    <Grid2
                        xs={width < 1200 ? 12 : 5}
                        sx={{
                            height: width > 1200 ? '100%' : 'auto',
                        }}
                    >
                        <Box
                            sx={{
                                borderRadius: 2,
                                overflow: 'hidden',
                                backgroundColor: '#fff',
                                height: '100%',
                            }}
                        >
                            <Stack
                                sx={{
                                    p: 1,
                                    overflow: 'auto',
                                    height: '100%',
                                }}
                                spacing={1}
                            >
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
    );
}
