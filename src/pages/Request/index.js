import Requests from '../../component/SharedComponent/Requests';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { useLocation, useSearchParams } from 'react-router-dom';
import { setRequestTypeId, setRequestId, setDepartment } from '../../redux/slice/requestId';
import { lazy, Suspense, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRequestDetail } from '../../redux/slice/requestDetailSlice';
import { fetchRequestTypes } from '../../redux/slice/requestTypesSlice';
import LoadingPage from '../../component/SharedComponent/LoadingPage';
import Grid2 from '@mui/material/Unstable_Grid2';
import { useElementWidth } from '../../hooks/useElementWidth';
import { Button, Divider, Typography } from '@mui/material';

const RequestDetail = lazy(() => import('../../component/SharedComponent/RequestDetail'));
const Comment = lazy(() => import('../../component/SharedComponent/Comment'));
const Approver = lazy(() => import('../../component/SharedComponent/Approver'));
const Follower = lazy(() => import('../../component/SharedComponent/Follower'));
const Progress = lazy(() => import('../../component/SharedComponent/Progress'));

export default function Request() {
    const requestId = useSelector((state) => state.requestId.requestId);
    const [searchParams] = useSearchParams();
    const location = useLocation();
    const dispatch = useDispatch();
    const requestTypes = useSelector((state) => state.requestTypes.data);
    const metadataError = useSelector((state) => state.requestTypes.error);
    const activeRequestId = searchParams.get('view') === 'detail' ? parseInt(searchParams.get('requestid'), 10) || null : null;
    const matchedType = requestTypes.find(type => type.path === location.pathname);
    const resolvedTypeId = location.pathname === '/' ? 'all' : (requestTypes.length ? matchedType?.id || 'all' : null);
    const elementRef = useRef(null);
    const width = useElementWidth(elementRef);

    useEffect(() => {
        if (!activeRequestId) {
            dispatch({ type: 'requestDetail/clearRequestDetail' });
            return;
        }
        const pending = dispatch(fetchRequestDetail(activeRequestId));
        return () => {
            pending.abort();
            dispatch({ type: 'requestDetail/clearRequestDetail' });
        };
    }, [activeRequestId, dispatch]);

    useEffect(() => {
        dispatch(fetchRequestTypes());
    }, [dispatch]);

    // Update requestTypeId based on path
    useEffect(() => {
        if (requestTypes.length > 0) {
            const currentPath = location.pathname;
            const matchedType = requestTypes.find((type) => currentPath === type.path);

            if (matchedType) {
                dispatch(setRequestTypeId(matchedType.id));
                dispatch(setDepartment(matchedType.departmentName || matchedType.despartmentName));
            } else {
                dispatch(setRequestTypeId('all'));
            }
        }
    }, [location.pathname, requestTypes, dispatch]);

    // Handle requestId changes from searchParams
    useEffect(() => {
        const idFromParams = searchParams.get('requestid');
        const view = searchParams.get('view');
        if (view === 'detail' && idFromParams && requestId !== parseInt(idFromParams, 10)) {
            dispatch(setRequestId(parseInt(idFromParams, 10)));
        } else if (view !== 'detail' && requestId) {
            dispatch(setRequestId(null));
        }
    }, [searchParams, dispatch, requestId]);

    const view = searchParams.get('view');

    if (!resolvedTypeId) {
        return metadataError ? <Box sx={{ p: 2 }}>
            <Typography color="error">{metadataError}</Typography>
            <Button onClick={() => dispatch(fetchRequestTypes())}>Thử lại</Button>
        </Box> : <LoadingPage />;
    }

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
                    <Requests requestTypeId={resolvedTypeId} />
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
                    <Suspense fallback={<LoadingPage />}>
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
                    </Suspense>
                </Grid2>
            )}
        </Grid2>
    );
}
