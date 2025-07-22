import { Stack, Typography, TextField, Select, MenuItem } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { setRequestFormData, clearErrors } from '../../../redux/slice/requestFormDataSlice';
import { fetchRequestApprovers } from '../../../redux/slice/requestApproverSlice';

function ExpressDeliveryForm() {
    const dispatch = useDispatch();
    const requestFormData = useSelector((state) => state.requestFormData.value);
    const errors = useSelector((state) => state.requestFormData.errors);
    const user = useSelector((state) => state.user.userInfo);
    const requestTypeId = useSelector((state) => state.requestId.requestTypeId);
    // useEffect để init default values
    useEffect(() => {
        if (!requestFormData?.express_delivery_request) {
            dispatch(
                setRequestFormData({
                    ...requestFormData,
                    express_delivery_request: {
                        item_type: 'Giấy tờ',
                        item_weight: '',
                        delivery_method: '',
                        express_reason: '',
                        expected_receive_date: '',
                        receiving_unit: '',
                        receiving_address: '',
                        recipient_name: '',
                        recipient_phone: '',
                    },
                }),
            );
        }
    }, [dispatch, requestFormData]);

    useEffect(() => {
        const method = requestFormData?.express_delivery_request?.delivery_method;
        if (method === 'Gửi hỏa tốc' || method === 'Gửi đảm bảo' || method === 'Gửi đi nước ngoài') {
            dispatch(fetchRequestApprovers({ requestTypeId: 6, userId: user.id }));
        } else {
            dispatch(fetchRequestApprovers({ requestTypeId, userId: user.id }));
        }
    }, [dispatch, requestFormData?.express_delivery_request?.delivery_method]);

    const handleChange = (e) => {
        dispatch(clearErrors());
        const { name, value } = e.target;

        dispatch(
            setRequestFormData({
                ...requestFormData,
                express_delivery_request: {
                    ...requestFormData.express_delivery_request,
                    [name]: value,
                },
            }),
        );
    };

    // Options cho các dropdown
    const itemTypes = ['Giấy tờ', 'Hàng hoá không phải chất lỏng', 'Hàng Hoá là chất lỏng'];

    const deliveryMethods = ['Gửi thông thường', 'Gửi hỏa tốc', 'Gửi đảm bảo', 'Gửi đi nước ngoài'];

    const weightRanges = ['Dưới 1kg', 'Từ 1kg - dưới 3kg', 'Từ 3kg - dưới 5kg', 'Trên 5kg'];

    return (
        <Stack spacing={2}>
            <Stack direction="row" alignItems="center" spacing={2}>
                <Typography sx={{ minWidth: 120, fontSize: '1.4rem' }}>Loại hàng hóa: (*)</Typography>
                <Select
                    fullWidth
                    name="item_type"
                    value={requestFormData?.express_delivery_request?.item_type || ''}
                    onChange={handleChange}
                    size="medium"
                    sx={{ fontSize: '1.4rem' }}
                    error={!!errors?.item_type}
                >
                    {itemTypes.map((type) => (
                        <MenuItem key={type} value={type} sx={{ fontSize: '1.4rem' }}>
                            {type}
                        </MenuItem>
                    ))}
                </Select>
            </Stack>

            <Stack direction="row" alignItems="center" spacing={2}>
                <Typography sx={{ minWidth: 120, fontSize: '1.4rem' }}>Trọng lượng: (*)</Typography>
                <Select
                    fullWidth
                    name="item_weight"
                    value={requestFormData?.express_delivery_request?.item_weight || ''}
                    onChange={handleChange}
                    size="medium"
                    sx={{ fontSize: '1.4rem' }}
                    error={!!errors?.item_weight}
                >
                    {weightRanges.map((weight) => (
                        <MenuItem key={weight} value={weight} sx={{ fontSize: '1.4rem' }}>
                            {weight}
                        </MenuItem>
                    ))}
                </Select>
            </Stack>

            <Stack direction="row" alignItems="center" spacing={2}>
                <Typography sx={{ minWidth: 120, fontSize: '1.4rem' }}>Hình thức vận chuyển: (*)</Typography>
                <Select
                    fullWidth
                    name="delivery_method"
                    value={requestFormData?.express_delivery_request?.delivery_method || ''}
                    onChange={handleChange}
                    size="medium"
                    sx={{ fontSize: '1.4rem' }}
                    error={!!errors?.delivery_method}
                >
                    {deliveryMethods.map((method) => (
                        <MenuItem key={method} value={method} sx={{ fontSize: '1.4rem' }}>
                            {method}
                        </MenuItem>
                    ))}
                </Select>
            </Stack>

            {/* Chỉ hiển thị khi phương thức là "Gửi hỏa tốc" hoặc "Gửi đảm bảo" */}
            {['Gửi hỏa tốc', 'Gửi đảm bảo'].includes(requestFormData?.express_delivery_request?.delivery_method) && (
                <>
                    <Stack direction="row" alignItems="flex-start" spacing={2}>
                        <Typography sx={{ minWidth: 120, fontSize: '1.4rem', mt: 1 }}>
                            Lý do gửi {requestFormData?.express_delivery_request?.delivery_method.toLowerCase()}: (*)
                        </Typography>
                        <TextField
                            fullWidth
                            name="express_reason"
                            multiline
                            minRows={2}
                            maxRows={4}
                            value={requestFormData?.express_delivery_request?.express_reason || ''}
                            onChange={handleChange}
                            size="medium"
                            inputProps={{ style: { fontSize: '1.4rem' } }}
                            error={!!errors?.express_reason}
                            helperText={errors?.express_reason || ''}
                        />
                    </Stack>

                    <Stack direction="row" alignItems="center" spacing={2}>
                        <Typography sx={{ minWidth: 120, fontSize: '1.4rem' }}>Ngày mong muốn nhận: (*)</Typography>
                        <TextField
                            fullWidth
                            name="expected_receive_date"
                            type="date"
                            value={requestFormData?.express_delivery_request?.expected_receive_date || ''}
                            onChange={handleChange}
                            size="medium"
                            inputProps={{
                                style: { fontSize: '1.4rem' },
                                min: new Date().toISOString().split('T')[0],
                            }}
                            error={!!errors?.expected_receive_date}
                            helperText={errors?.expected_receive_date || ''}
                        />
                    </Stack>
                </>
            )}

            <Stack direction="row" alignItems="center" spacing={2}>
                <Typography sx={{ minWidth: 120, fontSize: '1.4rem' }}>Đơn vị nhận: (*)</Typography>
                <TextField
                    fullWidth
                    name="receiving_unit"
                    value={requestFormData?.express_delivery_request?.receiving_unit || ''}
                    onChange={handleChange}
                    size="medium"
                    inputProps={{ style: { fontSize: '1.4rem' } }}
                    error={!!errors?.receiving_unit}
                    helperText={errors?.receiving_unit || ''}
                    placeholder="Tên công ty/đơn vị nhận"
                />
            </Stack>

            <Stack direction="row" alignItems="flex-start" spacing={2}>
                <Typography sx={{ minWidth: 120, fontSize: '1.4rem', mt: 1 }}>Địa chỉ nhận: (*)</Typography>
                <TextField
                    fullWidth
                    name="receiving_address"
                    multiline
                    minRows={2}
                    maxRows={3}
                    value={requestFormData?.express_delivery_request?.receiving_address || ''}
                    onChange={handleChange}
                    size="medium"
                    inputProps={{ style: { fontSize: '1.4rem' } }}
                    error={!!errors?.receiving_address}
                    helperText={errors?.receiving_address || ''}
                />
            </Stack>

            <Stack direction="row" alignItems="center" spacing={2}>
                <Typography sx={{ minWidth: 120, fontSize: '1.4rem' }}>Tên người nhận: (*)</Typography>
                <TextField
                    fullWidth
                    name="recipient_name"
                    value={requestFormData?.express_delivery_request?.recipient_name || ''}
                    onChange={handleChange}
                    size="medium"
                    inputProps={{ style: { fontSize: '1.4rem' } }}
                    error={!!errors?.recipient_name}
                    helperText={errors?.recipient_name || ''}
                />
            </Stack>

            <Stack direction="row" alignItems="center" spacing={2}>
                <Typography sx={{ minWidth: 120, fontSize: '1.4rem' }}>SĐT người nhận: (*)</Typography>
                <TextField
                    fullWidth
                    name="recipient_phone"
                    value={requestFormData?.express_delivery_request?.recipient_phone || ''}
                    onChange={handleChange}
                    size="medium"
                    inputProps={{
                        style: { fontSize: '1.4rem' },
                        pattern: '[0-9]*',
                        maxLength: 11,
                    }}
                    error={!!errors?.recipient_phone}
                    helperText={errors?.recipient_phone || ''}
                />
            </Stack>
        </Stack>
    );
}

export default ExpressDeliveryForm;
