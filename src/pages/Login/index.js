import Cookies from 'js-cookie'; // Import thư viện js-cookie
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import FormControl from '@mui/material/FormControl';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginService } from '../../services/loginService';
import { logo } from '../../assets/images';

function Login() {
    // phần show passWord
    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => setShowPassword((show) => !show);

    // Kiểm tra lỗi thông tin
    const [formError, setFormError] = useState({
        email: false,
        passWord: false,
        info: false,
    });
    // Phần điền thông tin đăng nhập
    const [loginInfo, setLoginInfo] = useState({
        email: '',
        passWord: '',
    });

    const chageLoginInfo = (fill, value) => {
        setLoginInfo({ ...loginInfo, [fill]: value });
        if (value === '') {
            setFormError({ ...formError, [fill]: true, info: false });
        } else {
            setFormError({ ...formError, [fill]: false, info: false });
        }
    };

    // nút Đăng nhập
    const navigate = useNavigate();
    const sendInfo = async () => {
        try {
            const response = await loginService(loginInfo);
            const data = response.data;
            if (data.token) {
                Cookies.set('token', data.token); // Token sẽ hết hạn sau 7 ngày
                navigate('/');
            } else {
                setFormError({ ...formError, info: true });
            }
        } catch (err) {
            setFormError({ ...formError, info: true });
        }
    };

    const handleLogin = () => {
        sendInfo();
    };

    // xử lý khi ấn enter thì đăng nhập
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleLogin();
        }
    };

    return (
        <Stack sx={{ height: '100vh' }} alignItems="center">
            <Snackbar
                open={formError.info}
                autoHideDuration={1000}
                message="Lỗi"
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert severity="error" style={{ backgroundColor: 'transparent', fontSize: 16 }}>
                    Tên đăng nhập hoặc mật khẩu không đúng
                </Alert>
            </Snackbar>
            <Paper
                elevation={10}
                sx={{
                    width: 480,
                    height: 520,
                    margin: 'auto',
                    padding: 3,
                    background:
                        'linear-gradient(90deg, rgba(234,233,255,0.1) 0%, rgba(252,167,213,0.2) 35%, rgba(194,245,255,1) 100%)',
                }}
            >
                <Stack alignItems={'center'} textAlign={'center'}>
                    <img src={logo} style={{ display: 'block', height: 50 }}></img>
                    <Typography fontSize={24} padding={1} fontWeight={700}>
                        Đăng Nhập Vào DKPharma
                    </Typography>

                    <Stack padding={5} sx={{ width: '100%' }} spacing={3}>
                        <TextField
                            id="email"
                            error={formError.email || formError.info}
                            label="Email của bạn"
                            variant="outlined"
                            focused
                            fullWidth
                            margin="normal"
                            size="small"
                            value={loginInfo.email}
                            onKeyDown={handleKeyDown}
                            onChange={(e) => chageLoginInfo(e.target.id, e.target.value)}
                            InputProps={{
                                sx: { fontSize: '16px' },
                            }}
                            InputLabelProps={{
                                sx: { fontSize: '16px' },
                            }}
                        ></TextField>

                        <FormControl
                            sx={{ m: 1, width: '100%' }}
                            variant="outlined"
                            focused
                            size="small"
                            error={formError.passWord || formError.info}
                        >
                            <InputLabel htmlFor="outlined-adornment-password" sx={{ fontSize: 16 }}>
                                Mật khẩu
                            </InputLabel>

                            <OutlinedInput
                                id="passWord"
                                type={showPassword ? 'text' : 'password'}
                                value={loginInfo.passWord}
                                onChange={(e) => chageLoginInfo(e.target.id, e.target.value)}
                                onKeyDown={handleKeyDown}
                                sx={{
                                    fontSize: 16,
                                }}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label={showPassword ? 'hide the password' : 'display the password'}
                                            onClick={handleClickShowPassword}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                                label="Password"
                            />
                        </FormControl>

                        <Button
                            variant="contained"
                            onClick={handleLogin}
                            sx={{ borderRadius: '999px', fontSize: '14px', opacity: 0.9 }}
                            fullWidth
                            size="large"
                            disabled={formError.email || formError.passWord}
                        >
                            Đăng Nhập
                        </Button>
                    </Stack>
                    <Stack pl={5} pr={5}>
                        <Typography fontSize={14}>
                            Bạn chưa có tài khoản? <Link href="register">Đăng ký</Link>
                        </Typography>
                        <Link fontSize={14} href="forgotpassword">
                            Quên mật khẩu?
                        </Link>
                        <Typography fontSize={14} textAlign="center">
                            Đăng nhập đồng nghĩa với đã đồng ý .<Link href="policy"> điều khoản và chính sách .</Link>
                            của chúng tôi
                        </Typography>
                    </Stack>
                </Stack>
            </Paper>
        </Stack>
    );
}

export default Login;
