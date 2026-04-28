import { Stack, Typography, TextField } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { setRequestFormData, clearErrors } from '../../../redux/slice/requestFormDataSlice';

const labelSx = { minWidth: 120, fontSize: '1.4rem' };
const multilineLabelSx = { ...labelSx, mt: 1 };

function ResignationRequestForm() {
    const dispatch = useDispatch();
    const requestFormData = useSelector((state) => state.requestFormData.value);
    const errors = useSelector((state) => state.requestFormData.errors);

    const handleChange = (event) => {
        dispatch(clearErrors());
        const { name, value } = event.target;

        dispatch(
            setRequestFormData({
                ...requestFormData,
                resignation_request: {
                    ...requestFormData.resignation_request,
                    [name]: value,
                },
            }),
        );
    };

    return (
        <Stack spacing={2}>
            <Stack direction="row" alignItems="center" spacing={2}>
                <Typography sx={labelSx}>Ngày nghỉ việc: (*)</Typography>
                <TextField
                    fullWidth
                    name="last_working_date"
                    type="date"
                    value={requestFormData?.resignation_request?.last_working_date || ''}
                    onChange={handleChange}
                    size="medium"
                    inputProps={{ style: { fontSize: '1.4rem' } }}
                    InputLabelProps={{ shrink: true }}
                    error={!!errors?.last_working_date}
                    helperText={errors?.last_working_date || ''}
                />
            </Stack>

            <Stack direction="row" alignItems="flex-start" spacing={2}>
                <Typography sx={multilineLabelSx}>Lý do xin thôi việc: (*)</Typography>
                <TextField
                    fullWidth
                    name="resignation_reason"
                    multiline
                    minRows={3}
                    value={requestFormData?.resignation_request?.resignation_reason || ''}
                    onChange={handleChange}
                    size="medium"
                    inputProps={{ style: { fontSize: '1.4rem' } }}
                    error={!!errors?.resignation_reason}
                    helperText={errors?.resignation_reason || ''}
                />
            </Stack>

            <Stack direction="row" alignItems="flex-start" spacing={2}>
                <Typography sx={multilineLabelSx}>Công việc bàn giao:</Typography>
                <TextField
                    fullWidth
                    name="handover_details"
                    multiline
                    minRows={2}
                    value={requestFormData?.resignation_request?.handover_details || ''}
                    onChange={handleChange}
                    size="medium"
                    inputProps={{ style: { fontSize: '1.4rem' } }}
                    error={!!errors?.handover_details}
                    helperText={errors?.handover_details || ''}
                />
            </Stack>
        </Stack>
    );
}

export default ResignationRequestForm;
