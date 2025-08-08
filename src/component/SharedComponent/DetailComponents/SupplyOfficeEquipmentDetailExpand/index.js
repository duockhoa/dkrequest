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

    // Format số với dấu phân cách
    const formatNumber = (value) => {
        if (!value || value === 0) return '0';
        return new Intl.NumberFormat('vi-VN').format(value);
    };

    // Tính tổng tiền
    const calculateTotal = () => {
        if (!officeEquipmentRequest) return 0;
        return officeEquipmentRequest.reduce((total, item) => {
            return total + (item.quantity * item.unit_price);
        }, 0);
    };

    if (!officeEquipmentRequest || officeEquipmentRequest.length === 0) {
        return (
            <Typography sx={{ fontSize: '1.4rem', color: 'text.secondary' }}>
                Không có thông tin thiết bị văn phòng
            </Typography>
        );
    }

    const totalAmount = calculateTotal();

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
                            <TableCell sx={{ fontWeight: 'bold', fontSize: '14px', textAlign: 'right' }}>Đơn giá(đ)</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', fontSize: '14px', textAlign: 'right' }}>Thành tiền(đ)</TableCell>
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
                                <TableCell sx={{ fontSize: '14px', textAlign: 'right' }}>
                                    {formatNumber(item.unit_price)}
                                </TableCell>
                                <TableCell sx={{ fontSize: '14px', textAlign: 'right' }}>
                                    {formatNumber(item.quantity * item.unit_price)}
                                </TableCell>
                                <TableCell sx={{ fontSize: '14px' }}>{item.reference_info}</TableCell>
                                <TableCell sx={{ fontSize: '14px' }}>{item.handling_old_equipment}</TableCell>
                            </TableRow>
                        ))}
                        
                        {/* Dòng tổng cộng */}
                        <TableRow>
                            <TableCell 
                                colSpan={6} 
                                sx={{ 
                                    fontWeight: 'bold', 
                                    fontSize: '14px', 
                                    textAlign: 'right',
                                    backgroundColor: '#f5f5f5'
                                }}
                            >
                                TỔNG CỘNG:
                            </TableCell>
                            <TableCell 
                                sx={{ 
                                    fontWeight: 'bold', 
                                    fontSize: '16px', 
                                    textAlign: 'right',
                                    backgroundColor: '#f5f5f5',
                                    color: '#d32f2f'
                                }}
                            >
                                {formatNumber(totalAmount)}
                            </TableCell>
                            <TableCell 
                                colSpan={2} 
                                sx={{ backgroundColor: '#f5f5f5' }}
                            />
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </Stack>
    );
}
