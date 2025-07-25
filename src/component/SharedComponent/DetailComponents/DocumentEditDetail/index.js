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

export default function DocumentEditDetail() {
    const requestDetail = useSelector((state) => state.requestDetail.requestDetailvalue);

    const documentEdit = requestDetail?.documentEditRequest || {};

    const formatDate = (dateString) => {
        return dateString ? format(new Date(dateString), 'dd/MM/yyyy') : '-';
    };

    return (
        <>
            <DetailItem label="Loại yêu cầu" value={documentEdit.type || '-'} />
            <DetailItem label="Tên tài liệu" value={documentEdit.document_name || '-'} />
            <DetailItem label="Lý do chỉnh sửa/biên soạn" value={documentEdit.reason || '-'} />
            <DetailItem label="Hạn hoàn thành" value={formatDate(documentEdit.deadline)} />
        </>
    );
}
