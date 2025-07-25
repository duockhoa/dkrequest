import { Stack, Typography, TextField, Select, MenuItem } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { setRequestFormData, clearErrors } from '../../../redux/slice/requestFormDataSlice';

function DocumentEditRequestForm() {
    const dispatch = useDispatch();
    const requestFormData = useSelector((state) => state.requestFormData.value);
    const errors = useSelector((state) => state.requestFormData.errors);

    const editTypes = ['Chỉnh sửa nội dung', 'Biên soạn mới', 'Gia hạn', 'Thu hồi', 'Khác'];

    const handleChange = (event) => {
        dispatch(clearErrors());
        const { name, value } = event.target;
        dispatch(
            setRequestFormData({
                ...requestFormData,
                document_edit_request: {
                    ...requestFormData.document_edit_request,
                    [name]: value,
                },
            }),
        );
    };

    return (
        <>
            <Stack direction="row" alignItems="center" spacing={2}>
                <Typography sx={{ minWidth: 120, maxWidth: 120, fontSize: '1.4rem' }}>Loại yêu cầu: (*)</Typography>
                <Select
                    fullWidth
                    name="type"
                    value={requestFormData?.document_edit_request?.type || ''}
                    onChange={handleChange}
                    size="medium"
                    sx={{ fontSize: '1.4rem' }}
                    error={!!errors?.type}
                >
                    {editTypes.map((type) => (
                        <MenuItem key={type} value={type} sx={{ fontSize: '1.4rem' }}>
                            {type}
                        </MenuItem>
                    ))}
                </Select>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={2}>
                <Typography sx={{ minWidth: 120, maxWidth: 120, fontSize: '1.4rem' }}>Tên tài liệu: (*)</Typography>
                <TextField
                    fullWidth
                    name="document_name"
                    value={requestFormData?.document_edit_request?.document_name || ''}
                    onChange={handleChange}
                    size="medium"
                    inputProps={{ style: { fontSize: '1.4rem' } }}
                    error={!!errors?.document_name}
                    helperText={errors?.document_name || ''}
                />
            </Stack>
            <Stack direction="row" alignItems="center" spacing={2}>
                <Typography sx={{ minWidth: 120, maxWidth: 120, fontSize: '1.4rem' }}>
                    Lý do chỉnh sửa/biên soạn (*)
                </Typography>
                <TextField
                    fullWidth
                    name="reason"
                    value={requestFormData?.document_edit_request?.reason || ''}
                    onChange={handleChange}
                    size="medium"
                    minRows={2}
                    multiline
                    inputProps={{ style: { fontSize: '1.4rem' } }}
                    error={!!errors?.reason}
                    helperText={errors?.reason || ''}
                />
            </Stack>
            <Stack direction="row" alignItems="center" spacing={2}>
                <Typography sx={{ minWidth: 120, maxWidth: 120, fontSize: '1.4rem' }}>Hạn hoàn thành:</Typography>
                <TextField
                    fullWidth
                    name="deadline"
                    type="date"
                    value={requestFormData?.document_edit_request?.deadline || ''}
                    onChange={handleChange}
                    size="medium"
                    InputLabelProps={{ shrink: true }}
                    inputProps={{
                        style: { fontSize: '1.4rem' },
                        min: new Date().toISOString().split('T')[0], // Chỉ cho phép chọn từ hôm nay trở đi
                    }}
                    error={!!errors?.deadline}
                    helperText={errors?.deadline || ''}
                />
            </Stack>
        </>
    );
}

export default DocumentEditRequestForm;
