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
import SupplyOfficeEquipmentDetailExpand from '../SupplyOfficeEquipmentDetailExpand';

export default function SupplyOfficeEquipmentDetail() {
    const requestDetail = useSelector((state) => state.requestDetail.requestDetailvalue);
    const [openExpand, setOpenExpand] = useState(false);

    // Lấy danh sách thiết bị văn phòng
    const officeEquipmentRequest = requestDetail?.officeEquipmentRequest;

    if (!officeEquipmentRequest || officeEquipmentRequest.length === 0) {
        return (
            <Typography sx={{ fontSize: '1.4rem', color: 'text.secondary' }}>
                Không có thông tin thiết bị văn phòng
            </Typography>
        );
    }

    const handleExpand = () => setOpenExpand(true);
    const handleCloseExpand = () => setOpenExpand(false);

    return (
        <Stack sx={{ position: 'relative', mt: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1, fontSize: '1.4rem' }}>
                DANH SÁCH THIẾT BỊ VĂN PHÒNG
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
                            <TableCell sx={{ fontWeight: 'bold', fontSize: '14px' }}>STT</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', fontSize: '14px' }}>Tên thiết bị</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', fontSize: '14px' }}>Lý do cung ứng</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', fontSize: '14px' }}>Số lượng</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', fontSize: '14px' }}>Đơn vị</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {officeEquipmentRequest.map((item, idx) => (
                            <TableRow key={item.id}>
                                <TableCell sx={{ fontSize: '14px' }}>{idx + 1}</TableCell>
                                <TableCell sx={{ fontSize: '14px' }}>{item.name}</TableCell>
                                <TableCell sx={{ fontSize: '14px' }}>{item.reason}</TableCell>
                                <TableCell sx={{ fontSize: '14px' }}>{item.quantity}</TableCell>
                                <TableCell sx={{ fontSize: '14px' }}>{item.unit}</TableCell>
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
                <SupplyOfficeEquipmentDetailExpand />
            </Dialog>
        </Stack>
    );
}
