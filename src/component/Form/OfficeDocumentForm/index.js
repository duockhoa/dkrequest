import { Stack, Typography, TextField, Autocomplete, Checkbox, FormControlLabel, FormGroup } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { setRequestFormData, clearErrors } from '../../../redux/slice/requestFormDataSlice';
import { Handshake } from '@mui/icons-material';

function OfficeDocumentForm() {
    const dispatch = useDispatch();
    const requestFormData = useSelector((state) => state.requestFormData.value);
    const errors = useSelector((state) => state.requestFormData.errors);

    // Handler cho Autocomplete
    const handleAutoChange = (field) => (event, newValue) => {
        dispatch(clearErrors());
        dispatch(
            setRequestFormData({
                ...requestFormData,
                office_document_request: {
                    ...requestFormData.office_document_request,
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
                office_document_request: {
                    ...requestFormData.office_document_request,
                    [field]: newInputValue,
                },
            }),
        );
    };

    // Options
    const documentTypes = [
        'Quyết định',
        'Công văn',
        'Thông báo',
        'Tờ trình',
        'Văn bản sao y',
        'Hợp đồng',
        'Báo cáo',
        'Hồ sơ',
        'Biên bản',
        'Ủy quyền',
        'Phiếu kiểm nghiệm',
        'Phiếu mua hàng',
    ];
    const purposes = ['Ban hành nội bộ', 'Đối tác yêu cầu', 'Nộp cơ quan nhà nước'];
    const approvedByOptions = ['Văn bản ngoài Công ty', 'Tổng Giám đốc'];
    const sealTypes = ['Dấu tròn Công ty', 'Dấu chức danh', 'Dấu chữ kí', 'Dấu sao y'];

    return (
        <Stack spacing={2}>
            {/* Loại văn bản */}
            <Stack direction="row" alignItems="center" spacing={2}>
                <Typography sx={{ width: 150, fontSize: '1.4rem' }}>Loại văn bản: (*)</Typography>
                <Autocomplete
                    freeSolo
                    options={documentTypes}
                    value={requestFormData?.office_document_request?.document_type || ''}
                    inputValue={requestFormData?.office_document_request?.document_type || ''}
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
                <Typography sx={{ width: 150, fontSize: '1.4rem' }}>Tên văn bản/Tóm tắt nội dung(*):</Typography>
                <TextField
                    fullWidth
                    name="document_name"
                    value={requestFormData?.office_document_request?.document_name || ''}
                    onChange={(e) => handleAutoChange('document_name')(null, e.target.value)}
                    size="medium"
                    inputProps={{ style: { fontSize: '1.4rem' } }}
                    error={!!errors?.document_name}
                    helperText={errors?.document_name || ''}
                />
            </Stack>

            {/* Ngày ban hành */}
            <Stack direction="row" alignItems="center" spacing={2}>
                <Typography sx={{ width: 150, fontSize: '1.4rem' }}>Ngày ban hành: (*)</Typography>
                <TextField
                    fullWidth
                    name="issue_date"
                    type="date"
                    value={requestFormData?.office_document_request?.issue_date || ''}
                    onChange={(e) => handleAutoChange('issue_date')(null, e.target.value)}
                    size="medium"
                    inputProps={{ style: { fontSize: '1.4rem' } }}
                    error={!!errors?.issue_date}
                    helperText={errors?.issue_date || ''}
                />
            </Stack>

            {/* Số bản sao */}
            <Stack direction="row" alignItems="center" spacing={2}>
                <Typography sx={{ width: 150, fontSize: '1.4rem' }}>Số bản đóng dấu/bản sao(*):</Typography>
                <TextField
                    fullWidth
                    name="copy_count"
                    type="number"
                    value={requestFormData?.office_document_request?.copy_count}
                    onChange={(e) => handleAutoChange('copy_count')(null, e.target.value)}
                    size="medium"
                    inputProps={{ style: { fontSize: '1.4rem' }, min: 1 }}
                    error={!!errors?.copy_count}
                    helperText={errors?.copy_count || ''}
                />
            </Stack>

            {/* Mục đích sử dụng */}
            <Stack direction="row" alignItems="center" spacing={2}>
                <Typography sx={{ width: 150, fontSize: '1.4rem' }}>Mục đích sử dụng: (*)</Typography>
                <Autocomplete
                    freeSolo
                    options={purposes}
                    value={requestFormData?.office_document_request?.purpose || ''}
                    inputValue={requestFormData?.office_document_request?.purpose || ''}
                    onInputChange={(event, newInputValue) => {
                        dispatch(clearErrors());
                        dispatch(
                            setRequestFormData({
                                ...requestFormData,
                                office_document_request: {
                                    ...requestFormData.office_document_request,
                                    purpose: newInputValue,
                                },
                            }),
                        );
                    }}
                    onChange={handleAutoChange('purpose')}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            size="medium"
                            inputProps={{
                                ...params.inputProps,
                                style: { fontSize: '1.4rem' },
                            }}
                            error={!!errors?.purpose}
                            helperText={errors?.purpose || ''}
                        />
                    )}
                    sx={{ width: '100%' }}
                />
            </Stack>

            {/* Người ký duyệt */}
            <Stack direction="row" alignItems="center" spacing={2}>
                <Typography sx={{ width: 150, fontSize: '1.4rem' }}>Người ký duyệt: (*)</Typography>
                <Autocomplete
                    freeSolo
                    options={approvedByOptions}
                    value={requestFormData?.office_document_request?.approved_by || ''}
                    inputValue={requestFormData?.office_document_request?.approved_by || ''}
                    onInputChange={handleInputAutoChange('approved_by')}
                    onChange={handleAutoChange('approved_by')}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            size="medium"
                            inputProps={{
                                ...params.inputProps,
                                style: { fontSize: '1.4rem' },
                            }}
                            error={!!errors?.approved_by}
                            helperText={errors?.approved_by || ''}
                        />
                    )}
                    sx={{ width: '100%' }}
                />
            </Stack>

            {/* Loại con dấu sử dụng */}
            <Stack direction="row" alignItems="center" spacing={2}>
                <Typography sx={{ width: 150, fontSize: '1.4rem' }}>Loại con dấu sử dụng: (*)</Typography>
                <Autocomplete
                    multiple
                    freeSolo
                    options={sealTypes}
                    value={requestFormData?.office_document_request?.seal_type || []}
                    inputValue={requestFormData?.office_document_request?.seal_typeInput || ''}
                    onInputChange={handleInputAutoChange('seal_typeInput')}
                    onChange={handleAutoChange('seal_type')}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            size="medium"
                            inputProps={{
                                ...params.inputProps,
                                style: { fontSize: '1.4rem' },
                            }}
                            error={!!errors?.seal_type}
                            helperText={errors?.seal_type || ''}
                        />
                    )}
                    sx={{ width: '100%' }}
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
                    value={requestFormData?.office_document_request?.other_requirements || ''}
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

export default OfficeDocumentForm;
