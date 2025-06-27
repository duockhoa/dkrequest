import { Stack, Typography } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';

function SupplyStationeryForm() {

     return (
        <Stack spacing={2}>
            <Stack direction="row" alignItems="center" spacing={2}>
                <Typography sx={{ minWidth: 120, fontSize: '1.4rem' }}>Chi tiết hàng hoá</Typography>
            </Stack>
        </Stack>
    );
}

export default SupplyStationeryForm;
