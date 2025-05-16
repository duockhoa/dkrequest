import Container from '@mui/material/Container';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { checkTokenService } from '../../services/checkTokenService';
import LoadingPage from '../../component/LoadingPage'; // Import LoadingPage
import Cookie from 'js-cookie';

function LoginLayout({ children }) {
    const navigate = useNavigate();

    useEffect(() => {
        const checkToken = async () => {
            try {
                const response = await checkTokenService();
                if (response.data.userInfo) {
                    navigate('/');
                }
            } catch (error) {
                console.error('Error checking token:', error);
            }
        };
        checkToken();
    }, [navigate]);

    if (Cookie.get('token')) {
        return <LoadingPage />; // Hiển thị LoadingPage nếu đang kiểm tra token
    }

    return <Container>{children}</Container>;
}

export default LoginLayout;
