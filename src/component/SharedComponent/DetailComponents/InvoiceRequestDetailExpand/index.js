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

export default function InvoiceRequestDetailExpand() {
    const requestDetail = useSelector((state) => state.requestDetail.requestDetailvalue);

    // Lấy danh sách văn phòng phẩm
    const invoiceRequest = requestDetail?.invoiceRequest?.items;

    if (!invoiceRequest || invoiceRequest.length === 0) {
        return (
            <Typography sx={{ fontSize: '1.4rem', color: 'text.secondary' }}>
                Thông tin xuất hóa đơn
            </Typography>
        );
    }

    // Hàm tính thành tiền cho từng dòng
    const calcAmount = (item) => {
        const quantity = Number(item.quantity) || 0;
        const unit_price = Number(item.unit_price) || 0;
        return quantity * unit_price ;
    };

    // Tổng giá trị
    const totalAmount = invoiceRequest.reduce((sum, item) => sum + calcAmount(item), 0);

    return (
        <Stack sx={{ position: 'relative', mt: 2, p: 3, minHeight: '300px' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1, fontSize: '1.4rem', textAlign: 'center' }}>
                DANH SÁCH HÀNG HÓA XUẤT HÓA ĐƠN
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
                            <TableCell sx={{ fontWeight: 'bold', fontSize: '14px' }}>Mã hàng</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', fontSize: '14px' }}>Tên hàng</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', fontSize: '14px' }}>Số lượng</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', fontSize: '14px' }}>Đơn vị tính</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', fontSize: '14px' }}>Đơn giá(cả VAT)</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', fontSize: '14px' }}>Thuế suất(%)</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', fontSize: '14px' }}>Thành tiền</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', fontSize: '14px' }}>Ghi chú</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {invoiceRequest.map((item, idx) => (
                            <TableRow key={item.id}>
                                <TableCell sx={{ fontSize: '14px' }}>{idx + 1}</TableCell>
                                <TableCell sx={{ fontSize: '14px' }}>{item.product_code}</TableCell>
                                <TableCell sx={{ fontSize: '14px' }}>{item.product_name}</TableCell>
                                <TableCell sx={{ fontSize: '14px' }}>{item.quantity}</TableCell>
                                <TableCell sx={{ fontSize: '14px' }}>{item.unit}</TableCell>
                                <TableCell sx={{ fontSize: '14px' }}>{item.unit_price}</TableCell>
                                <TableCell sx={{ fontSize: '14px' }}>{item.tax_rate}</TableCell>
                                <TableCell sx={{ fontSize: '14px' }}>{calcAmount(item).toLocaleString()}</TableCell>
                                <TableCell sx={{ fontSize: '14px' }}>{item.note}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                    {/* Tổng giá trị */}
                    <tfoot>
                        <TableRow>
                            <TableCell colSpan={8} sx={{ fontWeight: 'bold', fontSize: '14px', textAlign: 'right' }}>
                                Tổng giá trị
                            </TableCell>
                            <TableCell sx={{ fontWeight: 'bold', fontSize: '14px', color: 'red' }}>
                                {totalAmount.toLocaleString()}
                            </TableCell>
                            <TableCell />
                        </TableRow>
                    </tfoot>
                </Table>
            </TableContainer>
        </Stack>
    );
}
