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
} from '@mui/material';
import { useSelector } from 'react-redux';

export default function SupplyOfficeEquipmentDetailExpand() {
    const requestDetail = useSelector((state) => state.requestDetail.requestDetailvalue);

    // Lấy danh sách thiết bị văn phòng
    const officeEquipmentRequest = requestDetail?.officeEquipmentRequest;

    if (!officeEquipmentRequest || officeEquipmentRequest.length === 0) {
        return (
            <Typography sx={{ fontSize: '1.4rem', color: 'text.secondary' }}>
                Không có thông tin thiết bị văn phòng
            </Typography>
        );
    }

    return (
        <Stack sx={{ position: 'relative', mt: 2, p: 3, minHeight: '300px' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1, fontSize: '1.4rem', textAlign: 'center' }}>
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
                            <TableCell sx={{ fontWeight: 'bold', fontSize: '14px' }}>Thông tin tham khảo</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', fontSize: '14px' }}>Hướng dẫn XL TB cũ</TableCell>
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
                                <TableCell sx={{ fontSize: '14px' }}>{item.reference_info}</TableCell>
                                <TableCell sx={{ fontSize: '14px' }}>{item.handling_old_equipment}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Stack>
    );
}
