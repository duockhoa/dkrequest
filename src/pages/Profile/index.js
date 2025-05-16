import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { useDispatch, useSelector } from 'react-redux';
import Avatar from '@mui/material/Avatar';
import { Button, Divider, Typography, Badge } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import styled from '@emotion/styled';
import UserInfoItem from '../../component/UserInfoItem';
import ChangePassWord from '../../component/ChangePassWord';
import { updateAvatarService } from '../../services/uploadAvatarService';
import { useNavigate } from 'react-router-dom';
import { fetchUser } from '../../redux/slice/userSlice';

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

function Profile() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user.userInfo);

    const handleChangeAvatar = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append('avatar', file);
            formData.append('id', user.id);

            try {
                await updateAvatarService(formData);
                // Refresh user data after successful avatar update
                await dispatch(fetchUser());
            } catch (error) {
                alert('Cập nhật ảnh đại diện thất bại: ' + error.message);
                console.error('Error updating avatar:', error);
            }
        }
    };

    return (
        <Stack
            sx={{
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(0, 0, 0, 0.07)',
            }}
            justifyContent="center"
            alignItems="center"
        >
            <Paper sx={{ height: '90%', width: '90%' }}>
                <Grid container height="100%">
                    <Grid item xs={4} height="100%" justifyContent="center" display="flex">
                        <Box padding={5} height="100%" position="relative">
                            <Badge
                                overlap="circular"
                                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                badgeContent={
                                    <Button
                                        sx={{
                                            minWidth: 0,
                                            padding: 1,
                                            borderRadius: '50%',
                                            backgroundColor: 'primary.main',
                                            color: 'white',
                                            width: 48,
                                            height: 48,
                                            fontSize: '2rem',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            '&:hover': {
                                                backgroundColor: 'primary.dark',
                                            },
                                        }}
                                        component="label"
                                        role={undefined}
                                        tabIndex={-1}
                                    >
                                        <EditIcon fontSize="large" />
                                        <VisuallyHiddenInput
                                            type="file"
                                            onChange={handleChangeAvatar}
                                            multiple
                                        ></VisuallyHiddenInput>
                                    </Button>
                                }
                            >
                                <Avatar sx={{ width: 200, height: 200 }} alt={user.name} src={user.avatar}></Avatar>
                            </Badge>
                            <Divider
                                sx={{
                                    width: '100%',
                                    marginY: 2,
                                    borderColor: 'rgba(0, 0, 0, 0.8)', // Làm đậm màu đường kẻ
                                }}
                            />
                            <Typography
                                variant="h4" // Tăng kích thước tên
                                fontWeight="bold"
                                textAlign="center"
                                sx={{ fontSize: '2rem' }} // Tùy chỉnh kích thước font chữ
                            >
                                {user.name}
                            </Typography>
                            <Typography
                                variant="body1"
                                textAlign="center"
                                color="primary.main" // Thay đổi màu sắc
                                sx={{ fontSize: '1.5rem', marginTop: 1 }} // Tăng kích thước email và thêm khoảng cách
                            >
                                {user.email}
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={8}>
                        <Box sx={{ height: '45%' }} p={2}>
                            <Paper sx={{ height: '100%', padding: 3 }} elevation={3}>
                                <Grid container>
                                    <Grid item xs={6}>
                                        <Typography variant="h4" fontWeight="bold">
                                            Thông tin người dùng:
                                        </Typography>
                                        <Divider
                                            sx={{
                                                width: '100%',
                                                marginY: 2,
                                                borderColor: 'rgba(0, 0, 0, 0.8)', // Làm đậm màu đường kẻ
                                            }}
                                        />
                                    </Grid>
                                </Grid>
                                <Grid container p={2} pl={5} spacing={4}>
                                    <Grid item xs={6}>
                                        <UserInfoItem label="Tên" value={user.name} />
                                        <UserInfoItem label="Phòng ban" value={user.department} />
                                        <UserInfoItem label="Chức vụ" value={user.position} />
                                        <UserInfoItem label="Trạng thái" value={'Chính thức'} />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <UserInfoItem label="Email" value={user.email} />
                                        <UserInfoItem label="SĐT" value={user.phoneNumber} />
                                        <UserInfoItem label="Giới tính" value={user.sex} />
                                        <UserInfoItem label="Ngày sinh" value={user.birthday} />
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Box>
                        <Box sx={{ height: '55%' }} p={2}>
                            <ChangePassWord></ChangePassWord>
                        </Box>
                    </Grid>
                </Grid>
            </Paper>
        </Stack>
    );
}

export default Profile;
