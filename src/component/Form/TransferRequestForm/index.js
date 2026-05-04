import { Stack, Typography, TextField } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { setRequestFormData, clearErrors } from '../../../redux/slice/requestFormDataSlice';

const labelSx = { minWidth: 150, fontSize: '1.4rem' };
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
                transferRequest: {
                    ...requestFormData.transferRequest,
                    [name]: value,
                },
            }),
        );
    };

    const transferRequest = requestFormData?.transferRequest || {};

    return (
        <Stack spacing={2}>
            <Stack direction="row" alignItems="center" spacing={2}>
                <Typography sx={labelSx}>Nhân viên: (*)</Typography>
                <TextField
                    fullWidth
                    name="employee_name"
                    value={transferRequest.employee_name || ''}
                    onChange={handleChange}
                    size="medium"
                    inputProps={{ style: { fontSize: '1.4rem' } }}
                    error={!!errors?.employee_name}
                    helperText={errors?.employee_name || ''}
                />
            </Stack>

            <Stack direction="row" alignItems="center" spacing={2}>
                <Typography sx={labelSx}>Ngày vào làm:</Typography>
                <TextField
                    fullWidth
                    name="joined_date"
                    type="date"
                    value={transferRequest.joined_date || ''}
                    onChange={handleChange}
                    size="medium"
                    inputProps={{ style: { fontSize: '1.4rem' } }}
                    InputLabelProps={{ shrink: true }}
                    error={!!errors?.joined_date}
                    helperText={errors?.joined_date || ''}
                />
            </Stack>

            <Stack direction="row" alignItems="center" spacing={2}>
                <Typography sx={labelSx}>Chức danh hiện tại: (*)</Typography>
                <TextField
                    fullWidth
                    name="current_position"
                    value={transferRequest.current_position || ''}
                    onChange={handleChange}
                    size="medium"
                    inputProps={{ style: { fontSize: '1.4rem' } }}
                    error={!!errors?.current_position}
                    helperText={errors?.current_position || ''}
                />
            </Stack>

            <Stack direction="row" alignItems="center" spacing={2}>
                <Typography sx={labelSx}>Phòng/ban hiện tại: (*)</Typography>
                <TextField
                    fullWidth
                    name="from_department"
                    value={transferRequest.from_department || ''}
                    onChange={handleChange}
                    size="medium"
                    inputProps={{ style: { fontSize: '1.4rem' } }}
                    error={!!errors?.from_department}
                    helperText={errors?.from_department || ''}
                />
            </Stack>

            <Stack direction="row" alignItems="center" spacing={2}>
                <Typography sx={labelSx}>Chức danh điều chuyển: (*)</Typography>
                <TextField
                    fullWidth
                    name="transfer_position"
                    value={transferRequest.transfer_position || ''}
                    onChange={handleChange}
                    size="medium"
                    inputProps={{ style: { fontSize: '1.4rem' } }}
                    error={!!errors?.transfer_position}
                    helperText={errors?.transfer_position || ''}
                />
            </Stack>

            <Stack direction="row" alignItems="center" spacing={2}>
                <Typography sx={labelSx}>Thời gian điều chuyển: (*)</Typography>
                <TextField
                    fullWidth
                    name="transfer_time"
                    type="date"
                    value={transferRequest.transfer_time || ''}
                    onChange={handleChange}
                    size="medium"
                    inputProps={{ style: { fontSize: '1.4rem' } }}
                    InputLabelProps={{ shrink: true }}
                    error={!!errors?.transfer_time}
                    helperText={errors?.transfer_time || ''}
                />
            </Stack>

            <Stack direction="row" alignItems="flex-start" spacing={2}>
                <Typography sx={multilineLabelSx}>Lý do điều chuyển: (*)</Typography>
                <TextField
                    fullWidth
                    name="transfer_reason"
                    multiline
                    minRows={3}
                    value={transferRequest.transfer_reason || ''}
                    onChange={handleChange}
                    size="medium"
                    inputProps={{ style: { fontSize: '1.4rem' } }}
                    error={!!errors?.transfer_reason}
                    helperText={errors?.transfer_reason || ''}
                />
            </Stack>
        </Stack>
    );
}

export default TransferRequestForm;
