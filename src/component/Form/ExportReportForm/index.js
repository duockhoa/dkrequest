import { useState } from 'react';
import { Box, Button, Stack, TextField, Typography, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { useSelector } from 'react-redux';
import { exportsReportService } from '../../../services/exportsFileService';
const statusOptions = ['Tất cả', 'Đang chờ duyệt', 'Đã chấp nhận', 'Đã từ chối'];

const statusMap = {
    'Tất cả': 'all',
    'Đang chờ duyệt': 'pending',
    'Đã chấp nhận': 'approved',
    'Đã từ chối': 'rejected',
};

function ExportReportForm({ onClose }) {
    const userInfo = useSelector((state) => state.user.userInfo);
    const requestTypeId = useSelector((state) => state.requestId.requestTypeId);

    const [formData, setFormData] = useState({
        startDate: '',
        endDate: '',
        status: 'all', // Thêm trường trạng thái mặc định
    });
    const handleSubmit = async (event) => {
        event.preventDefault();
        await exportsReportService({
            ...formData,
            userId: userInfo.id,
            requestTypeId: requestTypeId,
        });
        onClose(); // Close the form after submission
        // Handle form submission logic here
    };
    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
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
                XUẤT BÁO CÁO
            </Typography>
            {/* Thêm trường chọn trạng thái ở đây */}
            <Stack direction="row" alignItems="center" spacing={2}>
                <Typography sx={{ minWidth: 120, fontSize: '1.4rem' }}>Từ ngày: (*)</Typography>
                <TextField
                    fullWidth
                    name="startDate"
                    required
                    type="date"
                    value={formData.startDate || ''}
                    onChange={handleChange}
                    size="medium"
                    inputProps={{
                        style: { fontSize: '1.4rem' },
                    }}
                    error={!formData.startDate}
                    helperText={!formData.startDate ? 'Ngày bắt đầu không được để trống' : ''}
                />
            </Stack>
            <Stack direction="row" alignItems="center" spacing={2}>
                <Typography sx={{ minWidth: 120, fontSize: '1.4rem' }}>Đến ngày: (*)</Typography>
                <TextField
                    fullWidth
                    name="endDate"
                    type="date"
                    required
                    value={formData.endDate || ''}
                    onChange={handleChange}
                    size="medium"
                    inputProps={{
                        style: { fontSize: '1.4rem' },
                    }}
                    error={!formData.endDate || formData.endDate < formData.startDate}
                    helperText={
                        !formData.endDate || formData.endDate < formData.startDate
                            ? 'Ngày kết thúc phải lớn hơn hoặc bằng ngày bắt đầu'
                            : ''
                    }
                />
            </Stack>
            <Stack direction="row" alignItems="center" spacing={2}>
                <Typography sx={{ minWidth: 120, fontSize: '1.4rem' }}>Trạng thái:</Typography>
                <FormControl fullWidth size="medium">
                    <InputLabel id="status-label" sx={{ fontSize: '1.4rem' }}>
                        Trạng thái
                    </InputLabel>
                    <Select
                        labelId="status-label"
                        name="status"
                        value={formData.status}
                        label="Trạng thái"
                        onChange={handleChange}
                        sx={{ fontSize: '1.4rem' }}
                    >
                        {statusOptions.map((option) => (
                            <MenuItem key={option} value={statusMap[option]} sx={{ fontSize: '1.4rem' }}>
                                {option}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
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
                    Xuất Báo Cáo
                </Button>
            </Stack>
        </Box>
    );
}

export default ExportReportForm;
