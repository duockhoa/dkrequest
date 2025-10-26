import { Stack, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { format } from 'date-fns';

const DetailItem = ({ label, value }) => (
    <Stack direction="row" spacing={2} sx={{ py: 1 }}>
        <Typography
            sx={{
                width: 120,

                color: 'text.secondary',
                fontSize: '1.4rem',
            }}
        >
            {label}
        </Typography>
        <Typography sx={{ fontSize: '1.4rem' }}>{value}</Typography>
    </Stack>
);

export default function AdministrativeDetail() {
    const requestDetail = useSelector((state) => state.requestDetail.requestDetailvalue);

    const administrative = requestDetail?.administrativeRequest || {};

    const formatDate = (dateString) => {
        return dateString ? format(new Date(dateString), 'dd/MM/yyyy') : '-';
    };

    return (
        <>
            <DetailItem label="Số điện thoại" value={administrative.phoneNumber || '-'} />
            <DetailItem label="Mục đích" value={administrative.purpose || '-'} />
            <DetailItem label="Nội dung chi tiết" value={administrative.detailed_content || '-'} />
            <DetailItem label="Hạn mong muốn hoàn thành" value={formatDate(administrative.completion_time)} />
        </>
    );
}
