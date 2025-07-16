import { Stack, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { format } from 'date-fns';

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

export default function ExpressDeliveryDetail() {
    const requestDetail = useSelector((state) => state.requestDetail.requestDetailvalue);

    // Safe access to express delivery data
    const expressData = requestDetail?.expressDeliveryRequest;

    // Format functions
    const formatDate = (dateString) => {
        if (!dateString) return '-';
        try {
            return format(new Date(dateString), 'dd/MM/yyyy');
        } catch {
            return dateString;
        }
    };

    const getDeliveryMethodLabel = (method) => {
        const methodLabels = {
            'Gửi thông thường': '📮 Gửi thông thường',
            'Gửi hỏa tốc': '⚡ Gửi hỏa tốc',
            'Gửi đảm bảo': '🛡️ Gửi đảm bảo',
            'Gửi đi nước ngoài': '🌍 Gửi đi nước ngoài',
        };
        return methodLabels[method] || method || '-';
    };

    const getItemTypeLabel = (type) => {
        const typeLabels = {
            'Giấy tờ': '📄 Giấy tờ',
            'Hàng hoá không phải chất lỏng': '📦 Hàng hoá không phải chất lỏng',
            'Hàng Hoá là chất lỏng': '🧴 Hàng Hoá là chất lỏng',
        };
        return typeLabels[type] || type || '-';
    };

    const getWeightLabel = (weight) => {
        const weightLabels = {
            'Dưới 1kg': '⚖️ Dưới 1kg',
            'Từ 1kg - dưới 3kg': '⚖️ Từ 1kg - dưới 3kg',
            'Từ 3kg - dưới 5kg': '⚖️ Từ 3kg - dưới 5kg',
            'Trên 5kg': '⚖️ Trên 5kg',
        };
        return weightLabels[weight] || weight || '-';
    };

    if (!expressData) {
        return (
            <Typography sx={{ fontSize: '1.4rem', color: 'text.secondary' }}>
                Không có thông tin chuyển phát nhanh
            </Typography>
        );
    }

    return (
        <>
            <DetailItem label="Loại hàng hóa" value={getItemTypeLabel(expressData.item_type)} />

            <DetailItem label="Trọng lượng" value={getWeightLabel(expressData.item_weight)} />

            <DetailItem label="Hình thức vận chuyển" value={getDeliveryMethodLabel(expressData.delivery_method)} />

            {/* Chỉ hiển thị khi là "Gửi hỏa tốc" */}
            {expressData.delivery_method === 'Gửi hỏa tốc' && (
                <>
                    <DetailItem label="Lý do gửi hỏa tốc" value={expressData.express_reason || '-'} />

                    <DetailItem label="Ngày mong muốn nhận" value={formatDate(expressData.expected_receive_date)} />
                </>
            )}

            <DetailItem label="Đơn vị nhận" value={expressData.receiving_unit || '-'} />

            <DetailItem label="Địa chỉ nhận" value={expressData.receiving_address || '-'} />

            <DetailItem label="Tên người nhận" value={expressData.recipient_name || '-'} />

            <DetailItem label="Số điện thoại người nhận" value={expressData.recipient_phone || '-'} />

            <DetailItem label="Ngày tạo" value={formatDate(expressData.created_at)} />
        </>
    );
}
