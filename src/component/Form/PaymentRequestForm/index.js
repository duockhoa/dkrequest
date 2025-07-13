import { Stack, Typography, TextField, Autocomplete, InputAdornment } from '@mui/material';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { useSelector, useDispatch } from 'react-redux';
import { setRequestFormData, clearErrors } from '../../../redux/slice/requestFormDataSlice';
import FileUpload from '../FileUpload';
import { numberToVietnameseWords, formatNumberWithCommas, parseFormattedNumber } from '../../../utils/numberToWords';
import { removeAccentsAndUppercase, formatBankAccountNumber, parseBankAccountNumber } from '../../../utils/bankAccount';
import { banklist } from '../../../services/bankService';

function PaymentRequestForm() {
    const dispatch = useDispatch();
    const requestFormData = useSelector((state) => state.requestFormData.value);
    const errors = useSelector((state) => state.requestFormData.errors);

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
                    payment_request: {
                        ...requestFormData.payment_request,
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
                    payment_request: {
                        ...requestFormData.payment_request,
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
                payment_request: {
                    ...requestFormData.payment_request,
                    [name]: processedValue,
                },
            }),
        );
    };

    // Get amount in words for helper text
    const amountInWords = () => {
        const amount = requestFormData?.payment_request?.amount;
        if (!amount || amount === 0) return '';
        return numberToVietnameseWords(amount);
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
                    value={requestFormData?.payment_request?.payment_type || ''}
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
                    value={requestFormData?.payment_request?.payment_content || ''}
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
                    value={requestFormData?.payment_request?.pay_to || ''}
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
                    value={requestFormData?.payment_request?.amountText || ''}
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
                <Typography sx={{ minWidth: 120, fontSize: '1.4rem' }}>Thời hạn thanh toán (*)</Typography>
                <TextField
                    fullWidth
                    name="due_date"
                    value={requestFormData?.payment_request?.due_date || ''}
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
                    // FIX: Sửa logic value - so sánh đúng field
                    value={bankOptions.find((b) => b.label === requestFormData?.payment_request?.bank_name) || null}
                    onChange={(_, newValue) => {
                        dispatch(clearErrors()); // FIX: Thêm clearErrors
                        dispatch(
                            setRequestFormData({
                                ...requestFormData,
                                payment_request: {
                                    ...requestFormData.payment_request,
                                    bank_name: newValue ? newValue.label : '', // FIX: Sử dụng label thay vì template string
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
                    value={requestFormData?.payment_request?.bank_account_number || ''}
                    onChange={handleChange}
                    size="medium"
                    inputProps={{
                        style: { fontSize: '1.4rem' },
                        maxLength: 20, // FIX: Thêm giới hạn ký tự
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
                    value={requestFormData?.payment_request?.beneficiary_name || ''}
                    onChange={handleChange}
                    size="medium"
                    inputProps={{
                        style: { fontSize: '1.4rem' },
                    }}
                    error={!!errors?.beneficiary_name}
                    helperText={errors?.beneficiary_name || ''}
                />
            </Stack>

            {/* File Upload Components */}
            {requestFormData?.payment_request?.payment_type === 'invoice' && (
                <FileUpload fieldName="invoices" label="Hóa đơn" multiple={true} maxSize={100} />
            )}
            {requestFormData?.payment_request?.payment_type === 'no_invoice' && (
                <FileUpload fieldName="receipts" label="Bảng kê vật tư" multiple={true} maxSize={100} />
            )}
        </Stack>
    );
}

export default PaymentRequestForm;
