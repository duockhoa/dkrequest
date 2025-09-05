import { Stack, Typography, TextField, Autocomplete, InputAdornment, Select, MenuItem } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { setRequestFormData, clearErrors } from '../../../redux/slice/requestFormDataSlice';
import FileUpload from '../FileUpload';
import { formatNumberWithCommas, parseFormattedNumber } from '../../../utils/numberToWords';
import { removeAccentsAndUppercase, formatBankAccountNumber, parseBankAccountNumber } from '../../../utils/bankAccount';
import { banklist } from '../../../services/bankService';

function UnionPaymentRequestForm() {
    const dispatch = useDispatch();
    const requestFormData = useSelector((state) => state.requestFormData.value);
    const errors = useSelector((state) => state.requestFormData.errors);
    const user = useSelector((state) => state.user.userInfo);

    // Mảng các loại tiền tệ
    const currencies = [
        { code: 'VND', symbol: '₫' },
        { code: 'USD', symbol: '$' },
        { code: 'EUR', symbol: '€' },
        { code: 'JPY', symbol: '¥' },
        { code: 'CNY', symbol: '¥' },
        { code: 'KRW', symbol: '₩' },
        { code: 'SGD', symbol: 'S$' },
        { code: 'THB', symbol: '฿' },
        { code: 'MYR', symbol: 'RM' },
        { code: 'GBP', symbol: '£' }
    ];

    const handleChange = (e) => {
        dispatch(clearErrors());
        const { name, value } = e.target;

        // Special handling for beneficiary_name - remove accents and uppercase
        let processedValue = value;
        if (name === 'beneficiary_name') {
            processedValue = removeAccentsAndUppercase(value);
        }

        // Lấy dữ liệu mới nhất sau khi thay đổi
        let newPaymentRequest = {
            ...requestFormData.union_payment_request,
            [name]: value,
        };

        // Nếu là amountText thì cần format lại
        if (name === 'amountText') {
            const formattedValue = formatNumberWithCommas(value);
            const numericValue = parseFormattedNumber(formattedValue);
            newPaymentRequest.amountText = formattedValue;
            newPaymentRequest.amount = numericValue;
        }

        // Nếu là bank_account_number thì cần format lại
        if (name === 'bank_account_number') {
            const formattedValue = formatBankAccountNumber(value);
            const cleanValue = parseBankAccountNumber(formattedValue);
            newPaymentRequest.bank_account_number = formattedValue;
            newPaymentRequest.bank_account_clean = cleanValue;
        }

        // Cập nhật requestName theo cấu trúc mới
        const requestName = `${user?.name || ''}  ${user?.department || ''}  ${newPaymentRequest.payment_content || ''} (${newPaymentRequest.amountText || ``} ${newPaymentRequest.currency || 'VNĐ'} )`;

        dispatch(
            setRequestFormData({
                ...requestFormData,
                union_payment_request: newPaymentRequest,
                requestName,
            }),
        );
    };

    // Chuẩn bị danh sách ngân hàng
    const bankOptions = Object.values(banklist).map((bank) => ({
        label: `${bank.name} - ${bank.shortName}`,
        value: bank.shortName,
        ...bank,
    }));

    return (
        <Stack spacing={3}>
            <Stack direction="row" alignItems="center" spacing={2}>
                <Typography sx={{ minWidth: 120, fontSize: '1.4rem' }}>Loại thanh toán (*):</Typography>
                <Select
                    fullWidth
                    name="payment_type"
                    value={requestFormData?.union_payment_request?.payment_type || ''}
                    onChange={handleChange}
                    size="medium"
                    sx={{ fontSize: '1.4rem' }}
                    error={!!errors?.payment_type}
                >
                    <MenuItem value="invoice" sx={{ fontSize: 14 }}>
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
                    name="payment_content"
                    value={requestFormData?.union_payment_request?.payment_content || ''}
                    onChange={handleChange}
                    multiline
                    size="medium"
                    inputProps={{ style: { fontSize: '1.4rem' } }}
                    error={!!errors?.payment_content}
                    helperText={errors?.payment_content || ''}
                />
            </Stack>

            <Stack direction="row" alignItems="center" spacing={2}>
                <Typography sx={{ minWidth: 120, fontSize: '1.4rem' }}>Cho đối tượng (*)</Typography>
                <TextField
                    fullWidth
                    name="pay_to"
                    value={requestFormData?.union_payment_request?.pay_to || ''}
                    onChange={handleChange}
                    size="medium"
                    inputProps={{ style: { fontSize: '1.4rem' } }}
                    error={!!errors?.pay_to}
                    helperText={errors?.pay_to || ''}
                />
            </Stack>

            <Stack direction="row" alignItems="center" spacing={2}>
                <Typography sx={{ minWidth: 120, fontSize: '1.4rem' }}>Số tiền (*)</Typography>
                <TextField
                    fullWidth
                    name="amountText"
                    value={requestFormData?.union_payment_request?.amountText || ''}
                    onChange={handleChange}
                    size="medium"
                    inputProps={{
                        style: { fontSize: '1.4rem' },
                    }}
                    error={!!errors?.amountText}
                    helperText={errors?.amountText || ''}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <Select
                                    name="currency"
                                    value={requestFormData?.union_payment_request?.currency || 'VND'}
                                    onChange={handleChange}
                                    size="small"
                                    variant="standard"
                                    sx={{ 
                                        minWidth: 80,
                                        fontSize: '1.4rem',
                                        '&:before': { display: 'none' },
                                        '&:after': { display: 'none' },
                                        '& .MuiSelect-select': {
                                            paddingRight: '24px !important'
                                        }
                                    }}
                                    disableUnderline
                                >
                                    {currencies.map((currency) => (
                                        <MenuItem key={currency.code} value={currency.code} sx={{ fontSize: '1.4rem' }}>
                                            {currency.code}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </InputAdornment>
                        )
                    }}
                />
            </Stack>

            <Stack direction="row" alignItems="center" spacing={2}>
                <Typography sx={{ minWidth: 120, fontSize: '1.4rem' }}>Thời hạn thanh toán</Typography>
                <TextField
                    fullWidth
                    name="due_date"
                    value={requestFormData?.union_payment_request?.due_date || ''}
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

            {/* Chỉ hiển thị thông tin ngân hàng khi currency là VND */}
            {(requestFormData?.union_payment_request?.currency || 'VND') === 'VND' && (
                <>
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
                            value={bankOptions.find((b) => b.label === requestFormData?.union_payment_request?.bank_name) || null}
                            onChange={(_, newValue) => {
                                dispatch(clearErrors());
                                dispatch(
                                    setRequestFormData({
                                        ...requestFormData,
                                        union_payment_request: {
                                            ...requestFormData.union_payment_request,
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
                                    size="medium"
                                    multiline
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
                            value={requestFormData?.union_payment_request?.bank_account_number || ''}
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
                            value={requestFormData?.union_payment_request?.beneficiary_name || ''}
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

            {/* File Upload Components */}
            {requestFormData?.union_payment_request?.payment_type === 'invoice' && (
                <FileUpload fieldName="invoices" label="Hóa đơn" multiple={true} maxSize={100} />
            )}
            {requestFormData?.union_payment_request?.payment_type === 'no_invoice' && (
                <FileUpload fieldName="receipts" label="Bảng kê vật tư" multiple={true} maxSize={100} />
            )}
        </Stack>
    );
}

export default UnionPaymentRequestForm;
