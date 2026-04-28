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

export default function TransferDetail() {
    const requestDetail = useSelector((state) => state.requestDetail.requestDetailvalue);
    const transfer = requestDetail?.transferRequest || {};

    const formatDate = (dateString) => {
        return dateString ? format(new Date(dateString), 'dd/MM/yyyy') : '-';
    };

    return (
        <>
            <DetailItem label="Phòng hiện tại" value={transfer.current_department || '-'} />
            <DetailItem label="Phòng chuyển tới" value={transfer.new_department || '-'} />
            <DetailItem label="Ngày hiệu lực" value={formatDate(transfer.effective_date)} />
            <DetailItem label="Lý do chuyển" value={transfer.reason || '-'} />
        </>
    );
}
