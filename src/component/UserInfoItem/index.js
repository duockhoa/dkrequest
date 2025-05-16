import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { TextField } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { setUserInfo } from '../../redux/slice/userSlice';
function UserInfoItem({ label, value }) {
    const onEditUser = useSelector((state) => state.user.onEditUser);
    const userInfo = useSelector((state) => state.user.userInfo);
    const dispatch = useDispatch();
    const handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        dispatch(setUserInfo({ ...userInfo, [name]: value }));
    };

    return (
        <Grid container alignItems="center">
            <Grid item xs={3} pt={1} pb={1}>
                <Typography variant="h5" fontWeight="normal" sx={{ fontSize: '1.6rem' }}>
                    {label}:
                </Typography>
            </Grid>
            <Grid item xs={9}>
                <Typography variant="h5" fontWeight="bold" sx={{ fontSize: '1.6rem' }}>
                    {value}
                </Typography>
            </Grid>
        </Grid>
    );
}

export default UserInfoItem;
