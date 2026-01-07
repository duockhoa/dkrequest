import { Stack, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { format } from 'date-fns';
import { formatWorkingTime } from '../../../../utils/timeCalculator';

const DetailItem = ({ label, value }) => (
    <Stack direction="row" spacing={2} sx={{ py: 1 }}>
        <Typography
            sx={{
                minWidth: 120,
                color: 'text.secondary',
                fontSize: '1.4rem',
            }}
        >
            {label}
        </Typography>
        <Typography sx={{ fontSize: '1.4rem' }}>{value}</Typography>
    </Stack>
);

export default function LunchStopDetail() {
    const requestDetail = useSelector((state) => state.requestDetail.requestDetailvalue);

    const formatDate = (dateString) => {
        return dateString ? format(new Date(dateString), 'dd/MM/yyyy') : '-';
    };

    // Safe access to nested properties;
    const leaveStart = requestDetail?.lunchStopRequest?.from_date;
    const leaveEnd = requestDetail?.lunchStopRequest?.to_date;
    const leaveReason = requestDetail?.lunchStopRequest?.reason || '-';

    return (
        <>
            <DetailItem label="Từ ngày" value={formatDate(leaveStart)} />
            <DetailItem label="Đến ngày" value={formatDate(leaveEnd)} />
            <DetailItem label="Lý do" value={leaveReason} />
        </>
    );
}
