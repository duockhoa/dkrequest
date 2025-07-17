import { Stack, Typography, Link } from '@mui/material';
import { useSelector } from 'react-redux';
import { format } from 'date-fns';

const DetailItem = ({ label, value }) => (
    <Stack direction="row" spacing={2} sx={{ py: 1 }}>
        <Typography
            sx={{
                minWidth: 120,
                maxWidth: 120,
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

export default function OfficeEquipmentRepairDetail() {
    const requestDetail = useSelector((state) => state.requestDetail.requestDetailvalue);

    const repairData = requestDetail?.officeEquipmentRepair;

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        try {
            return format(new Date(dateString), 'dd/MM/yyyy HH:mm');
        } catch {
            return dateString;
        }
    };

    if (!repairData) {
        return (
            <Typography sx={{ fontSize: '1.4rem', color: 'text.secondary' }}>
                Không có thông tin sửa chữa thiết bị văn phòng
            </Typography>
        );
    }

    return (
        <Stack spacing={1.5}>
            <DetailItem label="Tên tài sản" value={repairData.asset_name || '-'} />
            <DetailItem label="Mô tả hư hỏng" value={repairData.damage_description || '-'} />
            <DetailItem label="Vị trí hư hỏng" value={repairData.damage_location || '-'} />
            <DetailItem label="Mức độ khẩn cấp" value={repairData.urgency_level || '-'} />
            <DetailItem label="Thời gian phát hiện" value={formatDate(repairData.detected_at)} />
            <DetailItem label="Số điện thoại liên hệ" value={repairData.requester_phone || '-'} />
            <DetailItem label="Giải pháp đề xuất" value={repairData.proposed_solution || '-'} />
        </Stack>
    );
}
