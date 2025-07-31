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
import AdvanceMoneyRequestForm from '../AdvanceMoneyRequestForm';
import SupplyStationeryForm from '../SupplyStationeryForm';
import MeetingRoomRequestForm from '../MeetingRoomRequestForm';
import OtherAttachFile from '../OtherAttachFile';
import RecruitmentForm from '../RecruitmentForm';
import ExpressDeliveryForm from '../ExpressDeliveryForm';
import OfficeEquipmentRepairForm from '../OfficeEquipmentRepairForm';
import OfficeDocumentForm from '../OfficeDocumentForm';
import OfficeEquipmentRequestForm from '../OficceEquimentReuquestForm';
import DocumentEditRequestForm from '../DocumentEditRequestForm';
import AdvanceClearanceForm from '../AdvanceClearanceForm';

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
                    return `${user.name}  ${user.department} đề nghị thanh toán tiền `;
                case 2:
                    return `${user.name}  ${user.department} đề nghị ứng tiền `;
                case 3:
                    return `${user.name}  ${user.department} đề nghị xin nghỉ`;
                case 4: {
                    const now = new Date();
                    let month, year;
                    if (now.getDate() < 15) {
                        month = now.getMonth() + 1;
                        year = now.getFullYear();
                    } else {
                        month = now.getMonth() + 2;
                        if (month > 12) {
                            month = 1;
                            year = now.getFullYear() + 1;
                        } else {
                            year = now.getFullYear();
                        }
                    }
                    return `${user.department} đề nghị cung ứng văn phòng phẩm tháng ${month} năm ${year}`;
                }

                case 7:
                    return `${user.name} ${user.department} đề nghị làm thêm giờ`;

                case 8:
                    return `${user.name} ${user.department} xin xác nhận công việc`;
                case 9:
                    return `${user.name} ${user.department} Đề nghị tuyển dụng nhân sự cho phòng ${user.department}`;
                case 14:
                    return `${user.name} ${user.department} Đề nghị chuẩn bị phòng họp`;
                case 15:
                    return `${user.name} ${user.department} Đề nghị giao hàng nhanh`;
                case 16:
                    return `${user.name} ${user.department} Đề nghị sửa chữa thiết bị văn phòng`;
                case 17:
                    return `${user.name} ${user.department} Đề nghị hỗ trợ công tác văn thư`;
                case 20:
                    return `${user.name} ${user.department} Đề nghị quyết toán tiền tạm ứng`;
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
        if (requestTypeId === 9) {
            requiredFields.push(
                'position',
                'quantity',
                'probation_start_date',
                'probation_salary_text',
                'official_salary_text',
                'recruitment_reason',
                'education_level',
                'major',
                'foreign_language',
                'computer_skill',
                'experience',
                'contract_type',
                'gender',
                'age_range',
                'work_location',
                'working_hours',
            );
        }

        if (requestTypeId === 14) {
            requiredFields.push('usage_date', 'start_time', 'end_time', 'location', 'purpose');
        }
        if (requestTypeId === 4) {
            requiredFields.push('supply_stationery');

            // Kiểm tra xem có mặt hàng nào đang trong edit mode không
            if (requestFormData.supply_stationery && requestFormData.supply_stationery.length > 0) {
                const hasEditingItems = requestFormData.supply_stationery.some((item) => item.isNew === true);
                if (hasEditingItems) {
                    dispatch(
                        setFieldError({
                            field: 'supply_stationery_editing',
                            message: 'Vui lòng lưu tất cả các mặt hàng đang chỉnh sửa trước khi gửi đề xuất!',
                        }),
                    );
                    return false;
                }
            }
        }
        if (requestTypeId === 15) {
            // Các trường bắt buộc cơ bản
            const basicExpressFields = [
                'item_type',
                'item_weight',
                'delivery_method',
                'receiving_unit',
                'receiving_address',
                'recipient_name',
                'recipient_phone',
            ];

            requiredFields.push(...basicExpressFields);

            // Nếu chọn "Gửi hỏa tốc" thì cần thêm 2 trường bắt buộc
            if (
                requestFormData?.express_delivery_request?.delivery_method === 'Gửi hỏa tốc' ||
                requestFormData?.express_delivery_request?.delivery_method === 'Gửi đảm bảo'
            ) {
                requiredFields.push('express_reason', 'expected_receive_date');
            }
        }
        if (requestTypeId === 16) {
            const officeRepairFields = [
                'asset_name',
                'damage_description',
                'damage_location',
                'urgency_level',
                'detected_at',
                'requester_phone',
            ];
            requiredFields.push(...officeRepairFields);
        }
        if (requestTypeId === 17) {
            const officeDocumentFields = [
                'document_type',
                'document_name',
                'issue_date',
                'copy_count',
                'purpose',
                'approved_by',
                'seal_type',
            ];
            requiredFields.push(...officeDocumentFields);
        }
        if (requestTypeId === 18) {
            requiredFields.push('office_equipment_request');
            // Kiểm tra xem có mặt hàng nào đang trong edit mode không
            if (requestFormData.office_equipment_request && requestFormData.office_equipment_request.length > 0) {
                const hasEditingItems = requestFormData.office_equipment_request.some((item) => item.isNew === true);
                if (hasEditingItems) {
                    dispatch(
                        setFieldError({
                            field: 'office_equipment_request_editing',
                            message: 'Vui lòng lưu tất cả các mặt hàng đang chỉnh sửa trước khi gửi đề xuất!',
                        }),
                    );
                    return false;
                }
            }
        }
        if (requestTypeId === 19) {
            requiredFields.push('type', 'document_name', 'reason');
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

            onClose();
        } catch (error) {
            console.error('Error creating request:', error);
        }
        // Reset form data after submission
    };

    return (
        <Box
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
                    inputProps={{ style: { fontSize: '1.4rem', padding: '1px 0px' } }}
                    error={!!errors.requestName}
                    helperText={errors.requestName || ''}
                />
            </Stack>

            {requestTypeId === 1 ? <PaymentRequestForm /> : ''}
            {requestTypeId === 2 ? <AdvanceMoneyRequestForm /> : ''}
            {requestTypeId === 3 ? <LeaveRequestForm /> : ''}
            {requestTypeId === 4 ? <SupplyStationeryForm /> : ''}
            {requestTypeId === 7 ? <OverTimeRequestForm /> : ''}
            {requestTypeId === 8 ? <TaskConfirm /> : ''}
            {requestTypeId === 9 ? <RecruitmentForm /> : ''}
            {requestTypeId === 14 ? <MeetingRoomRequestForm /> : ''}
            {requestTypeId === 15 ? <ExpressDeliveryForm /> : ''}
            {requestTypeId === 16 ? <OfficeEquipmentRepairForm /> : ''}
            {requestTypeId === 17 ? <OfficeDocumentForm /> : ''}
            {requestTypeId === 18 ? <OfficeEquipmentRequestForm /> : ''}
            {requestTypeId === 19 ? <DocumentEditRequestForm /> : ''}
            {requestTypeId === 20 ? <AdvanceClearanceForm /> : ''}
            {/* Hiển thị lỗi chung cho supply_stationery */}
            {errors?.supply_stationery_editing && (
                <Box
                    sx={{
                        p: 2,
                        mb: 2,
                        border: '1px solid #f44336',
                        borderRadius: 1,
                        backgroundColor: '#ffebee',
                        color: '#d32f2f',
                        fontSize: '14px',
                        textAlign: 'center',
                    }}
                >
                    {errors.supply_stationery_editing}
                </Box>
            )}
            {errors?.office_equipment_request_editing && (
                <Box
                    sx={{
                        p: 2,
                        mb: 2,
                        border: '1px solid #f44336',
                        borderRadius: 1,
                        backgroundColor: '#ffebee',
                        color: '#d32f2f',
                        fontSize: '14px',
                        textAlign: 'center',
                    }}
                >
                    {errors.office_equipment_request_editing}
                </Box>
            )}
            <Stack direction="row" alignItems="flex-start" spacing={2}>
                <Typography sx={{ minWidth: 120, fontSize: '1.4rem' }}>Mô tả ( nếu có):</Typography>
                <TextField
                    fullWidth
                    name="description"
                    value={requestFormData.description}
                    onChange={handleChange}
                    size="medium"
                    multiline
                    inputProps={{ style: { fontSize: '1.3rem', padding: '1px 0px' } }}
                    error={!!errors.description}
                    helperText={errors.description || ''}
                />
            </Stack>

            <RequestFollowers />
            <OtherAttachFile />
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
                    onClick={handleSubmit}
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
