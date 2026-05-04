import { Stack, Typography, TextField } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { setRequestFormData, clearErrors } from '../../../redux/slice/requestFormDataSlice';

const labelSx = { minWidth: 150, fontSize: '1.4rem' };
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
                resignationRequest: {
                    ...requestFormData.resignationRequest,
                    [name]: value,
                },
            }),
        );
    };

    const resignationRequest = requestFormData?.resignationRequest || {};

    return (
        <Stack spacing={2}>
            <Stack direction="row" alignItems="center" spacing={2}>
                <Typography sx={labelSx}>Nhân viên: (*)</Typography>
                <TextField
                    fullWidth
                    name="employee_name"
                    value={resignationRequest.employee_name || ''}
                    onChange={handleChange}
                    size="medium"
                    inputProps={{ style: { fontSize: '1.4rem' } }}
                    error={!!errors?.employee_name}
                    helperText={errors?.employee_name || ''}
                />
            </Stack>

            <Stack direction="row" alignItems="center" spacing={2}>
                <Typography sx={labelSx}>Mã nhân viên:</Typography>
                <TextField
                    fullWidth
                    name="employee_code"
                    value={resignationRequest.employee_code || ''}
                    onChange={handleChange}
                    size="medium"
                    inputProps={{ style: { fontSize: '1.4rem' } }}
                    error={!!errors?.employee_code}
                    helperText={errors?.employee_code || ''}
                />
            </Stack>

            <Stack direction="row" alignItems="center" spacing={2}>
                <Typography sx={labelSx}>Phòng/ban: (*)</Typography>
                <TextField
                    fullWidth
                    name="department"
                    value={resignationRequest.department || ''}
                    onChange={handleChange}
                    size="medium"
                    inputProps={{ style: { fontSize: '1.4rem' } }}
                    error={!!errors?.department}
                    helperText={errors?.department || ''}
                />
            </Stack>

            <Stack direction="row" alignItems="center" spacing={2}>
                <Typography sx={labelSx}>Chức danh: (*)</Typography>
                <TextField
                    fullWidth
                    name="position"
                    value={resignationRequest.position || ''}
                    onChange={handleChange}
                    size="medium"
                    inputProps={{ style: { fontSize: '1.4rem' } }}
                    error={!!errors?.position}
                    helperText={errors?.position || ''}
                />
            </Stack>

            <Stack direction="row" alignItems="center" spacing={2}>
                <Typography sx={labelSx}>Ngày vào làm:</Typography>
                <TextField
                    fullWidth
                    name="joined_date"
                    type="date"
                    value={resignationRequest.joined_date || ''}
                    onChange={handleChange}
                    size="medium"
                    inputProps={{ style: { fontSize: '1.4rem' } }}
                    InputLabelProps={{ shrink: true }}
                    error={!!errors?.joined_date}
                    helperText={errors?.joined_date || ''}
                />
            </Stack>

            <Stack direction="row" alignItems="center" spacing={2}>
                <Typography sx={labelSx}>Ngày nghỉ việc: (*)</Typography>
                <TextField
                    fullWidth
                    name="resignation_date"
                    type="date"
                    value={resignationRequest.resignation_date || ''}
                    onChange={handleChange}
                    size="medium"
                    inputProps={{ style: { fontSize: '1.4rem' } }}
                    InputLabelProps={{ shrink: true }}
                    error={!!errors?.resignation_date}
                    helperText={errors?.resignation_date || ''}
                />
            </Stack>

            <Stack direction="row" alignItems="flex-start" spacing={2}>
                <Typography sx={multilineLabelSx}>Lý do xin thôi việc: (*)</Typography>
                <TextField
                    fullWidth
                    name="resignation_reason"
                    multiline
                    minRows={3}
                    value={resignationRequest.resignation_reason || ''}
                    onChange={handleChange}
                    size="medium"
                    inputProps={{ style: { fontSize: '1.4rem' } }}
                    error={!!errors?.resignation_reason}
                    helperText={errors?.resignation_reason || ''}
                />
            </Stack>

            <Stack direction="row" alignItems="center" spacing={2}>
                <Typography sx={labelSx}>Số lượng cổ phần:</Typography>
                <TextField
                    fullWidth
                    name="shares_count"
                    type="number"
                    value={resignationRequest.shares_count || ''}
                    onChange={handleChange}
                    size="medium"
                    inputProps={{ style: { fontSize: '1.4rem' } }}
                    error={!!errors?.shares_count}
                    helperText={errors?.shares_count || ''}
                />
            </Stack>

            <Stack direction="row" alignItems="center" spacing={2}>
                <Typography sx={labelSx}>Giá trị cổ phần:</Typography>
                <TextField
                    fullWidth
                    name="shares_value"
                    value={resignationRequest.shares_value || ''}
                    onChange={handleChange}
                    size="medium"
                    inputProps={{ style: { fontSize: '1.4rem' } }}
                    error={!!errors?.shares_value}
                    helperText={errors?.shares_value || ''}
                />
            </Stack>

            <Stack direction="row" alignItems="flex-start" spacing={2}>
                <Typography sx={multilineLabelSx}>Hình thức hoàn trả:</Typography>
                <TextField
                    fullWidth
                    name="shares_return_method"
                    multiline
                    minRows={2}
                    value={resignationRequest.shares_return_method || ''}
                    onChange={handleChange}
                    size="medium"
                    inputProps={{ style: { fontSize: '1.4rem' } }}
                    error={!!errors?.shares_return_method}
                    helperText={errors?.shares_return_method || ''}
                />
            </Stack>

            <Stack direction="row" alignItems="flex-start" spacing={2}>
                <Typography sx={multilineLabelSx}>Đề nghị khác:</Typography>
                <TextField
                    fullWidth
                    name="other_request"
                    multiline
                    minRows={2}
                    value={resignationRequest.other_request || ''}
                    onChange={handleChange}
                    size="medium"
                    inputProps={{ style: { fontSize: '1.4rem' } }}
                    error={!!errors?.other_request}
                    helperText={errors?.other_request || ''}
                />
            </Stack>
        </Stack>
    );
}

export default ResignationRequestForm;
