import { Stack, Typography, TextField, Select, MenuItem } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import FileUpload from '../FileUpload';
import { setRequestFormData, clearErrors } from '../../../redux/slice/requestFormDataSlice';

function OfficeEquipmentRepairForm() {
    const dispatch = useDispatch();
    const requestFormData = useSelector((state) => state.requestFormData.value);
    const errors = useSelector((state) => state.requestFormData.errors);

    // useEffect để init default values
    useEffect(() => {
        if (!requestFormData?.office_equipment_repair) {
            dispatch(
                setRequestFormData({
                    ...requestFormData,
                    office_equipment_repair: {
                        asset_name: '',
                        damage_description: '',
                        damage_location: '',
                        urgency_level: '',
                        detected_at: '',
                        requester_phone: '',
                        proposed_solution: '',
                        note: '',
                    },
                }),
            );
        }
    }, [dispatch, requestFormData]);

    const handleChange = (e) => {
        dispatch(clearErrors());
        const { name, value } = e.target;

        dispatch(
            setRequestFormData({
                ...requestFormData,
                office_equipment_repair: {
                    ...requestFormData.office_equipment_repair,
                    [name]: value,
                },
            }),
        );
    };

    // Options cho các dropdown
    const urgencyLevels = ['Khẩn cấp ( Xử lý ngay)', 'Ảnh hưởng nhẹ ( Xử lý trong 1-5 ngày)', 'Chưa cần gấp'];

    return (
        <Stack spacing={2}>
            <Stack direction="row" alignItems="center" spacing={2}>
                <Typography sx={{ minWidth: 120, fontSize: '1.4rem' }}>Tên tài sản: (*)</Typography>
                <TextField
                    fullWidth
                    name="asset_name"
                    value={requestFormData?.office_equipment_repair?.asset_name || ''}
                    onChange={handleChange}
                    size="medium"
                    inputProps={{ style: { fontSize: '1.4rem' } }}
                    error={!!errors?.asset_name}
                    helperText={errors?.asset_name || ''}
                />
            </Stack>

            <Stack direction="row" alignItems="flex-start" spacing={2}>
                <Typography sx={{ minWidth: 120, fontSize: '1.4rem', mt: 1 }}>Mô tả hư hỏng: (*)</Typography>
                <TextField
                    fullWidth
                    name="damage_description"
                    multiline
                    value={requestFormData?.office_equipment_repair?.damage_description || ''}
                    onChange={handleChange}
                    size="medium"
                    inputProps={{ style: { fontSize: '1.4rem' } }}
                    error={!!errors?.damage_description}
                    helperText={errors?.damage_description || ''}
                />
            </Stack>

            <Stack direction="row" alignItems="center" spacing={2}>
                <Typography sx={{ minWidth: 120, fontSize: '1.4rem' }}>Vị trí hư hỏng: (*)</Typography>
                <TextField
                    fullWidth
                    name="damage_location"
                    value={requestFormData?.office_equipment_repair?.damage_location || ''}
                    onChange={handleChange}
                    size="medium"
                    inputProps={{ style: { fontSize: '1.4rem' } }}
                    error={!!errors?.damage_location}
                    helperText={errors?.damage_location || ''}
                />
            </Stack>
            <FileUpload fieldName="damage_images" label="Hình ảnh ( nếu có)" multiple={true} maxSize={100} />

            <Stack direction="row" alignItems="center" spacing={2}>
                <Typography sx={{ minWidth: 120, fontSize: '1.4rem' }}>Mức độ khẩn cấp: (*)</Typography>
                <Select
                    fullWidth
                    name="urgency_level"
                    value={requestFormData?.office_equipment_repair?.urgency_level || ''}
                    onChange={handleChange}
                    size="medium"
                    sx={{ fontSize: '1.4rem' }}
                    error={!!errors?.urgency_level}
                >
                    {urgencyLevels.map((level) => (
                        <MenuItem key={level} value={level} sx={{ fontSize: '1.4rem' }}>
                            {level}
                        </MenuItem>
                    ))}
                </Select>
            </Stack>

            <Stack direction="row" alignItems="center" spacing={2}>
                <Typography sx={{ minWidth: 120, fontSize: '1.4rem' }}>Thời gian phát hiện: (*)</Typography>
                <TextField
                    fullWidth
                    name="detected_at"
                    type="datetime-local"
                    value={requestFormData?.office_equipment_repair?.detected_at || ''}
                    onChange={handleChange}
                    size="medium"
                    inputProps={{
                        style: { fontSize: '1.4rem' },
                        max: new Date().toISOString().slice(0, 16),
                    }}
                    error={!!errors?.detected_at}
                    helperText={errors?.detected_at || ''}
                />
            </Stack>

            <Stack direction="row" alignItems="center" spacing={2}>
                <Typography sx={{ minWidth: 120, fontSize: '1.4rem' }}>Số điện thoại liên hệ: (*)</Typography>
                <TextField
                    fullWidth
                    name="requester_phone"
                    value={requestFormData?.office_equipment_repair?.requester_phone || ''}
                    onChange={handleChange}
                    size="medium"
                    inputProps={{
                        style: { fontSize: '1.4rem' },
                        pattern: '[0-9]*',
                        maxLength: 11,
                    }}
                    error={!!errors?.requester_phone}
                    helperText={errors?.requester_phone || ''}
                />
            </Stack>

            <Stack direction="row" alignItems="flex-start" spacing={2}>
                <Typography sx={{ minWidth: 120, fontSize: '1.4rem', mt: 1 }}>Giải pháp đề xuất:</Typography>
                <TextField
                    fullWidth
                    name="proposed_solution"
                    multiline
                    value={requestFormData?.office_equipment_repair?.proposed_solution || ''}
                    onChange={handleChange}
                    size="medium"
                    inputProps={{ style: { fontSize: '1.4rem' } }}
                    error={!!errors?.proposed_solution}
                    helperText={errors?.proposed_solution || ''}
                />
            </Stack>
        </Stack>
    );
}

export default OfficeEquipmentRepairForm;
