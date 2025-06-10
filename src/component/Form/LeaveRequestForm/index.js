import { Stack, Typography, TextField, Select, MenuItem } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { setRequestFormData } from '../../../redux/slice/requestFormDataSlice';
import { differenceInHours, differenceInDays } from 'date-fns';
import { useEffect } from 'react';

function LeaveRequestForm() {
    const dispatch = useDispatch();
    const requestFormData = useSelector((state) => state.requestFormData.value);

    const handleChange = (event) => {
        dispatch(
            setRequestFormData({
                ...requestFormData,
                leave_registration: {
                    ...requestFormData.leave_registration,
                    [event.target.name]: event.target.value,
                },
            }),
        );
    };

    const leaveReasons = [
        'Nghỉ phép năm',
        'Nghỉ không hưởng lương',
        'Nghỉ ốm',
        'Nghỉ sinh con',
        'Nghỉ chế độ đám cưới',
        'Nghỉ chế độ đám tang',
        'Nghỉ chế độ vợ đẻ',
        'Nghỉ con ốm',
        'Nghỉ dưỡng sức',
        'Nghỉ thai sản',
        'Nghỉ khám thai',
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

    const calculateDuration = (start, end) => {
        if (!start || !end) return '';

        const startDate = new Date(start);
        const endDate = new Date(end);

        if (endDate <= startDate) return '';

        const hoursDiff = differenceInHours(endDate, startDate);
        const daysDiff = differenceInDays(endDate, startDate);

        // Giới hạn các options dựa trên khoảng thời gian
        if (daysDiff >= 7) return 'trên 7.0 ngày';
        if (daysDiff > 0) return `${daysDiff}.0 ngày`;
        if (hoursDiff > 8) return '1.0 ngày';
        return `${hoursDiff}.0 giờ`;
    };

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

    // Thêm useEffect để tự động cập nhật giờ nghỉ
    useEffect(() => {
        const { start_time, end_time } = requestFormData.leave_registration;
        if (start_time && end_time) {
            const calculatedDuration = calculateDuration(start_time, end_time);
            if (calculatedDuration) {
                dispatch(
                    setRequestFormData({
                        ...requestFormData,
                        leave_registration: {
                            ...requestFormData.leave_registration,
                            hours: calculatedDuration,
                        },
                    }),
                );
            }
        }
    }, [requestFormData.leave_registration.start_time, requestFormData.leave_registration.end_time]);

    return (
        <>
            <Stack direction="row" alignItems="center" spacing={2}>
                <Typography sx={{ minWidth: 120, fontSize: '1.4rem' }}>Thời gian bắt đầu:</Typography>
                <TextField
                    fullWidth
                    name="start_time"
                    value={requestFormData.leave_registration.start_time}
                    onChange={handleChange}
                    required
                    size="medium"
                    type="datetime-local"
                    inputProps={{ style: { fontSize: '1.4rem' } }}
                />
            </Stack>
            <Stack direction="row" alignItems="center" spacing={2}>
                <Typography sx={{ minWidth: 120, fontSize: '1.4rem' }}>Thời gian kết thúc:</Typography>
                <TextField
                    fullWidth
                    name="end_time"
                    value={requestFormData.leave_registration.end_time}
                    onChange={handleChange}
                    required
                    size="medium"
                    type="datetime-local"
                    inputProps={{ style: { fontSize: '1.4rem' } }}
                />
            </Stack>
            <Stack direction="row" alignItems="center" spacing={2}>
                <Typography sx={{ minWidth: 120, fontSize: '1.4rem' }}>Thời gian nghỉ:</Typography>
                <Select
                    fullWidth
                    name="hours"
                    value={requestFormData.leave_registration.hours || ''}
                    onChange={handleChange}
                    required
                    size="medium"
                    sx={{ fontSize: '1.4rem' }}
                >
                    {getAvailableOptions(
                        requestFormData.leave_registration.start_time,
                        requestFormData.leave_registration.end_time,
                    ).map((option) => (
                        <MenuItem key={option} value={option} sx={{ fontSize: '1.4rem' }}>
                            {option}
                        </MenuItem>
                    ))}
                </Select>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={2}>
                <Typography sx={{ minWidth: 120, fontSize: '1.4rem' }}>Lý do xin nghỉ:</Typography>
                <Select
                    fullWidth
                    name="reason"
                    value={requestFormData.leave_registration.reason || ''}
                    onChange={handleChange}
                    required
                    size="medium"
                    sx={{
                        fontSize: '1.4rem',
                    }}
                >
                    {leaveReasons.map((reason) => (
                        <MenuItem key={reason} value={reason} sx={{ fontSize: '1.4rem' }}>
                            {reason}
                        </MenuItem>
                    ))}
                </Select>
            </Stack>
            <Stack direction="row" alignItems="flex-start" spacing={2}>
                <Typography sx={{ minWidth: 120, fontSize: '1.4rem' }}>Mô tả ( nếu có):</Typography>
                <TextField
                    fullWidth
                    name="description"
                    value={requestFormData.leave_registration.description}
                    onChange={handleChange}
                    required
                    size="medium"
                    multiline
                    rows={2}
                    inputProps={{
                        style: {
                            fontSize: '1.4rem',
                        },
                    }}
                />
            </Stack>
        </>
    );
}

export default LeaveRequestForm;
