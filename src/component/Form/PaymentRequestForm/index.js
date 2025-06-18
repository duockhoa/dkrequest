import { Stack, Typography, TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { setRequestFormData } from '../../../redux/slice/requestFormDataSlice';
import { clearErrors } from '../../../redux/slice/requestFormDataSlice';
import { useMemo, useEffect, useState } from 'react';
import { convertTimeTextToHours, generateHourOverTimeOptions } from '../../../utils/timeCalculator';
import { getOverTimeHours } from '../../../services/overTimeHoursSevice';

function PaymentRequestForm() {
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

    return (
        <>
            <Stack direction="row" alignItems="center" spacing={2}>
                <Typography sx={{ minWidth: 120, fontSize: '1.4rem' }}>Loại thanh toán</Typography>
                <Select
                    fullWidth
                    name="hoursText"
                    value={requestFormData?.overtime_registration?.hoursText || ''}
                    onChange={handleChange}
                    size="medium"
                    sx={{ fontSize: '1.4rem' }}
                    error={!!errors?.hoursText}
                >
                    <MenuItem value="has_invoice" sx={{ fontSize: 14 }}>
                        Có hóa đơn
                    </MenuItem>
                    <MenuItem value="no_invoice" sx={{ fontSize: 14 }}>
                        Không hóa đơn
                    </MenuItem>
                </Select>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={2}>
                <Typography sx={{ minWidth: 120, fontSize: '1.4rem' }}>Nội dung thanh toán: (*)</Typography>
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
                <Typography sx={{ minWidth: 120, fontSize: '1.4rem' }}>Cho đối tượng (*)</Typography>
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
                <Typography sx={{ minWidth: 120, fontSize: '1.4rem' }}>Số tiền (*)</Typography>
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
                <Typography sx={{ minWidth: 120, fontSize: '1.4rem' }}>Thời hạn thanh toán (*)</Typography>
                <TextField
                    fullWidth
                    name="reason"
                    value={requestFormData?.overtime_registration?.reason || ''}
                    onChange={handleChange}
                    size="medium"
                    multiline
                    rows={1}
                    type="date"
                    inputProps={{ style: { fontSize: '1.4rem' } }}
                    error={!!errors?.reason}
                    helperText={errors?.reason || ''}
                />
            </Stack>
            <Stack direction="row" alignItems="center" spacing={2}>
                <Typography sx={{ minWidth: 120, fontSize: '1.4rem' }}>Tài khoản ngân hàng (*)</Typography>
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
                <Typography sx={{ minWidth: 120, fontSize: '1.4rem' }}>Chủ tài khoản (*)</Typography>
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
                <Typography sx={{ minWidth: 120, fontSize: '1.4rem' }}>Chi nhánh ngân hàng (*)</Typography>
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
                <Typography sx={{ minWidth: 120, fontSize: '1.4rem' }}>Số tài khoản (*)</Typography>
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
        </>
    );
}

export default PaymentRequestForm;
