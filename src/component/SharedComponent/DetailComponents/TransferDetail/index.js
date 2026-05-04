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
    const details = requestDetail?.transferRequest?.details;
    if (!details) return requestDetail?.transferRequest || {};
    if (typeof details === 'string') {
        try {
            return JSON.parse(details);
        } catch {
            return {};
        }
    }
    return details;
};

export default function TransferDetail() {
    const requestDetail = useSelector((state) => state.requestDetail.requestDetailvalue);
    const transfer = getDetails(requestDetail);

    const formatDate = (dateString) => {
        return dateString ? format(new Date(dateString), 'dd/MM/yyyy') : '-';
    };

    return (
        <>
            <DetailItem label="Nhân viên" value={transfer.employee_name || '-'} />
            <DetailItem label="Ngày vào làm" value={formatDate(transfer.joined_date)} />
            <DetailItem label="Chức danh hiện tại" value={transfer.current_position || '-'} />
            <DetailItem label="Phòng/ban hiện tại" value={transfer.from_department || '-'} />
            <DetailItem label="Chức danh điều chuyển" value={transfer.transfer_position || '-'} />
            <DetailItem label="Thời gian điều chuyển" value={formatDate(transfer.transfer_time)} />
            <DetailItem label="Lý do điều chuyển" value={transfer.transfer_reason || '-'} />
        </>
    );
}
