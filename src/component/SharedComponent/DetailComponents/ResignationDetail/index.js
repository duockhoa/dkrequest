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

export default function ResignationDetail() {
    const requestDetail = useSelector((state) => state.requestDetail.requestDetailvalue);
    const resignation = requestDetail?.resignationRequest || {};

    const formatDate = (dateString) => {
        return dateString ? format(new Date(dateString), 'dd/MM/yyyy') : '-';
    };

    return (
        <>
            <DetailItem label="Ngày nghỉ việc" value={formatDate(resignation.last_working_date)} />
            <DetailItem label="Lý do thôi việc" value={resignation.resignation_reason || '-'} />
            <DetailItem label="Bàn giao công việc" value={resignation.handover_details || '-'} />
        </>
    );
}
