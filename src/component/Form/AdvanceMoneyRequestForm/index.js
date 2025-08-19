import { Stack, Typography, TextField, Autocomplete, InputAdornment, Select, MenuItem } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useLayoutEffect } from 'react';
import { setRequestFormData, clearErrors } from '../../../redux/slice/requestFormDataSlice';
import { numberToVietnameseWords, formatNumberWithCommas, parseFormattedNumber } from '../../../utils/numberToWords';
import { removeAccentsAndUppercase, formatBankAccountNumber, parseBankAccountNumber } from '../../../utils/bankAccount';
import { banklist } from '../../../services/bankService';

function AdvanceMoneyRequestForm() {
    const dispatch = useDispatch();
    const requestFormData = useSelector((state) => state.requestFormData.value);
    const errors = useSelector((state) => state.requestFormData.errors);
    const userInfo = useSelector((state) => state.user.userInfo);

    // Initialize default values when component mounts
    useEffect(() => {
        if (userInfo) {
            const currentAdvanceRequest = requestFormData?.advance_request || {};
            console.log(userInfo.department);
            dispatch(
                setRequestFormData({
                    ...requestFormData,
                    advance_request: {
                        ...currentAdvanceRequest,
                        address: userInfo.department || '',
                        beneficiary_name: removeAccentsAndUppercase(userInfo.name || ''),
                    },
                }),
            );
        }
    }, []);

    // Sử dụng useLayoutEffect để chạy ĐỒNG BỘ sau khi DOM được update
    useLayoutEffect(() => {
        if (
            userInfo &&
            (!requestFormData?.advance_request?.address || !requestFormData?.advance_request?.beneficiary_name)
        ) {
            dispatch(
                setRequestFormData({
                    ...requestFormData,
                    advance_request: {
                        ...requestFormData?.advance_request,
                        address: requestFormData?.advance_request?.address || userInfo.department || '',
                        beneficiary_name:
                            requestFormData?.advance_request?.beneficiary_name ||
                            removeAccentsAndUppercase(userInfo.name || ''),
                    },
                }),
            );
        }
    }, [userInfo, requestFormData, dispatch]);

    const handleChange = (e) => {
        dispatch(clearErrors());
        const { name, value } = e.target;

        // Special handling for beneficiary_name - remove accents and uppercase
        let processedValue = value;
        if (name === 'beneficiary_name') {
            processedValue = removeAccentsAndUppercase(value);
        }

        if (name === 'amountText') {
            // Format the input value with commas
            const formattedValue = formatNumberWithCommas(value);
            // Convert to number for storage
            const numericValue = parseFormattedNumber(formattedValue);

            dispatch(
                setRequestFormData({
                    ...requestFormData,
                    advance_request: {
                        ...requestFormData.advance_request,
                        amountText: formattedValue,
                        amount: numericValue,
                    },
                }),
            );
            return; // Return early to avoid the general dispatch below
        }

        if (name === 'bank_account_number') {
            // Format bank account number with spaces every 4 digits
            const formattedValue = formatBankAccountNumber(value);
            // Store clean number for backend
            const cleanValue = parseBankAccountNumber(formattedValue);

            dispatch(
                setRequestFormData({
                    ...requestFormData,
                    advance_request: {
                        ...requestFormData.advance_request,
                        bank_account_number: formattedValue,
                        bank_account_clean: cleanValue,
                    },
                }),
            );
            return;
        }

        dispatch(
            setRequestFormData({
                ...requestFormData,
                advance_request: {
                    ...requestFormData.advance_request,
                    [name]: processedValue,
                },
            }),
        );
    };

    // Get amount in words for helper text
    const amountInWords = () => {
        const amount = requestFormData?.advance_request?.amount;
        if (!amount || amount === 0) return '';
        return numberToVietnameseWords(amount);
    };

    // Chuẩn bị danh sách ngân hàng
    const bankOptions = Object.values(banklist).map((bank) => ({
        label: `${bank.name} - ${bank.shortName}`,
        value: bank.shortName,
        ...bank,
    }));

    // Thêm options cho lý do tạm ứng
    const reasonOptions = ['Tạm ứng tiền mua vật tư', 'Tạm ứng lương'];

    return (
        <Stack spacing={3}>
            <Stack direction="row" alignItems="center" spacing={2}>
                <Typography sx={{ minWidth: 120, fontSize: '1.4rem' }}>Lý do tạm ứng: (*)</Typography>
                <Select
                    fullWidth
                    name="reason"
                    value={requestFormData?.advance_request?.reason || ''}
                    onChange={handleChange}
                    size="medium"
                    sx={{ fontSize: '1.4rem' }}
                    error={!!errors?.reason}
                >
                    {reasonOptions.map((reason) => (
                        <MenuItem key={reason} value={reason} sx={{ fontSize: '1.4rem' }}>
                            {reason}
                        </MenuItem>
                    ))}
                </Select>
            </Stack>

            <Stack direction="row" alignItems="center" spacing={2}>
                <Typography sx={{ minWidth: 120, fontSize: '1.4rem' }}>Bộ phận/Địa chỉ (*)</Typography>
                <TextField
                    fullWidth
                    name="address"
                    value={requestFormData?.advance_request?.address || ''}
                    onChange={handleChange}
                    size="medium"
                    inputProps={{ style: { fontSize: '1.4rem' } }}
                    error={!!errors?.address}
                    helperText={errors?.address || ''}
                />
            </Stack>

            <Stack direction="row" alignItems="center" spacing={2}>
                <Typography sx={{ minWidth: 120, fontSize: '1.4rem' }}>Sô tiền tạm ứng (*)</Typography>
                <TextField
                    fullWidth
                    name="amountText"
                    value={requestFormData?.advance_request?.amountText || ''}
                    onChange={handleChange}
                    size="medium"
                    inputProps={{
                        style: { fontSize: '1.4rem' },
                    }}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <Typography sx={{ fontSize: '1.4rem', color: 'text.secondary' }}>vnđ</Typography>
                            </InputAdornment>
                        ),
                    }}
                    error={!!errors?.amountText}
                    helperText={errors?.amountText || amountInWords() || ''}
                />
            </Stack>

            <Stack direction="row" alignItems="center" spacing={2}>
                <Typography sx={{ minWidth: 120, fontSize: '1.4rem' }}>Thời hạn thanh toán</Typography>
                <TextField
                    fullWidth
                    name="due_date"
                    value={requestFormData?.advance_request?.due_date || ''}
                    onChange={handleChange}
                    size="medium"
                    type="date"
                    inputProps={{ style: { fontSize: '1.4rem' }, min: new Date().toISOString().split('T')[0] }}
                    error={!!errors?.due_date}
                    helperText={errors?.due_date || ''}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
            </Stack>

            <Stack direction="row" alignItems="center" spacing={2}>
                <Typography sx={{ minWidth: 120, fontSize: '1.4rem' }}>Ngân hàng</Typography>
                <Autocomplete
                    fullWidth
                    options={bankOptions}
                    getOptionLabel={(option) => option.label}
                    filterOptions={(options, { inputValue }) => {
                        const normalizedInput = removeAccentsAndUppercase(inputValue).toLowerCase();
                        return options.filter((option) => {
                            const name = removeAccentsAndUppercase(option.name).toLowerCase();
                            const shortName = removeAccentsAndUppercase(option.shortName).toLowerCase();
                            return name.includes(normalizedInput) || shortName.includes(normalizedInput);
                        });
                    }}
                    value={bankOptions.find((b) => b.label === requestFormData?.advance_request?.bank_name) || null}
                    onChange={(_, newValue) => {
                        dispatch(clearErrors());
                        dispatch(
                            setRequestFormData({
                                ...requestFormData,
                                advance_request: {
                                    ...requestFormData.advance_request,
                                    bank_name: newValue ? newValue.label : '',
                                },
                            }),
                        );
                    }}
                    renderOption={(props, option) => (
                        <li {...props} key={option.value}>
                            <Typography sx={{ fontSize: 14 }}>{option.label}</Typography>
                        </li>
                    )}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            name="bank_name"
                            multiline
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
                <Typography sx={{ minWidth: 120, fontSize: '1.4rem' }}>Số tài khoản</Typography>
                <TextField
                    fullWidth
                    name="bank_account_number"
                    value={requestFormData?.advance_request?.bank_account_number || ''}
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
                <Typography sx={{ minWidth: 120, fontSize: '1.4rem' }}>Chủ tài khoản</Typography>
                <TextField
                    fullWidth
                    name="beneficiary_name"
                    value={requestFormData?.advance_request?.beneficiary_name || ''}
                    onChange={handleChange}
                    disabled={true} 
                    size="medium"
                    inputProps={{
                        style: { fontSize: '1.4rem' },
                        maxLength: 100,
                    }}
                    error={!!errors?.beneficiary_name}
                    helperText={errors?.beneficiary_name || ''}
                />
            </Stack>
        </Stack>
    );
}

export default AdvanceMoneyRequestForm;
