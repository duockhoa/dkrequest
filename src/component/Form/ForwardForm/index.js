import { Box, Typography, Button, Stack, TextField, Autocomplete } from '@mui/material';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { getAllUsersService } from '../../../services/usersService';

function ForwardForm({ onCancel, onSubmit }) {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await getAllUsersService();
                setUsers(response);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };
        fetchUsers();
    }, []);

    const handleSubmit = () => {
        if (!selectedUser) return;
        onSubmit(selectedUser.id);
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
