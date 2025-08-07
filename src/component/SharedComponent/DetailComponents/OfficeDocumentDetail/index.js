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
                wordWrap: 'break-word',
                whiteSpace: 'normal',
                flexShrink: 1,
            }}
        >
            {label}:
        </Typography>
        <Typography
            sx={{
                fontSize: '1.4rem',
                flex: 1,
                wordWrap: 'break-word',
            }}
        >
            {value}
        </Typography>
    </Stack>
);

export default function OfficeDocumentDetail() {
    const requestDetail = useSelector((state) => state.requestDetail.requestDetailvalue);

    const docData = requestDetail?.officeDocumentRequest;

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        try {
            return format(new Date(dateString), 'dd/MM/yyyy');
        } catch {
            return dateString;
        }
    };

    if (!docData) {
        return (
            <Typography sx={{ fontSize: '1.4rem', color: 'text.secondary' }}>
                Không có thông tin công tác văn thư
            </Typography>
        );
    }

    return (
        <Stack spacing={1.5}>
            <DetailItem label="Loại văn bản" value={docData.document_type || '-'} />
            <DetailItem label="Tên văn bản/Tóm tắt nội dung" value={docData.document_name || '-'} />
            <DetailItem label="Số công văn" value={docData.document_number || '-'} />
            <DetailItem label="Ngày ban hành" value={formatDate(docData.issue_date)} />
            <DetailItem label="Số bản đóng dấu/bản sao" value={docData.copy_count || '-'} />
            <DetailItem label="Mục đích sử dụng" value={docData.purpose || '-'} />
            <DetailItem label="Người ký duyệt" value={docData.approved_by || '-'} />
            <DetailItem label="Loại con dấu sử dụng" value={docData.seal_type || '-'} />
            <DetailItem label="Yêu cầu khác" value={docData.other_requirements || '-'} />
        </Stack>
    );
}
