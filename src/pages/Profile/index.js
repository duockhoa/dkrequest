import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { useDispatch, useSelector } from 'react-redux';
import Avatar from '@mui/material/Avatar';
import { Button, Divider, Typography, Badge } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import styled from '@emotion/styled';
import UserInfoItem from '../../component/ProfileComponet/UserInfoItem';
import ChangePassWord from '../../component/ProfileComponet/ChangePassWord';
import { updateAvatarService } from '../../services/uploadAvatarService';
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
            <Paper sx={{ height: '90%', width: '90%', p: 4 }}>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={4} height="100%">
                    {/* Avatar & Basic Info */}
                    <Stack
                        alignItems="center"
                        justifyContent="flex-start"
                        spacing={2}
                        sx={{ width: { xs: '100%', md: '35%' } }}
                    >
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
                                    <VisuallyHiddenInput type="file" onChange={handleChangeAvatar} multiple />
                                </Button>
                            }
                        >
                            <Avatar sx={{ width: 200, height: 200 }} alt={user.name} src={user.avatar}></Avatar>
                        </Badge>
                        <Divider
                            sx={{
                                width: '100%',
                                marginY: 2,
                                borderColor: 'rgba(0, 0, 0, 0.8)',
                            }}
                        />
                        <Typography variant="h4" fontWeight="bold" textAlign="center" sx={{ fontSize: '2rem' }}>
                            {user.name}
                        </Typography>
                        <Typography
                            variant="body1"
                            textAlign="center"
                            color="primary.main"
                            sx={{ fontSize: '1.5rem', marginTop: 1 }}
                        >
                            {user.email}
                        </Typography>
                    </Stack>
                    {/* User Info & Change Password */}
                    <Stack sx={{ flex: 1 }} spacing={4}>
                        <Paper sx={{ p: 3 }} elevation={3}>
                            <Typography variant="h4" fontWeight="bold">
                                Thông tin người dùng:
                            </Typography>
                            <Divider
                                sx={{
                                    width: '100%',
                                    marginY: 2,
                                    borderColor: 'rgba(0, 0, 0, 0.8)',
                                }}
                            />
                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={4} pl={2}>
                                <Stack spacing={2} flex={1}>
                                    <UserInfoItem label="Tên" value={user.name} />
                                    <UserInfoItem label="Phòng ban" value={user.department} />
                                    <UserInfoItem label="Chức vụ" value={user.position} />
                                    <UserInfoItem label="Trạng thái" value={'Chính thức'} />
                                </Stack>
                                <Stack spacing={2} flex={1}>
                                    <UserInfoItem label="Email" value={user.email} />
                                    <UserInfoItem label="SĐT" value={user.phoneNumber} />
                                    <UserInfoItem label="Giới tính" value={user.sex} />
                                    <UserInfoItem label="Ngày sinh" value={user.birthday} />
                                </Stack>
                            </Stack>
                        </Paper>
                        <Box>
                            <ChangePassWord />
                        </Box>
                    </Stack>
                </Stack>
            </Paper>
        </Stack>
    );
}

export default Profile;
