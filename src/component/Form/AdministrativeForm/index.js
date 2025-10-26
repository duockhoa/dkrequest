import { Stack, Typography, TextField, Select, MenuItem } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { setRequestFormData } from '../../../redux/slice/requestFormDataSlice';
import { clearErrors } from '../../../redux/slice/requestFormDataSlice';
import { convertTimeTextToHours, generateHourOptions } from '../../../utils/timeCalculator';
import { useMemo } from 'react';
function AdministrativeForm() {
    const dispatch = useDispatch();
    const requestFormData = useSelector((state) => state.requestFormData.value);
    const errors = useSelector((state) => state.requestFormData.errors);

    const handleChange = (event) => {
        dispatch(clearErrors());
        const { name, value } = event.target;
        dispatch(
            setRequestFormData({
                ...requestFormData,
                administrative_request: {
                    ...requestFormData.administrative_request,
                    [name]: value, // Update the specific field in administrative_request
                },
            }),
        );
    };

    return (
        <>
            <Stack direction="row" alignItems="center" spacing={2}>
                <Typography sx={{ width: 160, fontSize: '1.4rem' }}>Mục đích(*): </Typography>
                <TextField
                    fullWidth
                    name="purpose"
                    value={requestFormData?.administrative_request?.purpose || ''}
                    onChange={handleChange}
                    size="medium"
                    inputProps={{ style: { fontSize: '1.4rem' } }}
                    error={!!errors?.purpose}
                    helperText={errors?.purpose || ''}
                    rows={4}
                    multiline
                />
            </Stack>
            <Stack direction="row" alignItems="center" spacing={2}>
                <Typography sx={{ width: 160, fontSize: '1.4rem' }}>Nội dung chi tiết yêu cầu (*):</Typography>
                <TextField
                    fullWidth
                    name="detailed_content"
                    value={requestFormData?.administrative_request?.detailed_content || ''}
                    onChange={handleChange}
                    size="medium"
                    inputProps={{ style: { fontSize: '1.4rem' } }}
                    error={!!errors?.detailed_content}
                    helperText={errors?.detailed_content || ''}
                    rows={4}
                    multiline
                    placeholder="Số lượng, địa điểm,..."
                />
            </Stack>
            <Stack direction="row" alignItems="center" spacing={2}>
                <Typography sx={{ width: 160, fontSize: '1.4rem' }}>Thời gian mong muốn hoàn thành: (*)</Typography>
                <TextField
                    fullWidth
                    name="completion_time"
                    value={requestFormData?.administrative_request?.completion_time || ''}
                    onChange={handleChange}
                    size="medium"
                    type="datetime-local"
                    inputProps={{ style: { fontSize: '1.4rem' } }}
                    error={!!errors?.completion_time}
                    helperText={errors?.completion_time || ''}
                />
            </Stack>
        </>
    );
}

export default AdministrativeForm;
