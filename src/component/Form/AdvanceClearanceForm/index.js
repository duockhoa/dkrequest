import { Stack, Typography, TextField, Autocomplete } from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';
import { useSelector, useDispatch } from 'react-redux';
import { setRequestFormData, clearErrors } from '../../../redux/slice/requestFormDataSlice';
import { banklist } from '../../../services/bankService';
import AdvanceClearanceVouchersForm from '../AdvanceClearanceVouchersForm';
import AdvanceClearanceSpendingsForm from '../AdvanceClearanceSpendingsForm';
import { numberToVietnameseWords, formatNumberWithCommas, parseFormattedNumber } from '../../../utils/numberToWords';
import { useMemo, useEffect } from 'react';

function AdvanceClearanceForm() {
    const dispatch = useDispatch();
    const requestFormData = useSelector((state) => state.requestFormData.value);
    const user = useSelector((state) => state.user.userInfo);
    const errors = useSelector((state) => state.requestFormData.errors);

    // Helper text đọc số ra chữ
    const unspentAmountInWords = () => {
        const amount = requestFormData?.advance_clearance_request?.unspent_amount;
        if (!amount || amount === 0) return '';
        return numberToVietnameseWords(amount);
    };

    const handleChange = (e) => {
        dispatch(clearErrors());
        const { name, value } = e.target;

        if (name === 'unspent_amount') {
            // Format value with commas
            const formattedValue = formatNumberWithCommas(value);
            // Convert to number for storage
            const numericValue = parseFormattedNumber(formattedValue);

            dispatch(
                setRequestFormData({
                    ...requestFormData,
                    advance_clearance_request: {
                        ...requestFormData.advance_clearance_request,
                        unspent_amountText: formattedValue,
                        unspent_amount: numericValue,
                    },
                }),
            );
            return;
        }

        dispatch(
            setRequestFormData({
                ...requestFormData,
                advance_clearance_request: {
                    ...requestFormData.advance_clearance_request,
                    [name]: value,
                },
            }),
        );
    };

    // Tính tổng số tiền ứng kỳ này
    const totalVoucherAmount = useMemo(() => {
        const vouchers = requestFormData?.advance_clearance_request?.vouchers || [];
        return vouchers.reduce((sum, v) => sum + (parseFloat(v.amount) || 0), 0);
    }, [requestFormData]);

    // Tính tổng số tiền đã chi
    const totalSpendingAmount = useMemo(() => {
        const spendings = requestFormData?.advance_clearance_request?.spendings || [];
        return spendings.reduce((sum, s) => sum + (parseFloat(s.amount) || 0), 0);
    }, [requestFormData]);

    // Số tiền còn lại = số tiền kỳ trước chưa chi hết + tổng số tiền ứng - tổng số tiền chi
    const remainAmount = useMemo(() => {
        const unspent = parseFloat(requestFormData?.advance_clearance_request?.unspent_amount) || 0;
        return unspent + totalVoucherAmount - totalSpendingAmount;
    }, [requestFormData, totalVoucherAmount, totalSpendingAmount]);

    // Chuẩn bị danh sách ngân hàng
    const bankOptions = Object.values(banklist).map((bank) => ({
        label: `${bank.name} - ${bank.shortName}`,
        value: bank.shortName,
        ...bank,
    }));

    // Set giá trị mặc định vào redux khi mount
    useEffect(() => {
        const advance = requestFormData?.advance_clearance_request || {};
        let changed = false;
        const defaultData = { ...advance };

        if (defaultData.address === undefined) {
            defaultData.address = user?.department || '';
            changed = true;
        }
        if (defaultData.unspent_amountText === undefined) {
            defaultData.unspent_amountText = '0';
            changed = true;
        }
        if (defaultData.unspent_amount === undefined) {
            defaultData.unspent_amount = 0;
            changed = true;
        }
        if (defaultData.bank_name === undefined) {
            defaultData.bank_name = '';
            changed = true;
        }
        if (defaultData.bank_account_number === undefined) {
            defaultData.bank_account_number = '';
            changed = true;
        }
        if (defaultData.beneficiary_name === undefined) {
            defaultData.beneficiary_name = '';
            changed = true;
        }

        if (changed) {
            dispatch(
                setRequestFormData({
                    ...requestFormData,
                    advance_clearance_request: defaultData,
                }),
            );
        }
    }, [dispatch, requestFormData, user]);

    return (
        <Stack spacing={3}>
            <Stack direction="row" alignItems="center" spacing={2}>
                <Typography sx={{ width: 160, fontSize: '1.4rem' }}>Địa chỉ/Bộ phận</Typography>
                <TextField
                    fullWidth
                    name="address"
                    value={
                        requestFormData?.advance_clearance_request?.address !== undefined
                            ? requestFormData.advance_clearance_request.address
                            : user?.department || ''
                    }
                    onChange={handleChange}
                    size="medium"
                    inputProps={{ style: { fontSize: '1.4rem' } }}
                    error={!!errors?.address}
                    helperText={errors?.address || ''}
                />
            </Stack>

            <Stack direction="row" alignItems="center" spacing={2}>
                <Typography sx={{ width: 160, fontSize: '1.4rem' }}>Số tiền ứng kỳ trước chưa chi hết:</Typography>
                <TextField
                    fullWidth
                    name="unspent_amount"
                    value={
                        requestFormData?.advance_clearance_request?.unspent_amountText !== undefined
                            ? requestFormData.advance_clearance_request.unspent_amountText
                            : '0'
                    }
                    onChange={handleChange}
                    size="medium"
                    inputProps={{ style: { fontSize: '1.4rem' } }}
                    error={!!errors?.unspent_amount}
                    helperText={errors?.unspent_amount || unspentAmountInWords() || ''}
                    InputProps={{
                        endAdornment: <InputAdornment position="end">đ</InputAdornment>,
                    }}
                />
            </Stack>
            <Typography sx={{ fontSize: '1.4rem' }}>Số tiền ứng kỳ này:</Typography>

            <AdvanceClearanceVouchersForm />
            <Typography sx={{ fontSize: '1.4rem' }}>Số tiền đã chi:</Typography>
            <AdvanceClearanceSpendingsForm />
            <Typography sx={{ fontSize: '1.4rem', color: 'blue' }}>Số tiền còn lại: {remainAmount} đ</Typography>

            {remainAmount < 0 && (
                <>
                    <Stack direction="row" alignItems="center" spacing={2}>
                        <Typography sx={{ width: 160, fontSize: '1.4rem' }}>Ngân hàng</Typography>
                        <Autocomplete
                            fullWidth
                            options={bankOptions}
                            getOptionLabel={(option) => option.label}
                            value={
                                bankOptions.find(
                                    (b) => b.label === requestFormData?.advance_clearance_request?.bank_name,
                                ) || null
                            }
                            onChange={(_, newValue) => {
                                dispatch(clearErrors());
                                dispatch(
                                    setRequestFormData({
                                        ...requestFormData,
                                        advance_clearance_request: {
                                            ...requestFormData.advance_clearance_request,
                                            bank_name: newValue ? newValue.label : '',
                                        },
                                    }),
                                );
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    name="bank_name"
                                    size="medium"
                                    inputProps={{
                                        ...params.inputProps,
                                        style: { fontSize: '1.4rem' },
                                    }}
                                    error={!!errors?.bank_name}
                                    helperText={errors?.bank_name || ''}
                                />
                            )}
                        />
                    </Stack>

                    <Stack direction="row" alignItems="center" spacing={2}>
                        <Typography sx={{ width: 160, fontSize: '1.4rem' }}>Số tài khoản</Typography>
                        <TextField
                            fullWidth
                            name="bank_account_number"
                            value={requestFormData?.advance_clearance_request?.bank_account_number || ''}
                            onChange={handleChange}
                            size="medium"
                            inputProps={{
                                style: { fontSize: '1.4rem' },
                                maxLength: 20,
                            }}
                            error={!!errors?.bank_account_number}
                            helperText={errors?.bank_account_number || ''}
                        />
                    </Stack>

                    <Stack direction="row" alignItems="center" spacing={2}>
                        <Typography sx={{ width: 160, fontSize: '1.4rem' }}>Chủ tài khoản</Typography>
                        <TextField
                            fullWidth
                            name="beneficiary_name"
                            value={requestFormData?.advance_clearance_request?.beneficiary_name || ''}
                            onChange={handleChange}
                            size="medium"
                            inputProps={{
                                style: { fontSize: '1.4rem' },
                            }}
                            error={!!errors?.beneficiary_name}
                            helperText={errors?.beneficiary_name || ''}
                        />
                    </Stack>
                </>
            )}
        </Stack>
    );
}

export default AdvanceClearanceForm;
