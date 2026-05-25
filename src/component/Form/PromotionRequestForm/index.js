import { Stack, Typography, TextField } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { setRequestFormData, clearErrors } from '../../../redux/slice/requestFormDataSlice';

const labelSx = { minWidth: 120, fontSize: '1.4rem' };
const multilineLabelSx = { ...labelSx, mt: 1 };

function PromotionRequestForm() {
    const dispatch = useDispatch();
    const requestFormData = useSelector((state) => state.requestFormData.value);
    const errors = useSelector((state) => state.requestFormData.errors);

    const handleChange = (event) => {
        dispatch(clearErrors());
        const { name, value } = event.target;

        dispatch(
            setRequestFormData({
                ...requestFormData,
                promotionRequest: {
                    ...requestFormData.promotionRequest,
                    [name]: value,
                },
            }),
        );
    };

    const promotionRequest = requestFormData?.promotionRequest || {};

    return (
        <Stack spacing={2}>
            <Stack direction="row" alignItems="center" spacing={2}>
                <Typography sx={labelSx}>Người được bổ nhiệm: (*)</Typography>
                <TextField
                    fullWidth
                    name="promoted_employee_name"
                    value={promotionRequest.promoted_employee_name || ''}
                    onChange={handleChange}
                    size="medium"
                    inputProps={{ style: { fontSize: '1.4rem' } }}
                    error={!!errors?.promoted_employee_name}
                    helperText={errors?.promoted_employee_name || ''}
                />
            </Stack>

            <Stack direction="row" alignItems="center" spacing={2}>
                <Typography sx={labelSx}>Chức danh hiện tại: (*)</Typography>
                <TextField
                    fullWidth
                    name="current_position"
                    value={promotionRequest.current_position || ''}
                    onChange={handleChange}
                    size="medium"
                    inputProps={{ style: { fontSize: '1.4rem' } }}
                    error={!!errors?.current_position}
                    helperText={errors?.current_position || ''}
                />
            </Stack>

            <Stack direction="row" alignItems="center" spacing={2}>
                <Typography sx={labelSx}>Số tháng giữ chức:</Typography>
                <TextField
                    fullWidth
                    name="current_position_months"
                    type="number"
                    value={promotionRequest.current_position_months || ''}
                    onChange={handleChange}
                    size="medium"
                    inputProps={{ style: { fontSize: '1.4rem' } }}
                    error={!!errors?.current_position_months}
                    helperText={errors?.current_position_months || ''}
                />
            </Stack>

            <Stack direction="row" alignItems="center" spacing={2}>
                <Typography sx={labelSx}>Số năm giữ chức:</Typography>
                <TextField
                    fullWidth
                    name="current_position_years"
                    type="number"
                    value={promotionRequest.current_position_years || ''}
                    onChange={handleChange}
                    size="medium"
                    inputProps={{ style: { fontSize: '1.4rem' } }}
                    error={!!errors?.current_position_years}
                    helperText={errors?.current_position_years || ''}
                />
            </Stack>

            <Stack direction="row" alignItems="center" spacing={2}>
                <Typography sx={labelSx}>Từ ngày:</Typography>
                <TextField
                    fullWidth
                    name="current_position_from_date"
                    type="date"
                    value={promotionRequest.current_position_from_date || ''}
                    onChange={handleChange}
                    size="medium"
                    inputProps={{ style: { fontSize: '1.4rem' } }}
                    InputLabelProps={{ shrink: true }}
                    error={!!errors?.current_position_from_date}
                    helperText={errors?.current_position_from_date || ''}
                />
            </Stack>

            <Stack direction="row" alignItems="center" spacing={2}>
                <Typography sx={labelSx}>Đến ngày:</Typography>
                <TextField
                    fullWidth
                    name="current_position_to_date"
                    type="date"
                    value={promotionRequest.current_position_to_date || ''}
                    onChange={handleChange}
                    size="medium"
                    inputProps={{ style: { fontSize: '1.4rem' } }}
                    InputLabelProps={{ shrink: true }}
                    error={!!errors?.current_position_to_date}
                    helperText={errors?.current_position_to_date || ''}
                />
            </Stack>

            <Stack direction="row" alignItems="center" spacing={2}>
                <Typography sx={labelSx}>Chức danh bổ nhiệm: (*)</Typography>
                <TextField
                    fullWidth
                    name="promoted_position"
                    value={promotionRequest.promoted_position || ''}
                    onChange={handleChange}
                    size="medium"
                    inputProps={{ style: { fontSize: '1.4rem' } }}
                    error={!!errors?.promoted_position}
                    helperText={errors?.promoted_position || ''}
                />
            </Stack>

            <Stack direction="row" alignItems="flex-start" spacing={2}>
                <Typography sx={multilineLabelSx}>Lý do bổ nhiệm: (*)</Typography>
                <TextField
                    fullWidth
                    name="promotion_reason"
                    multiline
                    minRows={3}
                    value={promotionRequest.promotion_reason || ''}
                    onChange={handleChange}
                    size="medium"
                    inputProps={{ style: { fontSize: '1.4rem' } }}
                    error={!!errors?.promotion_reason}
                    helperText={errors?.promotion_reason || ''}
                />
            </Stack>

            <Stack direction="row" alignItems="center" spacing={2}>
                <Typography sx={labelSx}>Thời hạn bổ nhiệm:</Typography>
                <TextField
                    fullWidth
                    name="promotion_duration"
                    value={promotionRequest.promotion_duration || ''}
                    onChange={handleChange}
                    size="medium"
                    inputProps={{ style: { fontSize: '1.4rem' } }}
                    error={!!errors?.promotion_duration}
                    helperText={errors?.promotion_duration || ''}
                />
            </Stack>
        </Stack>
    );
}

export default PromotionRequestForm;
