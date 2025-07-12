import { Stack, Typography, TextField, Select, MenuItem } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { setRequestFormData } from '../../../redux/slice/requestFormDataSlice';
import { clearErrors } from '../../../redux/slice/requestFormDataSlice';
import { convertTimeTextToHours, generateHourOptions } from '../../../utils/timeCalculator';
import { useMemo } from 'react';
function TaskRequestForm() {
    const dispatch = useDispatch();
    const requestFormData = useSelector((state) => state.requestFormData.value);
    const errors = useSelector((state) => state.requestFormData.errors);

    const handleChange = (event) => {
        dispatch(clearErrors());
        const { name, value } = event.target;
        if (name === 'hoursText') {
            const totalHours = convertTimeTextToHours(value);
            dispatch(
                setRequestFormData({
                    ...requestFormData,
                    task_registration: {
                        ...requestFormData.task_registration,
                        [name]: value, // Update the specific field in task_registration
                        hours: totalHours, // Update total hours based on selected time text
                    },
                }),
            );
            return;
        }
        dispatch(
            setRequestFormData({
                ...requestFormData,
                task_registration: {
                    ...requestFormData.task_registration,
                    [name]: value, // Update the specific field in task_registration
                },
            }),
        );
    };

    const taskReasons = [
        'Làm từ xa',
        'Công tác',
        'Làm việc tại HN',
        'Làm việc tại BN',
        'Làm việc tại HB',
        'Đào tạo/Học tập',
        'Khác',
    ];

    const hourOptions = useMemo(() => {
        const start = requestFormData?.task_registration?.start_time;
        const end = requestFormData?.task_registration?.end_time;

        if (!start || !end) return [];

        return generateHourOptions(new Date(start), new Date(end));
    }, [requestFormData?.task_registration?.start_time, requestFormData?.task_registration?.end_time]);

    return (
        <>
            <Stack direction="row" alignItems="center" spacing={2}>
                <Typography sx={{ minWidth: 120, fontSize: '1.4rem' }}>Thời gian bắt đầu: (*)</Typography>
                <TextField
                    fullWidth
                    name="start_time"
                    value={requestFormData?.task_registration?.start_time || ''}
                    onChange={handleChange}
                    size="medium"
                    type="datetime-local"
                    inputProps={{ style: { fontSize: '1.4rem' } }}
                    error={!!errors?.start_time}
                    helperText={errors?.start_time || ''}
                />
            </Stack>
            <Stack direction="row" alignItems="center" spacing={2}>
                <Typography sx={{ minWidth: 120, fontSize: '1.4rem' }}>Thời gian kết thúc: (*)</Typography>
                <TextField
                    fullWidth
                    name="end_time"
                    value={requestFormData?.task_registration?.end_time || ''}
                    onChange={handleChange}
                    size="medium"
                    type="datetime-local"
                    inputProps={{ style: { fontSize: '1.4rem' } }}
                    error={!!errors?.end_time}
                    helperText={errors?.end_time || ''}
                />
            </Stack>
            <Stack direction="row" alignItems="center" spacing={2}>
                <Typography sx={{ minWidth: 120, fontSize: '1.4rem' }}>Thời gian xác nhận: (*)</Typography>
                <Select
                    fullWidth
                    name="hoursText"
                    value={requestFormData?.task_registration?.hoursText || ''}
                    onChange={handleChange}
                    size="medium"
                    sx={{ fontSize: '1.4rem' }}
                    error={!!errors?.hoursText}
                >
                    {hourOptions.map((option) => (
                        <MenuItem key={option} value={option} sx={{ fontSize: '1.4rem' }}>
                            {option}
                        </MenuItem>
                    ))}
                </Select>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={2}>
                <Typography sx={{ minWidth: 120, fontSize: '1.4rem' }}>Lý do xác nhận:(*)</Typography>
                <Select
                    fullWidth
                    name="reason"
                    value={requestFormData?.task_registration?.reason || ''}
                    onChange={handleChange}
                    size="medium"
                    sx={{ fontSize: '1.4rem' }}
                    error={!!errors?.reason}
                >
                    {taskReasons.map((reason) => (
                        <MenuItem key={reason} value={reason} sx={{ fontSize: '1.4rem' }}>
                            {reason}
                        </MenuItem>
                    ))}
                </Select>
            </Stack>
        </>
    );
}

export default TaskRequestForm;
