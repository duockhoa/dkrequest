import { Stack, Typography, TextField, InputAdornment } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { setRequestFormData, clearErrors } from '../../../redux/slice/requestFormDataSlice';
import { formatNumberWithCommas, parseFormattedNumber } from '../../../utils/numberToWords';

const labelSx = { minWidth: 120, fontSize: '1.4rem' };
const multilineLabelSx = { ...labelSx, mt: 1 };

function PromotionRequestForm() {
    const dispatch = useDispatch();
    const requestFormData = useSelector((state) => state.requestFormData.value);
    const errors = useSelector((state) => state.requestFormData.errors);

    const handleChange = (event) => {
        dispatch(clearErrors());
        const { name, value } = event.target;
        let payload = {
            ...requestFormData.promotion_request,
            [name]: value,
        };

        if (name === 'proposed_salary_text') {
            const formattedValue = formatNumberWithCommas(value);
            payload.proposed_salary_text = formattedValue;
            payload.proposed_salary = parseFormattedNumber(formattedValue);
        }

        dispatch(
            setRequestFormData({
                ...requestFormData,
                promotion_request: payload,
            }),
        );
    };

    return (
        <Stack spacing={2}>
            <Stack direction="row" alignItems="center" spacing={2}>
                <Typography sx={labelSx}>Chức danh hiện tại: (*)</Typography>
                <TextField
                    fullWidth
                    name="current_position"
                    value={requestFormData?.promotion_request?.current_position || ''}
                    onChange={handleChange}
                    size="medium"
                    inputProps={{ style: { fontSize: '1.4rem' } }}
                    error={!!errors?.current_position}
                    helperText={errors?.current_position || ''}
                />
            </Stack>

            <Stack direction="row" alignItems="center" spacing={2}>
                <Typography sx={labelSx}>Chức danh đề xuất: (*)</Typography>
                <TextField
                    fullWidth
                    name="proposed_position"
                    value={requestFormData?.promotion_request?.proposed_position || ''}
                    onChange={handleChange}
                    size="medium"
                    inputProps={{ style: { fontSize: '1.4rem' } }}
                    error={!!errors?.proposed_position}
                    helperText={errors?.proposed_position || ''}
                />
            </Stack>

            <Stack direction="row" alignItems="center" spacing={2}>
                <Typography sx={labelSx}>Ngày có hiệu lực: (*)</Typography>
                <TextField
                    fullWidth
                    name="effective_date"
                    type="date"
                    value={requestFormData?.promotion_request?.effective_date || ''}
                    onChange={handleChange}
                    size="medium"
                    inputProps={{ style: { fontSize: '1.4rem' } }}
                    error={!!errors?.effective_date}
                    helperText={errors?.effective_date || ''}
                    InputLabelProps={{ shrink: true }}
                />
            </Stack>

            <Stack direction="row" alignItems="center" spacing={2}>
                <Typography sx={labelSx}>Mức lương đề xuất:</Typography>
                <TextField
                    fullWidth
                    name="proposed_salary_text"
                    value={requestFormData?.promotion_request?.proposed_salary_text || ''}
                    onChange={handleChange}
                    size="medium"
                    inputProps={{ style: { fontSize: '1.4rem' } }}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <Typography sx={{ fontSize: '1.4rem' }}>VNĐ</Typography>
                            </InputAdornment>
                        ),
                    }}
                    error={!!errors?.proposed_salary_text}
                    helperText={errors?.proposed_salary_text || ''}
                />
            </Stack>

            <Stack direction="row" alignItems="flex-start" spacing={2}>
                <Typography sx={multilineLabelSx}>Lý do đề nghị: (*)</Typography>
                <TextField
                    fullWidth
                    name="reason"
                    multiline
                    minRows={3}
                    value={requestFormData?.promotion_request?.reason || ''}
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

export default PromotionRequestForm;
