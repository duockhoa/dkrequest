import {
    Stack,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Dialog,
} from '@mui/material';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import VehicleRequestDetailExpand from '../VehicleRequestDetailExpand';

const DetailItem = ({ label, value }) => (
    <Stack direction="row" spacing={2} sx={{ py: 1 }}>
        <Typography
            sx={{
                minWidth: 120,
                maxWidth: 120,
                color: 'text.secondary',
                fontSize: '1.4rem',
                wordWrap: 'break-word',
                whiteSpace: 'normal',
                flexShrink: 1,
            }}
        >
            {label}:
        </Typography>
        <Typography
            sx={{
                fontSize: '1.4rem',
                flex: 1,
                wordWrap: 'break-word',
            }}
        >
            {value}
        </Typography>
    </Stack>
);

export default function VehicleRequestDetail() {
    const requestDetail = useSelector((state) => state.requestDetail.requestDetailvalue);
    const [openExpand, setOpenExpand] = useState(false);

    const vehicleRequest = requestDetail?.vehicleRequest;

    if (!vehicleRequest) {
        return <Typography sx={{ fontSize: '1.4rem', color: 'text.secondary' }}>Không có thông tin</Typography>;
    }

    const handleExpand = () => {
        setOpenExpand(true);
    };

    const handleCloseExpand = () => {
        setOpenExpand(false);
    };

    // Hàm format datetime
    const formatDateTime = (dateTimeString) => {
        if (!dateTimeString) return '-';
        try {
            const date = new Date(dateTimeString);
            return date.toLocaleString('vi-VN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
            });
        } catch (error) {
            return dateTimeString;
        }
    };

    return (
        <Stack sx={{ position: 'relative', mt: 0 }}>
            <DetailItem label="Lý do" value={vehicleRequest.reason || '-'} />
            <DetailItem label="Tuyến đường" value={vehicleRequest.route || '-'} />
            <DetailItem label="Số km" value={vehicleRequest.estimated_km + ' km'} />
            <DetailItem label="Địa điểm đón" value={vehicleRequest.pickup_location} />
            <DetailItem label="Địa điểm trả" value={vehicleRequest.dropoff_location} />
            <DetailItem label="Thời gian khởi hành" value={formatDateTime(vehicleRequest.departure_time)} />
            <DetailItem label="Thời gian về" value={formatDateTime(vehicleRequest.return_time)} />
            <DetailItem label="Loại tài xế" value={vehicleRequest.driver_option || '-'} />
            <DetailItem label="Số người tham gia" value={vehicleRequest.participant_count || '-'} />

            {/* Danh sách di chuyển */}
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1, mt: 3, fontSize: '1.4rem' }}>
                DANH SÁCH ĐĂNG KÝ ({vehicleRequest.passengers?.length || 0} người)
            </Typography>

            <TableContainer
                component={Paper}
                sx={{
                    boxShadow: 2,
                    position: 'relative',
                }}
            >
                <Table
                    size="small"
                    sx={{
                        border: '1px solid #bdbdbd',
                        '& th, & td': {
                            border: '1px solid #bdbdbd',
                        },
                        borderCollapse: 'collapse',
                    }}
                >
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold', fontSize: '14px' }}>Họ Và Tên</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', fontSize: '14px' }}>Bộ phận</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', fontSize: '14px' }}>Ghi chú</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {vehicleRequest.passengers?.map((passenger) => (
                            <TableRow key={passenger.id}>
                                <TableCell sx={{ fontSize: '14px' }}>{passenger.full_name}</TableCell>
                                <TableCell sx={{ fontSize: '14px' }}>{passenger.department || '-'}</TableCell>
                                <TableCell sx={{ fontSize: '14px' }}>{passenger.notes || '-'}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                {/* Nút mở rộng ở góc dưới phải */}
                <IconButton
                    size="small"
                    onClick={handleExpand}
                    sx={{
                        position: 'absolute',
                        bottom: 8,
                        right: 8,
                        background: '#fff',
                        border: '1px solid #1976d2',
                        boxShadow: 1,
                        zIndex: 2,
                        '&:hover': {
                            background: '#e3f2fd',
                        },
                    }}
                >
                    <OpenInFullIcon fontSize="small" color="primary" />
                </IconButton>
            </TableContainer>

            <Dialog open={openExpand} onClose={handleCloseExpand} maxWidth="lg" fullWidth>
                <VehicleRequestDetailExpand />
            </Dialog>
        </Stack>
    );
}
