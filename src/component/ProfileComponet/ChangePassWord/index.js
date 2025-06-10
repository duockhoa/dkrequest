import { useState } from 'react';
import { Paper, Typography, Divider, Grid, TextField, Button, List, ListItem, ListItemText } from '@mui/material';
import { isStrongPassword } from 'validator';
import { updateUserService } from '../../../services/updateUserServive';
import { checkTokenService } from '../../../services/checkTokenService';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function ChangePassWord() {
    const navigate = useNavigate();
    const userInfo = useSelector((state) => state.user.userInfo);
    const [password, setPassword] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [error, setError] = useState({});

    // Hàm xác thực mật khẩu
    const validatePassword = (name, value) => {
        let errorMessage = '';

        if (name === 'newPassword') {
            if (!isStrongPassword(value, { minLength: 8, minUppercase: 1, minNumbers: 1, minSymbols: 1 })) {
                errorMessage = 'Mật khẩu không đủ mạnh.';
            }
        }

        if (name === 'confirmPassword') {
            if (value !== password.newPassword) {
                errorMessage = 'Mật khẩu xác nhận không khớp.';
            }
        }

        return errorMessage;
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setPassword((prevPassword) => ({
            ...prevPassword,
            [name]: value,
        }));

        // Xác thực mật khẩu và cập nhật lỗi
        const errorMessage = validatePassword(name, value);
        setError((prevError) => ({
            ...prevError,
            [name]: errorMessage,
        }));
    };

    const handleClick = async () => {
        const oldPassword = (await checkTokenService()).data.userInfo.passWord;

        if (oldPassword !== password.currentPassword) {
            setError((prevError) => ({
                ...prevError,
                currentPassword: 'Sai mật khẩu hiện tại.',
            }));
            return;
        }

        if (!password.newPassword || error.newPassword) {
            setError((prevError) => ({
                ...prevError,
                newPassword: 'Vui lòng nhập mật khẩu mới hợp lệ.',
            }));
            return;
        }

        if (!password.confirmPassword || error.confirmPassword) {
            setError((prevError) => ({
                ...prevError,
                confirmPassword: 'Vui lòng xác nhận mật khẩu khớp.',
            }));
            return;
        }

        // Nếu không có lỗi, xử lý cập nhật mật khẩu
        await updateUserService({
            id: userInfo.id,
            password: password.newPassword,
        });

        // Xóa token cũ trong cookie
        document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';

        // Xác nhận đổi mật khẩu thành công và chuyển hướng sang trang đăng nhập
        alert('Mật khẩu đã được cập nhật thành công! Vui lòng đăng nhập lại.');
        navigate('/login');
    };

    return (
        <Paper sx={{ height: '100%', padding: 3 }} elevation={3}>
            <Typography variant="h4" fontWeight="bold" sx={{ fontSize: '1.8rem' }}>
                Đổi mật khẩu:
            </Typography>
            <Divider
                sx={{
                    width: '100%',
                    marginY: 2,
                    borderColor: 'rgba(0, 0, 0, 0.8)', // Làm đậm màu đường kẻ
                }}
            />
            <Grid container spacing={7}>
                {/* Cột nhập mật khẩu */}
                <Grid item xs={6}>
                    <TextField
                        label="Mật khẩu hiện tại"
                        type="password"
                        fullWidth
                        name="currentPassword"
                        helperText={error.currentPassword}
                        error={!!error.currentPassword}
                        value={password.currentPassword}
                        onChange={handleChange}
                        size="small"
                        sx={{
                            marginBottom: 2,
                            '& .MuiInputBase-input': { fontSize: '1.6rem' }, // Tăng kích thước chữ trong ô nhập
                            '& .MuiInputLabel-root': { fontSize: '1.6rem' }, // Tăng kích thước chữ của label
                            '& .MuiFormHelperText-root': { fontSize: '1.4rem' }, // Tăng kích thước chữ của helperText
                        }}
                    />
                    <TextField
                        label="Mật khẩu mới"
                        type="password"
                        fullWidth
                        name="newPassword"
                        helperText={error.newPassword}
                        error={!!error.newPassword}
                        value={password.newPassword}
                        onChange={handleChange}
                        size="small"
                        sx={{
                            marginBottom: 2,
                            '& .MuiInputBase-input': { fontSize: '1.6rem' },
                            '& .MuiInputLabel-root': { fontSize: '1.6rem' },
                            '& .MuiFormHelperText-root': { fontSize: '1.4rem' },
                        }}
                    />
                    <TextField
                        label="Nhập lại mật khẩu"
                        type="password"
                        fullWidth
                        name="confirmPassword"
                        helperText={error.confirmPassword}
                        error={!!error.confirmPassword}
                        value={password.confirmPassword}
                        onChange={handleChange}
                        size="small"
                        sx={{
                            marginBottom: 2,
                            '& .MuiInputBase-input': { fontSize: '1.6rem' },
                            '& .MuiInputLabel-root': { fontSize: '1.6rem' },
                            '& .MuiFormHelperText-root': { fontSize: '1.4rem' },
                        }}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        sx={{
                            marginTop: 2,
                            borderRadius: '8px',
                            fontSize: '1.2rem',
                        }}
                        onClick={handleClick}
                    >
                        Cập nhật
                    </Button>
                </Grid>

                {/* Cột hướng dẫn */}
                <Grid item xs={6}>
                    <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.6rem' }}>
                        <strong>Mật khẩu tài khoản của bạn phải đáp ứng các yêu cầu sau:</strong>
                    </Typography>
                    <List>
                        <ListItem sx={{ paddingY: 0 }}>
                            <ListItemText
                                primary="• Có ít nhất 8 ký tự"
                                primaryTypographyProps={{ fontSize: '1.6rem' }}
                            />
                        </ListItem>
                        <ListItem sx={{ paddingY: 0 }}>
                            <ListItemText
                                primary="• Có ít nhất một chữ hoa và một chữ thường"
                                primaryTypographyProps={{ fontSize: '1.6rem' }}
                            />
                        </ListItem>
                        <ListItem sx={{ paddingY: 0 }}>
                            <ListItemText
                                primary="• Có ít nhất một chữ số"
                                primaryTypographyProps={{ fontSize: '1.6rem' }}
                            />
                        </ListItem>
                        <ListItem sx={{ paddingY: 0 }}>
                            <ListItemText
                                primary="• Có ít nhất một ký tự đặc biệt"
                                primaryTypographyProps={{ fontSize: '1.6rem' }}
                            />
                        </ListItem>
                    </List>
                </Grid>
            </Grid>
        </Paper>
    );
}

export default ChangePassWord;
