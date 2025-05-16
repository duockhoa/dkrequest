import { useEffect } from 'react';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import Header from '../../component/Header'; // Đường dẫn đến Header
import Sidebar from '../../component/Sidebar'; // Đường dẫn đến Sidebar
import { useNavigate } from 'react-router-dom'; // Import useNavigate để chuyển hướng
import { useDispatch, useSelector } from 'react-redux'; // Import useSelector và useDispatch từ react-redux
import { fetchUser } from '../../redux/slice/userSlice'; // Import action fetchUser từ userSlice
import { checkTokenService } from '../../services/checkTokenService'; // Import service kiểm tra token
import LoadingPage from '../../component/LoadingPage';
import { Divider } from '@mui/material';

function DefaultLayout({ children }) {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const userInfo = useSelector((state) => state.user.userInfo);

    useEffect(() => {
        dispatch(fetchUser());
        const checkToken = async () => {
            try {
                const response = await checkTokenService();
                if (!response) {
                    navigate('/login');
                }
            } catch (error) {
                console.error('Error checking token:', error);
            }
        };
        checkToken();
    }, [dispatch, navigate]);

    if (userInfo.name === '') {
        return <LoadingPage></LoadingPage>;
    }

    return (
        <Stack sx={{ height: '100vh' }}>
            <Header />
            <Grid container sx={{ flex: 1 }}>
                <Grid
                    item
                    width="245px"
                    sx={{
                        backgroundColor: '#f0f0f0', // Màu nền sáng
                        height: '100%',
                    }}
                >
                    <Sidebar />
                </Grid>
                <Grid
                    item
                    flexGrow={1}
                    sx={{
                        backgroundColor: '#e0e0f0', // Màu nền tối hơn
                        padding: '16px',
                        height: '100%', // Chiều cao đầy đủ
                    }}
                >
                    {children}
                </Grid>
            </Grid>
        </Stack>
    );
}

export default DefaultLayout;
