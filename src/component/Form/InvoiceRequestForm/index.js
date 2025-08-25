import { Stack, Typography, TextField, Autocomplete } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { setRequestFormData, clearErrors } from '../../../redux/slice/requestFormDataSlice';
import { useEffect, useState } from 'react';
import InvoiceItemForm from "./InvoiceItemForm";
import { getBusinessPartners } from '../../../services/businessPartnerService';

export default function InvoiceRequestForm() {
    const dispatch = useDispatch();
    const requestFormData = useSelector((state) => state.requestFormData.value);
    const user = useSelector((state) => state.user.userInfo);
    const errors = useSelector((state) => state.requestFormData.errors);
    const [customers, setCustomers] = useState([]);

    useEffect(() => {
        const fetchCustomers = async () => {
            const response = await getBusinessPartners();
            setCustomers(response);
        };
        fetchCustomers();
    }, []);

    // Khi chọn khách hàng, tự động điền địa chỉ
    const handleCustomerChange = (event, value) => {
        dispatch(clearErrors());
        dispatch(
            setRequestFormData({
                ...requestFormData,
                requestName: value
                    ? `${user.name} đề nghị xuất hoá đơn cho ${value.CardName}`
                    : '',
                invoice_request: {
                    ...requestFormData.invoice_request,
                    customer_name: value ? value.CardName : '',
                    customer_address: value ? value.U_Diachi : '',
                },
            }),
        );
    };

    // Khi sửa địa chỉ hoặc mã số thuế thủ công
    const handleChange = (e) => {
        dispatch(clearErrors());
        const { name, value } = e.target;
        dispatch(
            setRequestFormData({
                ...requestFormData,
                invoice_request: {
                    ...requestFormData.invoice_request,
                    [name]: value,
                },
            }),
        );
    };

    const getTotalInvoiceAmount = () => {
        const items = requestFormData.invoice_request?.items || [];
        return items.reduce((sum, item) => {
            const quantity = parseFloat(item.quantity) || 0;
            const unitPrice = parseFloat(item.unit_price) || 0;
            const total = quantity * unitPrice;
            return sum + total;
        }, 0);
    };

    return (
        <Stack spacing={1}>
            <Stack direction="row" alignItems="center" spacing={2}>
                <Typography sx={{ width: 130, fontSize: '1.4rem' }}>Tên khách hàng(*)</Typography>
                <Autocomplete
                    fullWidth
                    freeSolo // Cho phép nhập ngoài danh sách
                    options={customers}
                    getOptionLabel={(option) => option.CardName || ''}
                    renderOption={(props, option) => (
                        <li {...props} key={option.CardCode}>
                            {option.CardName}
                        </li>
                    )}
                    value={
                        customers.find(
                            (c) => c.CardName === requestFormData.invoice_request?.customer_name
                        ) || null
                    }
                    onChange={handleCustomerChange}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            name="customer_name"
                            size="medium"
                            inputProps={{
                                ...params.inputProps,
                                style: { fontSize: '1.4rem' },
                            }}
                            error={!!errors?.customer_name}
                            helperText={errors?.customer_name || ''}
                        />
                    )}
                />
            </Stack>
            <Stack direction="row" alignItems="center" spacing={2}>
                <Typography sx={{ width: 130, fontSize: '1.4rem' }}>Địa chỉ(*)</Typography>
                <TextField
                    fullWidth
                    name="customer_address"
                    value={requestFormData.invoice_request?.customer_address || ''}
                    onChange={handleChange}
                    size="medium"
                    inputProps={{ style: { fontSize: '1.4rem' } }}
                    error={!!errors?.customer_address}
                    helperText={errors?.customer_address || ''}
                />
            </Stack>
            <Stack direction="row" alignItems="center" spacing={2}>
                <Typography sx={{ width: 130, fontSize: '1.4rem' }}>Mã số thuế(*)</Typography>
                <TextField
                    fullWidth
                    name="customer_tax_code"
                    value={requestFormData.invoice_request?.customer_tax_code || ''}
                    onChange={handleChange}
                    size="medium"
                    inputProps={{ style: { fontSize: '1.4rem' } }}
                    error={!!errors?.customer_tax_code}
                    helperText={errors?.customer_tax_code || ''}
                />
            </Stack>
            <InvoiceItemForm />
            <Stack direction="row" alignItems="center" spacing={2}>
                <Typography sx={{ width: 180, fontSize: '1.4rem' }}>Tổng giá trị hoá đơn:</Typography>
                <Typography sx={{ fontWeight: 600, fontSize: '1.4rem', color: 'primary.main' }}>
                    {getTotalInvoiceAmount().toLocaleString('vi-VN')} đ
                </Typography>
            </Stack>

        </Stack>
    );
}

