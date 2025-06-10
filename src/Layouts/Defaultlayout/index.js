import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Header from '../../component/SharedComponent/Header';
import Sidebar from '../../component/SharedComponent/Sidebar';
import LoadingPage from '../../component/SharedComponent/LoadingPage';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setActiveSideBar } from '../../redux/slice/sibarSlice';

function DefaultLayout({ children }) {
    const dispatch = useDispatch();
    const path = window.location.pathname;
    const segments = path.split('/');
    const target = segments[1];

    useEffect(() => {
        const fetchData = async () => {
            if (!target) {
                dispatch(setActiveSideBar('/'));
            } else {
                dispatch(setActiveSideBar(`/${target}`));
            }
        };

        fetchData();
    }, [target, dispatch]);

    const userInfo = useSelector((state) => state.user.userInfo);
    if (userInfo.name === '') {
        return <LoadingPage />;
    }

    return (
        <Stack sx={{ height: '100vh' }}>
            <Header />
            <Box sx={{ display: 'flex', flex: 1, height: '100%', overflow: 'hidden' }}>
                <Box
                    sx={{
                        width: '255px',
                        backgroundColor: '#f0f0f0',
                        //height: '100%',
                    }}
                >
                    <Sidebar />
                </Box>
                <Box
                    sx={{
                        flexGrow: 1,
                        backgroundColor: '#e0e0f0',
                        padding: '8px',
                        display: 'flex',
                        height: '100%',
                    }}
                >
                    {children}
                </Box>
            </Box>
        </Stack>
    );
}

export default DefaultLayout;
