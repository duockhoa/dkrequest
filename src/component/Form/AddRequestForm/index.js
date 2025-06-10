import { Box, TextField, Typography, Stack, FormControl, Button } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { setRequestFormData } from '../../../redux/slice/requestFormDataSlice';
import RequestFollowers from '../RequestFollowers';
import LeaveRequestForm from '../LeaveRequestForm';
import { useEffect } from 'react';
import RequestApprovers from '../RequestApprovers';
import { createRequestService } from '../../../services/requestService';
import { fetchRequests } from '../../../redux/slice/requestSlice';

function AddRequestForm({ onClose }) {
    const requestTypeId = useSelector((state) => state.sidebar.requestTypeId);
    const requestFormData = useSelector((state) => state.requestFormData.value);
    const user = useSelector((state) => state.user.userInfo);
    const dispatch = useDispatch();

    // Handle change for input fields
    const handleChange = (e) => {
        dispatch(
            setRequestFormData({
                ...requestFormData,
                requestor_id: user.id,
                requestType_id: requestTypeId,
                [e.target.name]: e.target.value,
            }),
        );
    };

    // Reset form data when opened
    useEffect(() => {
        const requestName = () => {
            switch (requestTypeId) {
                case 3:
                    return `${user.name} Xin nghỉ`;
                case 2:
                    return 'Đề xuất mua sắm';
                case 1:
                    return 'Đề nghị thanh toán';
                default:
                    return '';
            }
        };

        dispatch(
            setRequestFormData({
                requestName: requestName(),
                requestType_id: requestTypeId,
                requestor_id: user.id,
                followers: [],
                approvers: [],
            }),
        );
    }, [requestTypeId, user.id, user.name, dispatch]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await createRequestService(requestFormData);
            console.log('Request created successfully:', response);
            dispatch(fetchRequests(requestTypeId));
            onClose();
        } catch (error) {
            console.error('Error creating request:', error);
        }
    };

    return (
        <FormControl
            component="form"
            onSubmit={handleSubmit}
            noValidate
            autoComplete="off"
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2.5,
                width: '100%',
                margin: '0 auto',
                backgroundColor: 'background.paper',
                padding: 3,
                borderRadius: 2,
                boxShadow: 2,
            }}
        >
            <Typography variant="h4" textAlign={'center'} sx={{ fontSize: '2.5rem' }}>
                Thêm đề xuất mới
            </Typography>

            <Stack direction="row" alignItems="center" spacing={2}>
                <Typography sx={{ minWidth: 120, fontSize: '1.4rem' }}>Tên đề xuất</Typography>
                <TextField
                    fullWidth
                    name="requestName"
                    value={requestFormData.requestName}
                    onChange={handleChange}
                    size="medium"
                    required
                    inputProps={{ style: { fontSize: '1.4rem' } }}
                />
            </Stack>

            {requestTypeId === 3 ? <LeaveRequestForm /> : ''}

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
        </FormControl>
    );
}

export default AddRequestForm;
