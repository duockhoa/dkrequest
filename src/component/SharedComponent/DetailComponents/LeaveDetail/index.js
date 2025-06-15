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

export default function LeaveDetail() {
    const requestDetail = useSelector((state) => state.requestDetail.requestDetailvalue);

    const formatDate = (dateString) => {
        return dateString ? format(new Date(dateString), 'dd/MM/yyyy HH:mm') : '-';
    };

    // Safe access to nested properties;
    const leaveStart = requestDetail?.leaveRegistration?.start_time;
    const leaveEnd = requestDetail?.leaveRegistration?.end_time;
    const leaveHours = requestDetail?.leaveRegistration?.hours || 0;
    const leaveReason = requestDetail?.leaveRegistration?.reason || '-';

    return (
        <>
            <DetailItem label="Thời gian bắt đầu" value={formatDate(leaveStart)} />
            <DetailItem label="Thời gian kết thúc" value={formatDate(leaveEnd)} />
            <DetailItem label="Số giờ nghỉ" value={formatWorkingTime(leaveHours)} />
            <DetailItem label="Lý do xin nghỉ" value={leaveReason} />
        </>
    );
}
