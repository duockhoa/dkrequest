import { Stack, Typography, TextField, Autocomplete } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { setRequestFormData, clearErrors } from '../../../redux/slice/requestFormDataSlice';

function NotarizationRequetsForm() {
    const dispatch = useDispatch();
    const requestFormData = useSelector((state) => state.requestFormData.value);
    const errors = useSelector((state) => state.requestFormData.errors);

    // Handler cho Autocomplete
    const handleAutoChange = (field) => (event, newValue) => {
        dispatch(clearErrors());
        dispatch(
            setRequestFormData({
                ...requestFormData,
                notarization_request: {
                    ...requestFormData.notarization_request,
                    [field]: newValue || '',
                },
            }),
        );
    };

    const handleInputAutoChange = (field) => (event, newInputValue) => {
        dispatch(clearErrors());
        dispatch(
            setRequestFormData({
                ...requestFormData,
                notarization_request: {
                    ...requestFormData.notarization_request,
                    [field]: newInputValue,
                },
            }),
        );
    };

    // Options
    const documentTypes = [
        'Sao y nội bộ',
        "Công chứng cơ quan có thẩm quyền"
    ];
    const purposes = ['Ban hành nội bộ', 'Đối tác yêu cầu', 'Nộp cơ quan nhà nước'];

    return (
        <Stack spacing={2}>

            {/* Loại văn bản */}
            <Stack direction="row" alignItems="center" spacing={2}>
                <Typography sx={{ width: 150, fontSize: '1.4rem' }}>Loại đề nghị: (*)</Typography>
                <Autocomplete
                    freeSolo
                    options={documentTypes}
                    value={requestFormData?.notarization_request?.document_type || ''}
                    inputValue={requestFormData?.notarization_request?.document_type || ''}
                    onInputChange={handleInputAutoChange('document_type')}
                    onChange={handleAutoChange('document_type')}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            size="medium"
                            inputProps={{
                                ...params.inputProps,
                                style: { fontSize: '1.4rem' },
                            }}
                            error={!!errors?.document_type}
                            helperText={errors?.document_type || ''}
                        />
                    )}
                    sx={{ width: '100%' }}
                />
            </Stack>
            {/* Tên văn bản */}
            <Stack direction="row" alignItems="center" spacing={2}>
                <Typography sx={{ width: 150, fontSize: '1.4rem' }}>Số công văn:</Typography>
                <TextField
                    fullWidth
                    name="official_number"
                    value={requestFormData?.notarization_request?.official_number || ''}
                    onChange={(e) => handleAutoChange('official_number')(null, e.target.value)}
                    size="medium"
                    inputProps={{ style: { fontSize: '1.4rem' } }}
                    error={!!errors?.official_number}
                    helperText={errors?.official_number || ''}
                />
            </Stack>

            {/* Tên văn bản */}
            <Stack direction="row" alignItems="center" spacing={2}>
                <Typography sx={{ width: 150, fontSize: '1.4rem' }}>Tên văn bản/Tóm tắt nội dung(*):</Typography>
                <TextField
                    fullWidth
                    name="document_name"
                    value={requestFormData?.notarization_request?.document_name || ''}
                    onChange={(e) => handleAutoChange('document_name')(null, e.target.value)}
                    size="medium"
                    inputProps={{ style: { fontSize: '1.4rem' } }}
                    error={!!errors?.document_name}
                    helperText={errors?.document_name || ''}
                />
            </Stack>
            {/* Số bản sao */}
            <Stack direction="row" alignItems="center" spacing={2}>
                <Typography sx={{ width: 150, fontSize: '1.4rem' }}>Số bản sao(*):</Typography>
                <TextField
                    fullWidth
                    name="copies"
                    type="number"
                    value={requestFormData?.notarization_request?.copies}
                    onChange={(e) => handleAutoChange('copies')(null, e.target.value)}
                    size="medium"
                    inputProps={{ style: { fontSize: '1.4rem' }, min: 1 }}
                    error={!!errors?.copies}
                    helperText={errors?.copies || ''}
                />
            </Stack>

            {/* Ngày ban hành */}
            <Stack direction="row" alignItems="center" spacing={2}>
                <Typography sx={{ width: 150, fontSize: '1.4rem' }}>Thời gian cần: (*)</Typography>
                <TextField
                    fullWidth
                    name="required_time"
                    type="datetime-local"
                    value={requestFormData?.notarization_request?.required_time || ''}
                    onChange={(e) => handleAutoChange('required_time')(null, e.target.value)}
                    size="medium"
                    inputProps={{ style: { fontSize: '1.4rem' } }}
                    error={!!errors?.required_time}
                    helperText={errors?.required_time || ''}
                />
            </Stack>



            {/* Mục đích sử dụng */}
            <Stack direction="row" alignItems="center" spacing={2}>
                <Typography sx={{ width: 150, fontSize: '1.4rem' }}>Mục đích sử dụng(*):</Typography>
                <TextField
                    fullWidth
                    name="purpose"
                    value={requestFormData?.notarization_request?.purpose || ''}
                    onChange={(e) => handleAutoChange('purpose')(null, e.target.value)}
                    size="medium"
                    inputProps={{ style: { fontSize: '1.4rem' } }}
                    error={!!errors?.purpose}
                    helperText={errors?.purpose || ''}
                />
            </Stack>

            {/* Yêu cầu khác */}
            <Stack direction="row" alignItems="flex-start" spacing={2}>
                <Typography sx={{ width: 150, fontSize: '1.4rem', mt: 1 }}>Yêu cầu khác:</Typography>
                <TextField
                    fullWidth
                    name="other_requirements"
                    multiline
                    minRows={1}
                    maxRows={4}
                    value={requestFormData?.notarization_request?.other_requirements || ''}
                    onChange={(e) => handleAutoChange('other_requirements')(null, e.target.value)}
                    size="medium"
                    inputProps={{ style: { fontSize: '1.4rem' } }}
                    error={!!errors?.other_requirements}
                    helperText={errors?.other_requirements || ''}
                />
            </Stack>
        </Stack>
    );
}

export default NotarizationRequetsForm;
