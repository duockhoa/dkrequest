import { Stack, Typography, TextField, Select, MenuItem } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { setRequestFormData } from '../../../redux/slice/requestFormDataSlice';
import { clearErrors } from '../../../redux/slice/requestFormDataSlice';
function LunchStopForm() {
    const dispatch = useDispatch();
    const requestFormData = useSelector((state) => state.requestFormData.value);
    const errors = useSelector((state) => state.requestFormData.errors);

    const handleChange = (event) => {
        dispatch(clearErrors());
        const { name, value } = event.target;
        dispatch(
            setRequestFormData({
                ...requestFormData,
                lunch_stop_request: {
                    ...requestFormData.lunch_stop_request,
                    [name]: value, // Update the specific field in lunch_stop_request
                },
            }),
        );
    };


    return (
        <>
            <Stack direction="row" alignItems="center" spacing={2}>
                <Typography sx={{ minWidth: 120, fontSize: '1.4rem' }}>Thời gian bắt đầu: (*)</Typography>
                <TextField
                    fullWidth
                    name="from_date"
                    value={requestFormData?.lunch_stop_request?.from_date || ''}
                    onChange={handleChange}
                    size="medium"
                    type="datetime-local"
                    inputProps={{ style: { fontSize: '1.4rem' } }}
                    error={!!errors?.from_date}
                    helperText={errors?.from_date || ''}
                />
            </Stack>
            <Stack direction="row" alignItems="center" spacing={2}>
                <Typography sx={{ minWidth: 120, fontSize: '1.4rem' }}>Thời gian kết thúc: (*)</Typography>
                <TextField
                    fullWidth
                    name="to_date"
                    value={requestFormData?.lunch_stop_request?.to_date || ''}
                    onChange={handleChange}
                    size="medium"
                    type="datetime-local"
                    inputProps={{ style: { fontSize: '1.4rem' } }}
                    error={!!errors?.to_date}
                    helperText={errors?.to_date || ''}
                />
            </Stack>
            <Stack direction="row" alignItems="center" spacing={2}>
                <Typography sx={{ minWidth: 120, fontSize: '1.4rem' }}>Lý do: (*)</Typography>
                <TextField
                    fullWidth
                    name="reason"
                    value={requestFormData?.lunch_stop_request?.reason || ''}
                    onChange={handleChange}
                    size="medium"
                    type="text"
                    inputProps={{ style: { fontSize: '1.4rem' } }}
                    error={!!errors?.reason}
                    helperText={errors?.reason || ''}
                />
            </Stack>
            

        </>
    );
}

export default LunchStopForm;
