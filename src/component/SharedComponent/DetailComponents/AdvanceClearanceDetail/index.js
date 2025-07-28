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
import React, { useState, useEffect } from 'react';

const DetailItem = ({ label, value }) => (
    <Stack direction="row" spacing={2} sx={{ py: 1 }}>
        <Typography
            sx={{
                minWidth: 120,
                maxWidth: 200, // Add maximum width to control when wrapping occurs
                color: 'text.secondary',
                fontSize: '1.4rem',
                wordWrap: 'break-word', // Allow words to break
                whiteSpace: 'normal', // Allow text to wrap to multiple lines
                flexShrink: 1, // Allow the text to shrink when needed
            }}
        >
            {label}:
        </Typography>
        <Typography
            sx={{
                fontSize: '1.4rem',
                flex: 1, // Take remaining space
                wordWrap: 'break-word', // Also allow value text to wrap if needed
            }}
        >
            {value}
        </Typography>
    </Stack>
);

export default function AdvanceClearanceDetail() {
    const requestDetail = useSelector((state) => state.requestDetail.requestDetailvalue);
    const advanceClearanceRequest = requestDetail?.advanceClearanceRequest;

    // Luôn khai báo hook ở đầu component
    const {
        bank_account_number = '',
        beneficiary_name = '',
        bank_name = '',
        vouchers = [],
        spendings = [],
        unspent_amount = null,
    } = advanceClearanceRequest || {};

    const [remainAmount, setRemainAmount] = useState(0);

    useEffect(() => {
        const unspent = parseFloat(unspent_amount) || 0;
        const totalVoucher = Array.isArray(vouchers)
            ? vouchers.reduce((sum, v) => sum + (parseFloat(v.amount) || 0), 0)
            : 0;
        const totalSpending = Array.isArray(spendings)
            ? spendings.reduce((sum, s) => sum + (parseFloat(s.amount) || 0), 0)
            : 0;
        setRemainAmount(unspent + totalVoucher - totalSpending);
    }, [unspent_amount, vouchers, spendings]);

    if (!advanceClearanceRequest) {
        return (
            <Typography sx={{ fontSize: '1.4rem', color: 'text.secondary' }}>
                Không có thông tin quyết toán tạm ứng
            </Typography>
        );
    }

    return (
        <Stack sx={{ position: 'relative', mt: 2 }} spacing={2}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: '1.4rem' }}>
                THÔNG TIN QUYẾT TOÁN TẠM ỨNG
            </Typography>
            <DetailItem
                label="Số tiền ứng kỳ trước chưa chi hết"
                value={
                    unspent_amount !== null && unspent_amount !== undefined
                        ? Number(unspent_amount).toLocaleString()
                        : '---'
                }
            />
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mt: 2, fontSize: '1.4rem' }}>
                Số lượng tạm ứng kỳ này
            </Typography>
            {!vouchers || vouchers.length === 0 ? (
                <Typography sx={{ color: 'text.secondary', fontSize: '1.2rem' }}></Typography>
            ) : (
                <TableContainer component={Paper} sx={{ boxShadow: 2 }}>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontSize: '1.2rem', fontWeight: 600 }}>Số phiếu</TableCell>
                                <TableCell sx={{ fontSize: '1.2rem', fontWeight: 600 }}>Ngày chứng từ</TableCell>
                                <TableCell sx={{ fontSize: '1.2rem', fontWeight: 600 }}>Số tiền</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {vouchers.map((item, idx) => (
                                <TableRow key={item.id}>
                                    <TableCell sx={{ fontSize: '1.2rem' }}>{item.voucher_number || '---'}</TableCell>
                                    <TableCell sx={{ fontSize: '1.2rem' }}>
                                        {item.voucher_date
                                            ? new Date(item.voucher_date).toLocaleDateString('vi-VN')
                                            : '---'}
                                    </TableCell>
                                    <TableCell sx={{ fontSize: '1.2rem' }}>
                                        {item.amount ? Number(item.amount).toLocaleString() : '---'}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
            {/* Hiển thị số tiền còn lại từ state */}
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mt: 2, fontSize: '1.4rem' }}>
                Số tiền đã chi tiêu
            </Typography>
            {!spendings || spendings.length === 0 ? (
                <Typography sx={{ color: 'text.secondary', fontSize: '1.2rem' }}>Không có chi tiêu</Typography>
            ) : (
                <TableContainer component={Paper} sx={{ boxShadow: 2 }}>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontSize: '1.2rem', fontWeight: 600 }}>Số chứng từ</TableCell>
                                <TableCell sx={{ fontSize: '1.2rem', fontWeight: 600 }}>Ngày chi</TableCell>
                                <TableCell sx={{ fontSize: '1.2rem', fontWeight: 600 }}>Số tiền</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {spendings.map((item, idx) => (
                                <TableRow key={item.id}>
                                    <TableCell sx={{ fontSize: '1.2rem' }}>{item.document_number || '---'}</TableCell>
                                    <TableCell sx={{ fontSize: '1.2rem' }}>
                                        {item.spending_date
                                            ? new Date(item.spending_date).toLocaleDateString('vi-VN')
                                            : '---'}
                                    </TableCell>
                                    <TableCell sx={{ fontSize: '1.2rem' }}>
                                        {item.amount ? Number(item.amount).toLocaleString() : '---'}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
            <DetailItem label="Số tiền còn lại" value={Number(remainAmount).toLocaleString() + ' đ'} />
            {remainAmount < 0 && (
                <>
                    <DetailItem label="Số tài khoản" value={bank_account_number || '---'} />
                    <DetailItem label="Chủ tài khoản" value={beneficiary_name || '---'} />
                    <DetailItem label="Ngân hàng" value={bank_name || '---'} />
                </>
            )}
        </Stack>
    );
}
