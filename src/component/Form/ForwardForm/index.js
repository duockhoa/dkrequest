import { Box, Typography, Button, Stack, TextField, Autocomplete } from '@mui/material';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers } from '../../../redux/slice/usersSlice';

function ForwardForm({ onCancel, onSubmit }) {
    const users = useSelector(state => state.users.users);
    const [selectedUser, setSelectedUser] = useState(null);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchUsers());
    }, [dispatch]);

    const handleSubmit = () => {
        if (!selectedUser) return;
        onSubmit({ new_user_id: selectedUser.id });
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography
                variant="h6"
                sx={{
                    mb: 3,
                    fontWeight: 'bold',
                    color: 'primary.main',
                    textAlign: 'center',
                    fontSize: '1.8rem',
                }}
            >
                Chuyển yêu cầu phê duyệt
            </Typography>

            <Stack spacing={3}>
                <Stack direction="row" alignItems="center" spacing={2}>
                    <Typography sx={{ minWidth: 160, fontSize: '1.4rem' }}>Người phê duyệt (*)</Typography>
                    <Autocomplete
                        options={users}
                        getOptionLabel={(option) => `${option.name} - ${option.department}`}
                        value={selectedUser}
                        onChange={(_, newValue) => setSelectedUser(newValue)}
                        renderOption={(props, option) => (
                            <li {...props} style={{ fontSize: '1.6rem' }}>
                                {option.name} - {option.department}
                            </li>
                        )}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                fullWidth
                                required
                                error={!selectedUser}
                                helperText={!selectedUser ? 'Vui lòng chọn người phê duyệt' : ''}
                                size="medium"
                                inputProps={{
                                    ...params.inputProps,
                                    style: { fontSize: '1.4rem' },
                                }}
                            />
                        )}
                        sx={{ flex: 1 }}
                    />
                </Stack>

                <Stack direction="row" spacing={3} justifyContent="flex-end">
                    <Button
                        variant="outlined"
                        color="error"
                        onClick={onCancel}
                        sx={{
                            minWidth: 110,
                            fontWeight: 500,
                            borderRadius: 2,
                            fontSize: '1.4rem',
                        }}
                    >
                        Huỷ
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleSubmit}
                        disabled={!selectedUser}
                        sx={{
                            minWidth: 110,
                            fontWeight: 500,
                            borderRadius: 2,
                            fontSize: '1.4rem',
                            boxShadow: 2,
                        }}
                    >
                        Chuyển
                    </Button>
                </Stack>
            </Stack>
        </Box>
    );
}

export default ForwardForm;
