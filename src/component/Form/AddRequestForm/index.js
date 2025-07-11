import { Box, TextField, Typography, Stack, Button } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { setRequestFormData } from '../../../redux/slice/requestFormDataSlice';
import RequestFollowers from '../RequestFollowers';
import LeaveRequestForm from '../LeaveRequestForm';
import { useEffect } from 'react';
import RequestApprovers from '../RequestApprovers';
import { setRequestData } from '../../../redux/slice/requestSlice';
import { setFieldError, clearErrors } from '../../../redux/slice/requestFormDataSlice';
import { flattenObject } from '../../../hooks/flattenObject';
import OverTimeRequestForm from '../OverTimeRequestForm';
import TaskConfirm from '../TaskConfirmForm';
import PaymentRequestForm from '../PaymentRequestForm';
import objectToFormData from '../../../utils/makeFromDataFromObject';
import { fetchCreateRequest } from '../../../redux/slice/requestFormDataSlice';
import { fetchNotifications } from '../../../redux/slice/notificationSlice';
import AdvanceMoneyRequestForm from '../AdvanceMoneyRequestForm';
import SupplyStationeryForm from '../SupplyStationeryForm';

function AddRequestForm({ onClose }) {
    const requestTypeId = useSelector((state) => state.requestId.requestTypeId);
    const requestFormData = useSelector((state) => state.requestFormData.value);
    const user = useSelector((state) => state.user.userInfo);
    const requestData = useSelector((state) => state.request.requestData);
    const errors = useSelector((state) => state.requestFormData.errors);
    const dispatch = useDispatch();

    // Handle change for input fields
    const handleChange = (e) => {
        // Lưu giá trị mới (kể cả khi rỗng)
        dispatch(
            setRequestFormData({
                ...requestFormData,
                requestor_id: user.id,
                requestType_id: requestTypeId,
                [e.target.name]: e.target.value, // Gán giá trị mới (có thể là chuỗi rỗng)
            }),
        );
        dispatch(clearErrors()); // Xóa lỗi trước khi kiểm tra mới
        // Kiểm tra validation sau khi đã cập nhật giá trị
        if (!e.target.value.trim() && e.target.required) {
            dispatch(setFieldError({ field: e.target.name, message: 'Trường này không được để trống' }));
        } else {
            dispatch(setFieldError({ field: e.target.name, message: '' }));
        }
    };

    // Reset form data when opened
    useEffect(() => {
        const requestName = () => {
            switch (requestTypeId) {
                case 1:
                    return `${user.name} đề nghị thanh toán tiền `;
                case 2:
                    return `${user.name} đề nghị ứng tiền `;
                case 3:
                    return `${user.name} đề nghị xin nghỉ`;
                case 4:
                    return `${user.department} đề nghị cung ứng văn phòng phẩm tháng ${
                        new Date().getMonth() + 2
                    } năm ${new Date().getFullYear()}`;

                case 7:
                    return `${user.name} đề nghị làm thêm giờ`;

                case 8:
                    return `${user.name}  xin xác nhận công việc`;
                case 9:
                    return `${user.name} Đề nghị tuyển dụng nhân sự cho phòng ${user.department}`;
                default:
                    return '';
            }
        };

        console.log(requestFormData);

        dispatch(
            setRequestFormData({
                ...requestFormData,
                requestName: requestName(),
                requestType_id: requestTypeId,
                requestor_id: user.id,
                followers: [],
                approvers: [],
            }),
        );
    }, [requestTypeId, user.id, user.name, dispatch]);

    const validateForm = () => {
        const requiredFields = ['requestName', 'requestor_id', 'requestType_id'];

        if (requestTypeId === 1) {
            requiredFields.push('payment_type', 'payment_content', 'pay_to', 'amount', 'due_date');
        }
        if (requestTypeId === 2) {
            requiredFields.push('reason', 'address', 'amount', 'due_date');
        }

        if (requestTypeId === 3) {
            requiredFields.push('reason', 'start_time', 'end_time', 'hours', 'hoursText');
        }

        if (requestTypeId === 7) {
            requiredFields.push('start_time', 'end_time', 'hours', 'reason', 'hoursText');
        }
        if (requestTypeId === 8) {
            requiredFields.push('start_time', 'end_time', 'hours', 'reason', 'hoursText');
        }

        const flattenedData = flattenObject(requestFormData);
        let isValid = true;
        let errors = {};
        // Validate only basic required fields
        requiredFields.forEach((field) => {
            if (!flattenedData[field] || (typeof flattenedData[field] === 'string' && !flattenedData[field].trim())) {
                errors[field] = 'Trường này không được bỏ trống';
                isValid = false;
            }
        });

        // Dispatch all errors at once
        Object.keys(errors).forEach((field) => {
            dispatch(setFieldError({ field, message: errors[field] }));
        });
        console.error('Validation errors:', errors);
        return isValid;
    };

    // Update handleSubmit to use validateForm
    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!validateForm()) {
            return;
        }
        // Convert requestFormData to FormData
        const formData = objectToFormData(requestFormData);

        try {
            const response = await dispatch(fetchCreateRequest(formData));
            dispatch(setRequestData([response.payload, ...requestData])); // Update request data in the store
            dispatch(setRequestFormData({})); // Clear form data in the store
            dispatch(fetchNotifications(user.id)); // Fetch notifications after creating request
            onClose();
        } catch (error) {
            console.error('Error creating request:', error);
        }
        // Reset form data after submission
    };

    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            autoComplete="off"
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 1.5,
                width: '100%',
                margin: '0 auto',
                backgroundColor: 'background.paper',
                padding: 2,
                borderRadius: 2,
                boxShadow: 1,
            }}
        >
            <Typography variant="h4" textAlign={'center'} sx={{ fontSize: '2.5rem' }} color="primary.main">
                THÊM ĐỀ XUẤT MỚI
            </Typography>

            <Stack direction="row" alignItems="center" spacing={2}>
                <Typography sx={{ minWidth: 120, fontSize: '1.4rem' }}>Tên đề xuất (*)</Typography>
                <TextField
                    fullWidth
                    name="requestName"
                    value={requestFormData.requestName}
                    onChange={handleChange}
                    size="medium"
                    required
                    multiline
                    inputProps={{ style: { fontSize: '1.4rem' } }}
                    error={!!errors.requestName}
                    helperText={errors.requestName || ''}
                />
            </Stack>

            {requestTypeId === 3 ? <LeaveRequestForm /> : ''}
            {requestTypeId === 4 ? <SupplyStationeryForm /> : ''}
            {requestTypeId === 7 ? <OverTimeRequestForm /> : ''}
            {requestTypeId === 8 ? <TaskConfirm /> : ''}
            {requestTypeId === 1 ? <PaymentRequestForm /> : ''}
            {requestTypeId === 2 ? <AdvanceMoneyRequestForm /> : ''}
            <Stack direction="row" alignItems="flex-start" spacing={2}>
                <Typography sx={{ minWidth: 120, fontSize: '1.4rem' }}>Mô tả ( nếu có):</Typography>
                <TextField
                    fullWidth
                    name="description"
                    value={requestFormData.description}
                    onChange={handleChange}
                    size="medium"
                    multiline
                    rows={1}
                    inputProps={{ style: { fontSize: '1.4rem' } }}
                    error={!!errors.description}
                    helperText={errors.description || ''}
                />
            </Stack>

            <RequestFollowers />
            <RequestApprovers />

            <Stack
                direction="row"
                spacing={2}
                sx={{
                    mt: 2,
                    justifyContent: 'center',
                }}
            >
                <Button
                    fullWidth
                    variant="outlined"
                    onClick={onClose}
                    sx={{
                        py: 0.8,
                        maxWidth: 150,
                        textTransform: 'none',
                        color: 'error.main',
                        borderColor: 'error.main',
                        fontSize: '1.4rem',
                        '&:hover': {
                            borderColor: 'error.dark',
                            bgcolor: 'error.lighter',
                        },
                    }}
                >
                    Hủy
                </Button>
                <Button
                    fullWidth
                    type="submit"
                    variant="contained"
                    sx={{
                        py: 0.8,
                        maxWidth: 150,
                        textTransform: 'none',
                        fontSize: '1.4rem',
                    }}
                    color="primary"
                >
                    Thêm mới
                </Button>
            </Stack>
        </Box>
    );
}

export default AddRequestForm;
