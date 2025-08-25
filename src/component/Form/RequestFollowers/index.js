import { Stack, Typography, Autocomplete, TextField } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import { fetchUsers } from '../../../redux/slice/usersSlice';
import { setRequestFormData } from '../../../redux/slice/requestFormDataSlice';
import { fetchRequestFollowers } from '../../../redux/slice/requestFollowerSlice';
import { set } from 'date-fns';

// Hàm khởi tạo followers từ dữ liệu requestFollowers
const initFollowers = (requestFollowers, users) => {
    if (!Array.isArray(requestFollowers) || requestFollowers.length === 0) return [];
    // Map user_id từ requestFollowers sang user object trong users
    return requestFollowers.map((f) => users.find((u) => u.id === f.user_id)).filter(Boolean); // Loại bỏ undefined nếu không tìm thấy user
};

function RequestFollowers() {
    const dispatch = useDispatch();
    const [followers, setFollowers] = useState([]);
    const users = useSelector((state) => state.users.users);
    const requestTypeId = useSelector((state) => state.requestId.requestTypeId);
    const user = useSelector((state) => state.user.userInfo);
    const requestFormData = useSelector((state) => state.requestFormData.value);
    const requestFollowers = useSelector((state) => state.requestFollower.followerData);

    useEffect(() => {
        if (requestTypeId && user.id) {
            dispatch(fetchRequestFollowers({ requestTypeId, userId: user.id }));
        }
        if (users.length === 0) {
            dispatch(fetchUsers());
        }
    }, [dispatch, users.length]);

    // Khởi tạo followers khi có dữ liệu
    useEffect(() => {
        if (requestFollowers.length > 0) {
            setFollowers(requestFollowers);
            dispatch(
                setRequestFormData({
                    ...requestFormData,
                    followers: requestFollowers.map((follower) => {
                        return { user_id: follower.id };
                    }),
                }),
            );
        }
    }, [requestFollowers]);

    const handleFollowersChange = (event, newValue) => {
        setFollowers(newValue);
        dispatch(
            setRequestFormData({
                ...requestFormData,
                followers: newValue.map((follower) => {
                    return { user_id: follower.id };
                }),
            }),
        );
    };

    return (
        <Stack direction="row" alignItems="center" spacing={2}>
            <Typography sx={{ minWidth: 120, fontSize: '1.4rem' }}>Người theo dõi:</Typography>
            <Autocomplete
                multiple
                fullWidth
                options={users}
                getOptionLabel={(option) => option.name}
                value={followers}
                onChange={handleFollowersChange}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        size="medium"
                        required
                        inputProps={{
                            ...params.inputProps,
                            style: { fontSize: '1.4rem' },
                        }}
                    />
                )}
                sx={{
                    '& .MuiChip-root': {
                        height: '24px',
                        backgroundColor: '#e8f5e9',
                        '& .MuiChip-label': {
                            fontSize: '1.2rem',
                            color: '#2e7d32',
                        },
                    },
                    '& .MuiAutocomplete-option': {
                        fontSize: '1.6rem', // Changed from 8.8rem to 1.6rem for better readability
                        padding: '18px 18px', // Increased padding for better touch targets
                        '&:hover': {
                            backgroundColor: '#f5f5f5',
                        },
                    },
                }}
            />
        </Stack>
    );
}

export default RequestFollowers;
