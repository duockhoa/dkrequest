import { Stack, Typography, TextField, Select, MenuItem } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { setRequestFormData } from '../../../redux/slice/requestFormDataSlice';
import { clearErrors } from '../../../redux/slice/requestFormDataSlice';
import { useMemo, useEffect, useState } from 'react';
import { convertTimeTextToHours, generateHourOverTimeOptions } from '../../../utils/timeCalculator';
import { getOverTimeHours } from '../../../services/overTimeHoursSevice';
function OvertimeRequestForm() {
    const dispatch = useDispatch();
    const requestFormData = useSelector((state) => state.requestFormData.value);
    const errors = useSelector((state) => state.requestFormData.errors);
    const user = useSelector((state) => state.user.userInfo);
    const [totalOverTimeHours, setTotalOverTimeHours] = useState(0);

    const handleChange = (event) => {
        dispatch(clearErrors());
        const { name, value } = event.target;
        if (name === 'hoursText') {
            const totalHours = convertTimeTextToHours(value);
            dispatch(
                setRequestFormData({
                    ...requestFormData,
                    overtime_registration: {
                        ...requestFormData.overtime_registration,
                        [name]: value,
                        hours: totalHours,
                    },
                }),
            );
            return;
        }
        dispatch(
            setRequestFormData({
                ...requestFormData,
                overtime_registration: {
                    ...requestFormData.overtime_registration,
                    [name]: value,
                },
            }),
        );
    };

    // Generate hour options based on selected start and end times
    const hourOptions = useMemo(() => {
        const start = requestFormData?.overtime_registration?.start_time;
        const end = requestFormData?.overtime_registration?.end_time;

        if (!start || !end) return [];

        return generateHourOverTimeOptions(new Date(start), new Date(end));
    }, [requestFormData?.overtime_registration?.start_time, requestFormData?.overtime_registration?.end_time]);

    // Fetch overtime hours when component mounts
    useEffect(() => {
        const fetchOverTimeHours = async () => {
            try {
                const response = await getOverTimeHours(user.id);
                setTotalOverTimeHours(response?.totalOverTimeHours || 0);
            } catch (error) {
                console.error('Error fetching overtime hours:', error);
            }
        };

        fetchOverTimeHours();
    }, []);

    return (
        <>
            <Stack direction="row" alignItems="center" spacing={2}>
                <Typography sx={{ minWidth: 120, fontSize: '1.4rem' }}>Thời gian bắt đầu: (*)</Typography>
                <TextField
                    fullWidth
                    name="start_time"
                    value={requestFormData?.overtime_registration?.start_time || ''}
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
                    value={requestFormData?.overtime_registration?.end_time || ''}
                    onChange={handleChange}
                    size="medium"
                    type="datetime-local"
                    inputProps={{ style: { fontSize: '1.4rem' } }}
                    error={!!errors?.end_time}
                    helperText={errors?.end_time || ''}
                />
            </Stack>
            <Stack direction="row" alignItems="center" spacing={2}>
                <Typography sx={{ minWidth: 120, fontSize: '1.4rem' }}>Thời gian làm thêm: (*)</Typography>
                <Select
                    fullWidth
                    name="hoursText"
                    value={requestFormData?.overtime_registration?.hoursText || ''}
                    onChange={handleChange}
                    size="medium"
                    sx={{ fontSize: '1.4rem' }}
                    error={!!errors?.hoursText}
                    disabled={
                        !requestFormData?.overtime_registration?.start_time ||
                        !requestFormData?.overtime_registration?.end_time
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
                <Typography sx={{ minWidth: 120, fontSize: '1.4rem' }}>Nội dung công việc: (*)</Typography>
                <TextField
                    fullWidth
                    name="reason"
                    value={requestFormData?.overtime_registration?.reason || ''}
                    onChange={handleChange}
                    size="medium"
                    multiline
                    rows={1}
                    inputProps={{ style: { fontSize: '1.4rem' } }}
                    error={!!errors?.reason}
                    helperText={errors?.reason || ''}
                />
            </Stack>
            <Stack direction="row" alignItems="center" spacing={2}>
                <Typography sx={{ minWidth: 120, fontSize: '1.4rem' }}>Số giờ đã làm thêm:</Typography>
                <TextField
                    fullWidth
                    name="totalOverTimeHours"
                    value={(totalOverTimeHours || 0) + ' giờ'}
                    disabled
                    size="medium"
                    multiline
                    rows={1}
                    inputProps={{ style: { fontSize: '1.4rem' } }}
                />
            </Stack>
        </>
    );
}

export default OvertimeRequestForm;
