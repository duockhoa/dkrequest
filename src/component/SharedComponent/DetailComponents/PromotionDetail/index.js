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

export default function PromotionDetail() {
    const requestDetail = useSelector((state) => state.requestDetail.requestDetailvalue);
    const promotion = requestDetail?.promotionRequest || {};

    const formatDate = (dateString) => {
        return dateString ? format(new Date(dateString), 'dd/MM/yyyy') : '-';
    };

    return (
        <>
            <DetailItem label="Chức danh hiện tại" value={promotion.current_position || '-'} />
            <DetailItem label="Chức danh đề xuất" value={promotion.proposed_position || '-'} />
            <DetailItem label="Ngày có hiệu lực" value={formatDate(promotion.effective_date)} />
            <DetailItem label="Lương đề xuất" value={promotion.proposed_salary_text || '-'} />
            <DetailItem label="Lý do đề nghị" value={promotion.reason || '-'} />
        </>
    );
}
