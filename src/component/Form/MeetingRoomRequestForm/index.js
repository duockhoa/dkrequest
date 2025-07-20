import { Stack, Typography, TextField, Select, MenuItem, Chip, Box, Autocomplete } from '@mui/material';
import { TimeField } from '@mui/x-date-pickers/TimeField';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useSelector, useDispatch } from 'react-redux';
import { setRequestFormData, clearErrors } from '../../../redux/slice/requestFormDataSlice';
import dayjs from 'dayjs';

function MeetingRoomRequestForm() {
    const dispatch = useDispatch();
    const requestFormData = useSelector((state) => state.requestFormData.value);
    const errors = useSelector((state) => state.requestFormData.errors);

    const handleChange = (event) => {
        dispatch(clearErrors());
        const { name, value } = event.target;

        dispatch(
            setRequestFormData({
                ...requestFormData,
                meeting_room_request: {
                    ...requestFormData.meeting_room_request,
                    [name]: value,
                },
            }),
        );
    };

    // Handler riêng cho equipment với multiple selection
    const handleEquipmentChange = (event) => {
        dispatch(clearErrors());
        const { value } = event.target;

        dispatch(
            setRequestFormData({
                ...requestFormData,
                meeting_room_request: {
                    ...requestFormData.meeting_room_request,
                    equipment_requirements: typeof value === 'string' ? value.split(',') : value,
                },
            }),
        );
    };

    // Handler cho TimeField
    const handleTimeFieldChange = (name, newValue) => {
        dispatch(clearErrors());

        // Convert dayjs object to time string (HH:mm)
        const timeString = newValue && newValue.isValid() ? newValue.format('HH:mm') : '';

        dispatch(
            setRequestFormData({
                ...requestFormData,
                meeting_room_request: {
                    ...requestFormData.meeting_room_request,
                    [name]: timeString,
                },
            }),
        );
    };

    // Handler cho Autocomplete location
    const handleLocationChange = (event, newValue) => {
        dispatch(clearErrors());

        dispatch(
            setRequestFormData({
                ...requestFormData,
                meeting_room_request: {
                    ...requestFormData.meeting_room_request,
                    location: newValue || '',
                },
            }),
        );
    };

    // Handler cho Autocomplete room name
    const handleRoomNameChange = (event, newValue) => {
        dispatch(clearErrors());

        dispatch(
            setRequestFormData({
                ...requestFormData,
                meeting_room_request: {
                    ...requestFormData.meeting_room_request,
                    room_name: newValue || '',
                },
            }),
        );
    };

    // Handler cho Autocomplete purpose
    const handlePurposeChange = (event, newValue) => {
        dispatch(clearErrors());

        dispatch(
            setRequestFormData({
                ...requestFormData,
                meeting_room_request: {
                    ...requestFormData.meeting_room_request,
                    purpose: newValue || '',
                },
            }),
        );
    };

    const locations = ['Văn Phòng Hà Nội', 'Nhà Máy Bắc Ninh'];

    const roomNames = [
        'Phòng khách VP',
        'Phòng họp VP',
        'Phòng họp tầng 1 BN',
        'Phòng họp tầng 1 BN',
        'Hội trường tầng 3 BN',
    ];

    const purposeOptions = ['Họp nội bộ', 'Họp đối tác', 'Tiếp khách', 'Phỏng vấn'];

    const equipmentOptions = ['Máy chiếu', 'Micro', 'Loa', 'Bảng viết', 'Laptop', 'Máy in', 'Điều hòa', 'Không cần'];

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Stack spacing={2}>
                <Stack direction="row" alignItems="center" spacing={2}>
                    <Typography sx={{ minWidth: 120, fontSize: '1.4rem' }}>Ngày sử dụng: (*)</Typography>
                    <TextField
                        fullWidth
                        name="usage_date"
                        type="date"
                        value={requestFormData?.meeting_room_request?.usage_date || ''}
                        onChange={handleChange}
                        size="medium"
                        inputProps={{
                            style: { fontSize: '1.4rem' },
                            min: dayjs().format('YYYY-MM-DD'),
                        }}
                        error={!!errors?.usage_date}
                        helperText={errors?.usage_date || ''}
                    />
                </Stack>

                <Stack direction="row" alignItems="center" spacing={2}>
                    <Typography sx={{ minWidth: 120, fontSize: '1.4rem' }}>Thời gian bắt đầu: (*)</Typography>
                    <TimeField
                        value={
                            requestFormData?.meeting_room_request?.start_time
                                ? dayjs(requestFormData.meeting_room_request.start_time, 'HH:mm')
                                : null
                        }
                        onChange={(newValue) => handleTimeFieldChange('start_time', newValue)}
                        fullWidth
                        size="medium"
                        format="HH:mm"
                        sx={{
                            '& .MuiInputBase-input': {
                                fontSize: '1.4rem',
                            },
                        }}
                        error={!!errors?.start_time}
                        helperText={errors?.start_time || ''}
                    />
                </Stack>

                <Stack direction="row" alignItems="center" spacing={2}>
                    <Typography sx={{ minWidth: 120, fontSize: '1.4rem' }}>Thời gian kết thúc: (*)</Typography>
                    <TimeField
                        value={
                            requestFormData?.meeting_room_request?.end_time
                                ? dayjs(requestFormData.meeting_room_request.end_time, 'HH:mm')
                                : null
                        }
                        onChange={(newValue) => handleTimeFieldChange('end_time', newValue)}
                        fullWidth
                        size="medium"
                        format="HH:mm"
                        sx={{
                            '& .MuiInputBase-input': {
                                fontSize: '1.4rem',
                            },
                        }}
                        error={!!errors?.end_time}
                        helperText={errors?.end_time || ''}
                    />
                </Stack>

                <Stack direction="row" alignItems="center" spacing={2}>
                    <Typography sx={{ minWidth: 120, fontSize: '1.4rem' }}>Vị trí: (*)</Typography>
                    <Autocomplete
                        freeSolo
                        options={locations}
                        value={requestFormData?.meeting_room_request?.location || ''}
                        onChange={handleLocationChange}
                        onInputChange={handleLocationChange}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                size="medium"
                                inputProps={{
                                    ...params.inputProps,
                                    style: { fontSize: '1.4rem' },
                                }}
                                error={!!errors?.location}
                                helperText={errors?.location || ''}
                            />
                        )}
                        sx={{
                            width: '100%',
                            '& .MuiAutocomplete-option': {
                                fontSize: '1.4rem',
                            },
                        }}
                    />
                </Stack>

                <Stack direction="row" alignItems="center" spacing={2}>
                    <Typography sx={{ minWidth: 120, fontSize: '1.4rem' }}>Tên phòng:</Typography>
                    <Autocomplete
                        freeSolo
                        options={roomNames}
                        value={requestFormData?.meeting_room_request?.room_name || ''}
                        onChange={handleRoomNameChange}
                        onInputChange={handleRoomNameChange}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                size="medium"
                                inputProps={{
                                    ...params.inputProps,
                                    style: { fontSize: '1.4rem' },
                                }}
                                error={!!errors?.room_name}
                                helperText={errors?.room_name || ''}
                            />
                        )}
                        sx={{
                            width: '100%',
                            '& .MuiAutocomplete-option': {
                                fontSize: '1.4rem',
                            },
                        }}
                    />
                </Stack>

                <Stack direction="row" alignItems="center" spacing={2}>
                    <Typography sx={{ minWidth: 120, fontSize: '1.4rem' }}>Mục đích: (*)</Typography>
                    <Autocomplete
                        freeSolo
                        options={purposeOptions}
                        value={requestFormData?.meeting_room_request?.purpose || ''}
                        onChange={handlePurposeChange}
                        onInputChange={handlePurposeChange}
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
                        sx={{
                            width: '100%',
                            '& .MuiAutocomplete-option': {
                                fontSize: '1.4rem',
                            },
                        }}
                    />
                </Stack>

                <Stack direction="row" alignItems="center" spacing={2}>
                    <Typography sx={{ minWidth: 120, fontSize: '1.4rem' }}>Số người tham gia: (*)</Typography>
                    <TextField
                        fullWidth
                        name="participant_count"
                        type="number"
                        value={requestFormData?.meeting_room_request?.participant_count || ''}
                        onChange={handleChange}
                        size="medium"
                        inputProps={{
                            style: { fontSize: '1.4rem' },
                            min: 1,
                            max: 100,
                        }}
                        error={!!errors?.participant_count}
                        helperText={errors?.participant_count || ''}
                    />
                </Stack>

                <Stack direction="row" alignItems="center" spacing={2}>
                    <Typography sx={{ minWidth: 120, fontSize: '1.4rem' }}>Yêu cầu thiết bị:</Typography>
                    <Select
                        fullWidth
                        multiple
                        name="equipment_requirements"
                        value={requestFormData?.meeting_room_request?.equipment_requirements || []}
                        onChange={handleEquipmentChange}
                        size="medium"
                        sx={{ fontSize: '1.4rem' }}
                        error={!!errors?.equipment_requirements}
                        renderValue={(selected) => (
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                {selected.map((value) => (
                                    <Chip
                                        key={value}
                                        label={value}
                                        size="small"
                                        sx={{
                                            fontSize: '1.2rem',
                                            height: '24px',
                                            backgroundColor: '#e3f2fd',
                                            color: '#1976d2',
                                        }}
                                    />
                                ))}
                            </Box>
                        )}
                        MenuProps={{
                            PaperProps: {
                                style: {
                                    maxHeight: 224,
                                    width: 250,
                                },
                            },
                        }}
                    >
                        {equipmentOptions.map((equipment) => (
                            <MenuItem key={equipment} value={equipment} sx={{ fontSize: '1.4rem' }}>
                                {equipment}
                            </MenuItem>
                        ))}
                    </Select>
                </Stack>

                <Stack direction="row" alignItems="flex-start" spacing={2}>
                    <Typography sx={{ minWidth: 120, fontSize: '1.4rem', mt: 1 }}>Ghi chú thêm:</Typography>
                    <TextField
                        fullWidth
                        name="additional_notes"
                        multiline
                        minRows={1}
                        maxRows={4}
                        value={requestFormData?.meeting_room_request?.additional_notes || ''}
                        onChange={handleChange}
                        size="medium"
                        inputProps={{ style: { fontSize: '1.4rem' } }}
                        error={!!errors?.additional_notes}
                        helperText={errors?.additional_notes || ''}
                    />
                </Stack>
            </Stack>
        </LocalizationProvider>
    );
}

export default MeetingRoomRequestForm;
