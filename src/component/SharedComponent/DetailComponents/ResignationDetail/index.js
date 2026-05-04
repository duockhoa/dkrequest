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
    const details = requestDetail?.resignationRequest?.details;
    if (!details) return requestDetail?.resignationRequest || {};
    if (typeof details === 'string') {
        try {
            return JSON.parse(details);
        } catch {
            return {};
        }
    }
    return details;
};

export default function ResignationDetail() {
    const requestDetail = useSelector((state) => state.requestDetail.requestDetailvalue);
    const resignation = getDetails(requestDetail);

    const formatDate = (dateString) => {
        return dateString ? format(new Date(dateString), 'dd/MM/yyyy') : '-';
    };

    return (
        <>
            <DetailItem label="Nhân viên" value={resignation.employee_name || '-'} />
            <DetailItem label="Mã nhân viên" value={resignation.employee_code || '-'} />
            <DetailItem label="Phòng/ban" value={resignation.department || '-'} />
            <DetailItem label="Chức danh" value={resignation.position || '-'} />
            <DetailItem label="Ngày vào làm" value={formatDate(resignation.joined_date)} />
            <DetailItem label="Ngày nghỉ việc" value={formatDate(resignation.resignation_date)} />
            <DetailItem label="Lý do thôi việc" value={resignation.resignation_reason || '-'} />
            <DetailItem label="Số lượng cổ phần" value={resignation.shares_count || '-'} />
            <DetailItem label="Giá trị cổ phần" value={resignation.shares_value || '-'} />
            <DetailItem label="Hình thức hoàn trả" value={resignation.shares_return_method || '-'} />
            <DetailItem label="Đề nghị khác" value={resignation.other_request || '-'} />
        </>
    );
}
