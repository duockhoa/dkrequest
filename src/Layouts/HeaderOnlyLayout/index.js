import { useEffect } from 'react';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import Header from '../../component/Header';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUser } from '../../redux/slice/userSlice';
import { checkTokenService } from '../../services/checkTokenService';
import LoadingPage from '../../component/LoadingPage';

function HeaderOnlyLayout({ children }) {
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
            {/* Header */}
            <Header />
            {/* Nội dung chính */}
            <Grid container sx={{ flex: 1 }}>
                {children}
            </Grid>
        </Stack>
    );
}

export default HeaderOnlyLayout;
