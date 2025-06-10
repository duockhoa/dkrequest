import Requests from '../../component/SharedComponent/Requests';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { useLocation, useSearchParams } from 'react-router-dom';
import { setRequestTypeId, setRequestId } from '../../redux/slice/requestId';
import { useLayoutEffect, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { getAllRequestTypeService } from '../../services/requestTypeService';
import DetailWrap from '../../component/SharedComponent/DetailWrap';

export default function Request() {
    const [searchParams] = useSearchParams();
    const location = useLocation();
    const dispatch = useDispatch();
    const [requestTypes, setRequestTypes] = useState([]);
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

    useLayoutEffect(() => {
        if (requestTypes.length > 0) {
            const currentPath = location.pathname;
            const matchedType = requestTypes.find((type) => currentPath.includes(type.path));
            if (matchedType) {
                dispatch(setRequestTypeId(matchedType.id));
            }
        }
    }, [location.pathname, requestTypes, dispatch]);

    // Handle requestId changes from searchParams
    useLayoutEffect(() => {
        const requestId = searchParams.get('requestid');
        if (requestId) {
            dispatch(setRequestId(parseInt(requestId)));
        }
    }, [searchParams, dispatch]);

    const view = searchParams.get('view');
    return (
        <Stack
            sx={{
                flexDirection: { xs: 'column', md: 'row' },
                minHeight: '100%',
                width: '100%',
                gap: 2,
                overflow: 'auto',
            }}
        >
            <Box
                sx={{
                    height: { xs: view === 'detail' ? '40%' : '100%', md: '100%' },
                    width: { xs: '100%', md: view === 'detail' ? '30%' : '100%' },
                    minWidth: { md: '300px' },
                    bgcolor: '#ffffff',
                }}
            >
                <Requests />
            </Box>
            {view === 'detail' && <DetailWrap />}
        </Stack>
    );
}
