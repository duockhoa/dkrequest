import { Stack, Typography, TextField, Box, Button } from '@mui/material';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createNewItem, updateItem } from '../../../services/itemsService';
import { fetchItems } from '../../../redux/slice/itemsSlice';

function ItemsForm({ initialValues, onClose, type }) {
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        product_code: initialValues?.product_code || '',
        product_name: initialValues?.product_name || '',
        unit: initialValues?.unit || '',
        user_id: initialValues?.user_id || '',
    });

    // Cập nhật lại formData khi initialValues thay đổi (khi edit)
    useEffect(() => {
        if (initialValues) {
            setFormData({
                product_code: initialValues.product_code || '',
                product_name: initialValues.product_name || '',
                unit: initialValues.unit || '',
                user_id: initialValues.user_id || '',
            });
        } else {
            setFormData({
                product_code: '',
                product_name: '',
                unit: '',
                user_id: '',
            });
        }
    }, [initialValues]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        let response;
        if (type === 'edit') {
            response = await updateItem(formData); // Đảm bảo updateItem nhận đủ thông tin
        } else {
            response = await createNewItem(formData);
        }
        if (response) {
            onClose();
            dispatch(fetchItems());
        } else {
            console.error('Failed to save item');
        }
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
                {type === 'edit' ? 'CHỈNH SỬA' : 'THÊM'} HÀNG HÓA
            </Typography>

            <Stack direction="row" alignItems="center" spacing={2}>
                <Typography sx={{ minWidth: 120, fontSize: '1.4rem' }}>Mã Hàng</Typography>
                <TextField
                    fullWidth
                    name="product_code"
                    value={formData.product_code}
                    onChange={handleChange}
                    disabled
                    size="medium"
                    type="text"
                    inputProps={{ style: { fontSize: '1.4rem' }, readOnly: type === 'edit' }}
                />
            </Stack>
            <Stack direction="row" alignItems="center" spacing={2}>
                <Typography sx={{ minWidth: 120, fontSize: '1.4rem' }}>Tên hàng</Typography>
                <TextField
                    fullWidth
                    name="product_name"
                    required
                    value={formData.product_name}
                    onChange={handleChange}
                    size="medium"
                    type="text"
                    inputProps={{ style: { fontSize: '1.4rem' } }}
                />
            </Stack>
            <Stack direction="row" alignItems="center" spacing={2}>
                <Typography sx={{ minWidth: 120, fontSize: '1.4rem' }}>Đơn vị tính</Typography>
                <TextField
                    fullWidth
                    name="unit"
                    required
                    value={formData.unit}
                    onChange={handleChange}
                    size="medium"
                    type="text"
                    inputProps={{ style: { fontSize: '1.4rem' } }}
                />
            </Stack>

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
                    {type === 'edit' ? 'Cập nhật' : 'Thêm mới'}
                </Button>
            </Stack>
        </Box>
    );
}

export default ItemsForm;
