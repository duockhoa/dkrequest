import { Stack, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { format } from 'date-fns';

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

export default function OverTimeRequestDetail() {
    const requestDetail = useSelector((state) => state.requestDetail.requestDetailvalue);

    const formatDate = (dateString) => {
        return dateString ? format(new Date(dateString), 'dd/MM/yyyy HH:mm') : '-';
    };

    // Safe access to nested properties;
    const startTime = requestDetail?.overtimeRegistration?.start_time;
    const endTime = requestDetail?.overtimeRegistration?.end_time;
    const overTimeHours = requestDetail?.overtimeRegistration?.hours || 0;
    const overTimeReason = requestDetail?.overtimeRegistration?.reason || '-';

    return (
        <>
            <DetailItem label="Thời gian bắt đầu:" value={formatDate(startTime)} />
            <DetailItem label="Thời gian kết thúc:" value={formatDate(endTime)} />
            <DetailItem label="Số giờ làm thêm:" value={`${overTimeHours} giờ`} />
            <DetailItem label="Nội dung công việc:" value={overTimeReason} />
        </>
    );
}
