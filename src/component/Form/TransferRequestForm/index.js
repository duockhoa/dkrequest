import { Stack, Typography, TextField } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { setRequestFormData, clearErrors } from '../../../redux/slice/requestFormDataSlice';

const labelSx = { minWidth: 120, fontSize: '1.4rem' };
const multilineLabelSx = { ...labelSx, mt: 1 };

function TransferRequestForm() {
    const dispatch = useDispatch();
    const requestFormData = useSelector((state) => state.requestFormData.value);
    const errors = useSelector((state) => state.requestFormData.errors);

    const handleChange = (event) => {
        dispatch(clearErrors());
        const { name, value } = event.target;

        dispatch(
            setRequestFormData({
                ...requestFormData,
                transfer_request: {
                    ...requestFormData.transfer_request,
                    [name]: value,
                },
            }),
        );
    };

    return (
        <Stack spacing={2}>
            <Stack direction="row" alignItems="center" spacing={2}>
                <Typography sx={labelSx}>Phòng/ban hiện tại: (*)</Typography>
                <TextField
                    fullWidth
                    name="current_department"
                    value={requestFormData?.transfer_request?.current_department || ''}
                    onChange={handleChange}
                    size="medium"
                    inputProps={{ style: { fontSize: '1.4rem' } }}
                    error={!!errors?.current_department}
                    helperText={errors?.current_department || ''}
                />
            </Stack>

            <Stack direction="row" alignItems="center" spacing={2}>
                <Typography sx={labelSx}>Phòng/ban chuyển tới: (*)</Typography>
                <TextField
                    fullWidth
                    name="new_department"
                    value={requestFormData?.transfer_request?.new_department || ''}
                    onChange={handleChange}
                    size="medium"
                    inputProps={{ style: { fontSize: '1.4rem' } }}
                    error={!!errors?.new_department}
                    helperText={errors?.new_department || ''}
                />
            </Stack>

            <Stack direction="row" alignItems="center" spacing={2}>
                <Typography sx={labelSx}>Ngày hiệu lực: (*)</Typography>
                <TextField
                    fullWidth
                    name="effective_date"
                    type="date"
                    value={requestFormData?.transfer_request?.effective_date || ''}
                    onChange={handleChange}
                    size="medium"
                    inputProps={{ style: { fontSize: '1.4rem' } }}
                    InputLabelProps={{ shrink: true }}
                    error={!!errors?.effective_date}
                    helperText={errors?.effective_date || ''}
                />
            </Stack>

            <Stack direction="row" alignItems="flex-start" spacing={2}>
                <Typography sx={multilineLabelSx}>Lý do chuyển: (*)</Typography>
                <TextField
                    fullWidth
                    name="reason"
                    multiline
                    minRows={3}
                    value={requestFormData?.transfer_request?.reason || ''}
                    onChange={handleChange}
                    size="medium"
                    inputProps={{ style: { fontSize: '1.4rem' } }}
                    error={!!errors?.reason}
                    helperText={errors?.reason || ''}
                />
            </Stack>
        </Stack>
    );
}

export default TransferRequestForm;
