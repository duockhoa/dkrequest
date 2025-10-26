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
    Fab,
    Dialog,
} from '@mui/material';
import { useSelector } from 'react-redux';
import EditSupplyStationery from '../../../Form/EditSupplyStationery';
import { useState } from 'react';
import { Edit } from '@mui/icons-material';

export default function SupplyStationeryDetailExpand() {
    const [openDialog, setOpenDialog] = useState(false);
    const handleOpenDialog = () => {
        setOpenDialog(true);
    };
    const handleCloseDialog = () => {
        setOpenDialog(false);
    };
    const requestDetail = useSelector((state) => state.requestDetail.requestDetailvalue);
    const userInfo = useSelector((state) => state.user.userInfo);

    // Lấy danh sách văn phòng phẩm
    const supplyStationery = requestDetail?.supplyStationery;

    if (!supplyStationery || supplyStationery.length === 0) {
        return (
            <Typography sx={{ fontSize: '1.4rem', color: 'text.secondary' }}>
                Không có thông tin văn phòng phẩm
            </Typography>
        );
    }

    return (
        <Stack sx={{ position: 'relative', mt: 2, p: 3, minHeight: '300px' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1, fontSize: '1.4rem', textAlign: 'center' }}>
                DANH SÁCH VĂN PHÒNG PHẨM
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
                            <TableCell sx={{ fontWeight: 'bold', fontSize: '14px' }}>Đơn vị</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', fontSize: '14px' }}>Mục đích sử dụng</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', fontSize: '14px' }}>Ghi chú</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {supplyStationery.map((item, idx) => (
                            <TableRow key={item.id}>
                                <TableCell sx={{ fontSize: '14px' }}>{idx + 1}</TableCell>
                                <TableCell sx={{ fontSize: '14px' }}>{item.product_code}</TableCell>
                                <TableCell sx={{ fontSize: '14px' }}>{item.product_name}</TableCell>
                                <TableCell sx={{ fontSize: '14px' }}>{item.quantity}</TableCell>
                                <TableCell sx={{ fontSize: '14px' }}>{item.unit}</TableCell>
                                <TableCell sx={{ fontSize: '14px' }}>{item.usage_purpose}</TableCell>
                                <TableCell sx={{ fontSize: '14px' }}>{item.note}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Floating Action Button ở góc phải dưới của component */}
            {userInfo?.department === 'HC' ||
            (requestDetail?.status === 'pending' && userInfo?.id === requestDetail.requestor_id) ? (
                <Fab
                    color="primary"
                    onClick={handleOpenDialog}
                    sx={{
                        position: 'absolute',
                        bottom: 32,
                        right: 32,
                        zIndex: 10,
                        boxShadow: '0 6px 16px rgba(25, 118, 210, 0.4)',
                        '&:hover': {
                            boxShadow: '0 8px 20px rgba(25, 118, 210, 0.6)',
                            transform: 'scale(1.1)',
                        },
                        transition: 'all 0.3s ease-in-out',
                    }}
                >
                    <Edit />
                </Fab>
            ) : null}

            <Dialog open={openDialog} maxWidth="lg" fullWidth onClose={handleCloseDialog}>
                <EditSupplyStationery onClose={handleCloseDialog} />
            </Dialog>
        </Stack>
    );
}
