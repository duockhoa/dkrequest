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
import InvoiceRequestDetailExpand from '../InvoiceRequestDetailExpand';
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

export default function InvoiceRequestDetail() {
    const requestDetail = useSelector((state) => state.requestDetail.requestDetailvalue);
    const [openExpand, setOpenExpand] = useState(false);

    const invoiceRequest = requestDetail?.invoiceRequest;

    if (!invoiceRequest || invoiceRequest.length === 0) {
        return <Typography sx={{ fontSize: '1.4rem', color: 'text.secondary' }}>Thông tin xuất hóa đơn</Typography>;
    }

    const handleExpand = () => {
        setOpenExpand(true);
    };

    const handleCloseExpand = () => {
        setOpenExpand(false);
    };

    return (
        <Stack sx={{ position: 'relative', mt: 2 }}>
            <DetailItem label="Tên khách hàng" value={invoiceRequest.customer_name || '-'} />
            <DetailItem label="Địa chỉ" value={invoiceRequest.customer_address || '-'} />
            <DetailItem label="Mã số thuế" value={invoiceRequest.customer_tax_code || '-'} />
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1, fontSize: '1.4rem' }}>
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
                            <TableCell sx={{ fontWeight: 'bold', fontSize: '14px' }}>Mặt hàng</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', fontSize: '14px' }}>Số lượng</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', fontSize: '14px' }}>Đơn giá(Chưa VAT)</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', fontSize: '14px' }}>Ghi chú</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {invoiceRequest.items.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell sx={{ fontSize: '14px' }}>{item.product_name}</TableCell>
                                <TableCell sx={{ fontSize: '14px' }}>{item.quantity}</TableCell>
                                <TableCell sx={{ fontSize: '14px' }}>{item.unit_price}</TableCell>
                                <TableCell sx={{ fontSize: '14px' }}>{item.note}</TableCell>
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
                <InvoiceRequestDetailExpand />
            </Dialog>
        </Stack>
    );
}
