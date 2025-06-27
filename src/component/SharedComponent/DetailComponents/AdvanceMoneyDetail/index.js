import { Stack, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { format } from 'date-fns';

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

export default function AdvanceMoneyDetail() {
    const requestDetail = useSelector((state) => state.requestDetail.requestDetailvalue);

    // Safe access to advance money registration data
    const advanceData = requestDetail?.advance_request;

    // Format functions
    const formatCurrency = (amount) => {
        if (!amount) return '-';
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(amount);
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        try {
            return format(new Date(dateString), 'dd/MM/yyyy');
        } catch {
            return dateString;
        }
    };

    const formatBankAccount = (accountNumber) => {
        if (!accountNumber) return '-';
        // Add spaces every 4 digits for display
        return accountNumber.replace(/(\d{4})(?=\d)/g, '$1 ');
    };

    if (!advanceData) {
        return (
            <Typography sx={{ fontSize: '1.4rem', color: 'text.secondary' }}>
                Không có thông tin tạm ứng
            </Typography>
        );
    }

    return (
        <>
            <DetailItem label="Lý do tạm ứng" value={advanceData.reason || '-'} />

            <DetailItem label="Bộ phận/Địa chỉ" value={advanceData.address || '-'} />

            <DetailItem
                label="Số tiền tạm ứng"
                value={formatCurrency(advanceData.amount)}
            />

            <DetailItem
                label="Thời hạn thanh toán"
                value={formatDate(advanceData.due_date)}
            />

            {advanceData.bank_name && (
                <DetailItem label="Ngân hàng" value={advanceData.bank_name} />
            )}

            {advanceData.bank_account_number && (
                <DetailItem
                    label="Số tài khoản"
                    value={formatBankAccount(advanceData.bank_account_number)}
                />
            )}

            {advanceData.beneficiary_name && (
                <DetailItem label="Chủ tài khoản" value={advanceData.beneficiary_name} />
            )}
        </>
    );
}
