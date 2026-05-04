import { Stack, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { format } from 'date-fns';

const DetailItem = ({ label, value }) => (
    <Stack direction="row" spacing={2} sx={{ py: 1 }}>
        <Typography
            sx={{
                width: 140,
                color: 'text.secondary',
                fontSize: '1.4rem',
            }}
        >
            {label}
        </Typography>
        <Typography sx={{ fontSize: '1.4rem' }}>{value}</Typography>
    </Stack>
);

const getDetails = (requestDetail) => {
    const details = requestDetail?.promotionRequest?.details;
    if (!details) return requestDetail?.promotionRequest || {};
    if (typeof details === 'string') {
        try {
            return JSON.parse(details);
        } catch {
            return {};
        }
    }
    return details;
};

export default function PromotionDetail() {
    const requestDetail = useSelector((state) => state.requestDetail.requestDetailvalue);
    const promotion = getDetails(requestDetail);

    const formatDate = (dateString) => {
        return dateString ? format(new Date(dateString), 'dd/MM/yyyy') : '-';
    };

    return (
        <>
            <DetailItem label="Người được bổ nhiệm" value={promotion.promoted_employee_name || '-'} />
            <DetailItem label="Chức danh hiện tại" value={promotion.current_position || '-'} />
            <DetailItem label="Số tháng giữ chức" value={promotion.current_position_months || '-'} />
            <DetailItem label="Số năm giữ chức" value={promotion.current_position_years || '-'} />
            <DetailItem label="Từ ngày" value={formatDate(promotion.current_position_from_date)} />
            <DetailItem label="Đến ngày" value={formatDate(promotion.current_position_to_date)} />
            <DetailItem label="Chức danh bổ nhiệm" value={promotion.promoted_position || '-'} />
            <DetailItem label="Lý do bổ nhiệm" value={promotion.promotion_reason || '-'} />
            <DetailItem label="Thời hạn bổ nhiệm" value={promotion.promotion_duration || '-'} />
        </>
    );
}
