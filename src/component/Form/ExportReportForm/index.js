import { useRef, useState } from 'react';
import { Box, Button, Stack, TextField, Typography, Select, MenuItem, FormControl, InputLabel, Alert } from '@mui/material';
import { useSelector } from 'react-redux';
import { exportsReportService } from '../../../services/exportsFileService';
import { FUEL_REPORT_TYPE, buildFuelReportPayload, getVietnamReportMonth } from '../../../utils/fuelPayment';
const statusOptions = ['Tất cả', 'Đang chờ duyệt', 'Đã chấp nhận', 'Đã từ chối'];

const statusMap = {
    'Tất cả': 'all',
    'Đang chờ duyệt': 'pending',
    'Đã chấp nhận': 'approved',
    'Đã từ chối': 'rejected',
};

function ExportReportForm({ onClose, allowGeneralReport = true }) {
    const userInfo = useSelector((state) => state.user.userInfo);
    const requestTypeId = useSelector((state) => state.requestId.requestTypeId);

    const [formData, setFormData] = useState({
        startDate: '',
        endDate: '',
        status: 'all', // Thêm trường trạng thái mặc định
    });
    const [reportType, setReportType] = useState(allowGeneralReport ? 'general' : FUEL_REPORT_TYPE);
    const [reportMonth, setReportMonth] = useState(getVietnamReportMonth);
    const [exporting, setExporting] = useState(false);
    const [error, setError] = useState('');
    const exportInFlight = useRef(false);
    const isFuelReport = requestTypeId === 1 && reportType === FUEL_REPORT_TYPE;

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (exportInFlight.current) return;
        setError('');
        try {
            let payload;
            if (isFuelReport) {
                payload = buildFuelReportPayload(reportMonth);
            } else {
                if (!allowGeneralReport) throw new Error('Bạn không có quyền xuất báo cáo chung');
                if (!formData.startDate || !formData.endDate || formData.endDate < formData.startDate) {
                    throw new Error('Chọn đầy đủ khoảng ngày hợp lệ để xuất báo cáo');
                }
                payload = { ...formData, userId: userInfo.id, requestTypeId };
            }
            exportInFlight.current = true;
            setExporting(true);
            await exportsReportService(payload);
            onClose();
        } catch (exportError) {
            setError(exportError.message || 'Không thể xuất báo cáo. Vui lòng thử lại.');
        } finally {
            exportInFlight.current = false;
            setExporting(false);
        }
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
            {error && <Alert severity="error">{error}</Alert>}
            {requestTypeId === 1 && (
                <FormControl fullWidth disabled={exporting}>
                    <InputLabel id="report-type-label">Loại báo cáo</InputLabel>
                    <Select
                        labelId="report-type-label"
                        name="reportType"
                        label="Loại báo cáo"
                        value={reportType}
                        onChange={(event) => {
                            setReportType(event.target.value);
                            setError('');
                        }}
                        sx={{ fontSize: '1.4rem' }}
                    >
                        {allowGeneralReport && <MenuItem value="general">Báo cáo chung</MenuItem>}
                        <MenuItem value={FUEL_REPORT_TYPE}>Báo cáo thanh toán xăng dầu</MenuItem>
                    </Select>
                </FormControl>
            )}
            {isFuelReport ? (
                <>
                    <TextField
                        fullWidth
                        required
                        name="reportMonth"
                        label="Tháng báo cáo"
                        type="month"
                        value={reportMonth}
                        disabled={exporting}
                        onChange={(event) => {
                            setReportMonth(event.target.value);
                            setError('');
                        }}
                        inputProps={{ min: '2026-10', style: { fontSize: '1.4rem' } }}
                        InputLabelProps={{ shrink: true }}
                        helperText="Áp dụng từ tháng 10/2026"
                    />
                    <Typography sx={{ fontSize: '1.4rem' }}>
                        Tổng hợp theo từng người đề nghị các hồ sơ xăng dầu được duyệt hoàn tất
                        trong tháng, gồm cả hồ sơ chưa tiếp nhận và chưa hoàn thành.
                        Hồ sơ hủy hoặc từ chối không được cộng vào tổng.
                    </Typography>
                </>
            ) : (
                <>
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
                </>
            )}
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
                    disabled={exporting}
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
                    disabled={exporting}
                    variant="contained"
                    sx={{
                        py: 0.8,
                        maxWidth: 150,
                        textTransform: 'none',
                        fontSize: '1.4rem',
                    }}
                    color="primary"
                >
                    {exporting ? 'Đang xuất...' : 'Xuất báo cáo'}
                </Button>
            </Stack>
        </Box>
    );
}

export default ExportReportForm;
