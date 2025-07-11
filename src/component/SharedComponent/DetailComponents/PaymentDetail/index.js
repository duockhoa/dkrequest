import { Stack, Typography, TextField } from '@mui/material';
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

export default function PaymentDetail() {
    const requestDetail = useSelector((state) => state.requestDetail.requestDetailvalue);

    // Safe access to payment registration data
    const paymentData = requestDetail?.paymentRegistration;

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

    const getPaymentTypeLabel = (type) => {
        switch (type) {
            case 'invoice':
                return 'Có hóa đơn';
            case 'no_invoice':
                return 'Không hóa đơn';
            default:
                return type || '-';
        }
    };

    if (!paymentData) {
        return (
            <Typography sx={{ fontSize: '1.4rem', color: 'text.secondary' }}>Không có thông tin thanh toán</Typography>
        );
    }

    return (
        <>
            <DetailItem label="Loại thanh toán" value={getPaymentTypeLabel(paymentData.payment_type)} />

            <DetailItem label="Nội dung thanh toán" value={paymentData.payment_content || '-'} />

            <DetailItem label="Người thụ hưởng" value={paymentData.pay_to || '-'} />

            <DetailItem label="Số tiền" value={formatCurrency(paymentData.amount)} />

            <DetailItem label="Hạn thanh toán" value={formatDate(paymentData.due_date)} />

            <DetailItem label="Tên người thụ hưởng" value={paymentData.beneficiary_name || '-'} />

            <DetailItem label="Số tài khoản" value={paymentData.bank_account_number || '-'} />

            <DetailItem label="Ngân hàng" value={paymentData.bank_name || '-'} />
        </>
    );
}
