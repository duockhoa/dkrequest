import { Stack, Typography, TextField, Select, MenuItem } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { setRequestFormData } from '../../../redux/slice/requestFormDataSlice';
import { differenceInHours, differenceInDays } from 'date-fns';
import { clearErrors } from '../../../redux/slice/requestFormDataSlice';
function TaskRequestForm() {
    const dispatch = useDispatch();
    const requestFormData = useSelector((state) => state.requestFormData.value);
    const errors = useSelector((state) => state.requestFormData.errors);

    const handleChange = (event) => {
        const { name, value } = event.target;
        dispatch(
            setRequestFormData({
                ...requestFormData,
                task_registration: {
                    ...requestFormData.task_registration,
                    [name]: value,
                },
            }),
        );
        // Clear error if validation passes
        dispatch(clearErrors());
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

    const hourOptions = [
        '0.5 giờ',
        '1.0 giờ',
        '1.5 giờ',
        '2.0 giờ',
        '2.5 giờ',
        '3.0 giờ',
        '3.5 giờ',
        '4.0 giờ',
        '4.5 giờ',
        '5.0 giờ',
        '5.5 giờ',
        '6.0 giờ',
        '6.5 giờ',
        '7.0 giờ',
        '7.5 giờ',
        '8.0 giờ',
        '1.0 ngày',
        '1.5 ngày',
        '2.0 ngày',
        '2.5 ngày',
        '3.0 ngày',
        '3.5 ngày',
        '4.0 ngày',
        '4.5 ngày',
        '5.0 ngày',
        '5.5 ngày',
        '6.0 ngày',
        '6.5 ngày',
        '7.0 ngày',
        'trên 7.0 ngày',
    ];

    const getAvailableOptions = (start, end) => {
        if (!start || !end) return hourOptions;

        const startDate = new Date(start);
        const endDate = new Date(end);
        const hoursDiff = differenceInHours(endDate, startDate);
        const daysDiff = differenceInDays(endDate, startDate);

        return hourOptions.filter((option) => {
            const value = parseFloat(option.split(' ')[0]);
            const unit = option.split(' ')[1];

            if (unit === 'ngày') {
                return value <= daysDiff + 1;
            } else {
                return value <= hoursDiff;
            }
        });
    };

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
                <Typography sx={{ minWidth: 120, fontSize: '1.4rem' }}>Thời gian vắng mặt: (*)</Typography>
                <Select
                    fullWidth
                    name="hours"
                    value={requestFormData?.task_registration?.hours || ''}
                    onChange={handleChange}
                    size="medium"
                    sx={{ fontSize: '1.4rem' }}
                    error={!!errors?.hours}
                >
                    {getAvailableOptions(
                        requestFormData?.task_registration?.start_time,
                        requestFormData?.task_registration?.end_time,
                    ).map((option) => (
                        <MenuItem key={option} value={option} sx={{ fontSize: '1.4rem' }}>
                            {option}
                        </MenuItem>
                    ))}
                </Select>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={2}>
                <Typography sx={{ minWidth: 120, fontSize: '1.4rem' }}>Lý do vắng mặt:(*)</Typography>
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
