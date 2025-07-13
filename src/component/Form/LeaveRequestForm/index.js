import { useState, useEffect, useMemo } from 'react';
import { Stack, Typography, TextField, Select, MenuItem, Autocomplete } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import dayjs from 'dayjs';
import { setRequestFormData, clearErrors, setFormErrors } from '../../../redux/slice/requestFormDataSlice';
import { getLeaveHours } from '../../../services/leavehoursSevice';
import { convertTimeTextToHours, generateHourOptions } from '../../../utils/timeCalculator';

function LeaveRequestForm() {
    const dispatch = useDispatch();
    const requestFormData = useSelector((state) => state.requestFormData.value);
    const errors = useSelector((state) => state.requestFormData.errors);
    const userInfo = useSelector((state) => state.user.userInfo);
    const users = useSelector((state) => state.users.users);
    const [handoverUser, setHandoverUser] = useState(null); // Đổi từ followers thành handoverUser

    const handleHandoverUserChange = (event, newValue) => {
        setHandoverUser(newValue);
        dispatch(
            setRequestFormData({
                ...requestFormData,
                leave_registration: {
                    ...requestFormData.leave_registration,
                    handover_user_id: newValue?.id || null, // Lưu handover_user_id trong leave_registration
                },
            }),
        );
    };

    const [leaveDay, setLeaveDay] = useState({
        hasAnnualLeaveDay: 0,
        usedLeaveDay: 0,
    });

    const handleChange = (event) => {
        dispatch(clearErrors());
        const { name, value } = event.target;
        if (name === 'hoursText') {
            const totalHours = convertTimeTextToHours(value);
            dispatch(
                setRequestFormData({
                    ...requestFormData,
                    leave_registration: {
                        ...requestFormData.leave_registration,
                        [name]: value, // Update the specific field in leave_registration
                        hours: totalHours, // Update total hours based on selected time text
                    },
                }),
            );
            return;
        }
        dispatch(
            setRequestFormData({
                ...requestFormData,
                leave_registration: {
                    ...requestFormData.leave_registration,
                    [name]: value, // Update the specific field in leave_registration
                },
            }),
        );
    };

    const handleTimeChange = (event) => {
        const { name, value } = event.target;
        dispatch(clearErrors());

        const today = dayjs().startOf('day');
        const selectedDate = dayjs(value);

        // Validate both start and end time against today
        if (!selectedDate.isValid() || selectedDate.isBefore(today)) {
            dispatch(
                setFormErrors({
                    ...errors,
                    [name]: 'Thời gian không thể nhỏ hơn thời gian hiện tại',
                }),
            );
            return;
        }

        dispatch(
            setRequestFormData({
                ...requestFormData,
                leave_registration: {
                    ...requestFormData.leave_registration,
                    [name]: value,
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

    // Generate hour options based on selected start and end times
    const hourOptions = useMemo(() => {
        const start = requestFormData?.leave_registration?.start_time;
        const end = requestFormData?.leave_registration?.end_time;

        if (!start || !end) return [];

        return generateHourOptions(new Date(start), new Date(end));
    }, [requestFormData?.leave_registration?.start_time, requestFormData?.leave_registration?.end_time]);

    useEffect(() => {
        const fetchLeaveHours = async () => {
            try {
                const fetchLeaveHours = await getLeaveHours(userInfo?.id);
                const hasAnnualLeaveDay =
                    ((fetchLeaveHours?.totalAnnualLeaveHours - fetchLeaveHours?.usedLeaveHours || 0) / 8).toFixed(1) ||
                    0;
                const usedLeaveDay = (fetchLeaveHours?.usedLeaveHours / 8).toFixed(1) || 0;
                if (fetchLeaveHours) {
                    setLeaveDay({
                        hasAnnualLeaveDay,
                        usedLeaveDay,
                    });
                }
            } catch (error) {
                console.error('Error fetching leave hoursText:', error);
            }
        };
        fetchLeaveHours();
    }, []);

    // Effect để sync handoverUser với requestFormData khi load data
    useEffect(() => {
        const handoverUserId = requestFormData?.leave_registration?.handover_user_id;
        if (handoverUserId && users.length > 0) {
            const foundUser = users.find((user) => user.id === handoverUserId);
            setHandoverUser(foundUser || null);
        }
    }, [requestFormData?.leave_registration?.handover_user_id, users]);

    return (
        <Stack spacing={2}>
            <Stack direction="row" alignItems="center" spacing={2}>
                <Typography sx={{ minWidth: 120, fontSize: '1.4rem' }}>Lý do xin nghỉ:(*)</Typography>
                <Select
                    fullWidth
                    name="reason"
                    value={requestFormData?.leave_registration?.reason || ''}
                    onChange={handleChange}
                    size="medium"
                    multiline
                    sx={{ fontSize: '1.4rem' }}
                    error={!!errors?.reason}
                >
                    {leaveReasons.map((reason) => (
                        <MenuItem key={reason} value={reason} sx={{ fontSize: '1.4rem' }}>
                            {reason}
                        </MenuItem>
                    ))}
                </Select>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={2}>
                <Typography sx={{ minWidth: 120, fontSize: '1.4rem' }}>Thời gian bắt đầu: (*)</Typography>
                <TextField
                    fullWidth
                    name="start_time"
                    type="datetime-local"
                    value={requestFormData?.leave_registration?.start_time || ''}
                    onChange={handleTimeChange}
                    size="medium"
                    inputProps={{
                        style: { fontSize: '1.4rem' },
                        min: dayjs().format('YYYY-MM-DDTHH:mm'),
                        step: 300,
                    }}
                    error={!!errors?.start_time}
                    helperText={errors?.start_time || ''}
                />
            </Stack>

            <Stack direction="row" alignItems="center" spacing={2}>
                <Typography sx={{ minWidth: 120, fontSize: '1.4rem' }}>Thời gian kết thúc: (*)</Typography>
                <TextField
                    fullWidth
                    name="end_time"
                    type="datetime-local"
                    value={requestFormData?.leave_registration?.end_time || ''}
                    onChange={handleTimeChange}
                    size="medium"
                    inputProps={{
                        style: { fontSize: '1.4rem' },
                        step: 300,
                    }}
                    error={!!errors?.end_time}
                    helperText={errors?.end_time || ''}
                />
            </Stack>
            <Stack direction="row" alignItems="center" spacing={2}>
                <Typography sx={{ minWidth: 120, fontSize: '1.4rem' }}>Thời gian nghỉ: (*)</Typography>
                <Select
                    fullWidth
                    name="hoursText"
                    value={requestFormData?.leave_registration?.hoursText || ''}
                    onChange={handleChange}
                    size="medium"
                    sx={{ fontSize: '1.4rem' }}
                    error={!!errors?.hoursText}
                    disabled={
                        !requestFormData?.leave_registration?.start_time ||
                        !requestFormData?.leave_registration?.end_time
                    }
                >
                    {hourOptions.map((option) => (
                        <MenuItem key={option} value={option} sx={{ fontSize: '1.4rem' }}>
                            {option}
                        </MenuItem>
                    ))}
                </Select>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={2}>
                <Typography sx={{ minWidth: 120, fontSize: '1.4rem' }}>Người ban giao:</Typography>
                <Autocomplete
                    fullWidth
                    options={users}
                    getOptionLabel={(option) => option.name}
                    value={handoverUser}
                    onChange={handleHandoverUserChange}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            size="medium"
                            inputProps={{
                                ...params.inputProps,
                                style: { fontSize: '1.4rem' },
                            }}
                        />
                    )}
                    sx={{
                        '& .MuiChip-root': {
                            height: '24px',
                            backgroundColor: '#e8f5e9',
                            '& .MuiChip-label': {
                                fontSize: '1.2rem',
                                color: '#2e7d32',
                            },
                        },
                        '& .MuiAutocomplete-option': {
                            fontSize: '1.6rem',
                            padding: '18px 18px',
                            '&:hover': {
                                backgroundColor: '#f5f5f5',
                            },
                        },
                    }}
                />
            </Stack>
            <Stack direction="row" alignItems="center" spacing={2}>
                <Typography sx={{ minWidth: 120, fontSize: '1.4rem' }}>Số ngày phép đã dùng</Typography>
                <TextField
                    fullWidth
                    name="usedLeaveHours"
                    value={leaveDay?.usedLeaveDay || 0}
                    size="medium"
                    disabled
                    inputProps={{ style: { fontSize: '1.4rem' } }}
                />
            </Stack>
            <Stack direction="row" alignItems="center" spacing={2}>
                <Typography sx={{ minWidth: 120, fontSize: '1.4rem' }}>Số ngày phép còn lại</Typography>
                <TextField
                    fullWidth
                    name="hasLeaveHours"
                    value={leaveDay?.hasAnnualLeaveDay || 0}
                    disabled
                    size="medium"
                    inputProps={{ style: { fontSize: '1.4rem' } }}
                />
            </Stack>
        </Stack>
    );
}

export default LeaveRequestForm;
