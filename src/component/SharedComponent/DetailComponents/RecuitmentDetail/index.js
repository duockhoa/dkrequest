import { Stack, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { format } from 'date-fns';

const DetailItem = ({ label, value }) => (
    <Stack direction="row" spacing={2} sx={{ py: 1 }}>
        <Typography
            sx={{
                minWidth: 120,
                maxWidth: 200, // Add maximum width to control when wrapping occurs
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

export default function RecruitmentDetail() {
    const requestDetail = useSelector((state) => state.requestDetail.requestDetailvalue);

    // Safe access to recruitment data
    const recruitmentData = requestDetail?.recruitmentRequest;

    // Format functions
    const formatCurrency = (amount) => {
        if (!amount) return '-';
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(amount);
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        try {
            return format(new Date(dateString), 'dd/MM/yyyy');
        } catch {
            return dateString;
        }
    };

    if (!recruitmentData) {
        return (
            <Typography sx={{ fontSize: '1.4rem', color: 'text.secondary' }}>Không có thông tin tuyển dụng</Typography>
        );
    }

    return (
        <>
            <DetailItem label="Vị trí tuyển dụng" value={recruitmentData.position || '-'} />

            <DetailItem label="Số lượng" value={recruitmentData.quantity || '-'} />

            <DetailItem label="Ngày dự kiến thử việc" value={formatDate(recruitmentData.probation_start_date)} />

            <DetailItem label="Lương thử việc" value={formatCurrency(recruitmentData.probation_salary)} />

            <DetailItem label="Lương chính thức" value={formatCurrency(recruitmentData.official_salary)} />

            <DetailItem label="Lý do tuyển dụng" value={recruitmentData.recruitment_reason || '-'} />

            <DetailItem label="Trình độ học vấn" value={recruitmentData.education_level || '-'} />

            <DetailItem label="Chuyên ngành" value={recruitmentData.major || '-'} />

            <DetailItem label="Ngoại ngữ" value={recruitmentData.foreign_language || '-'} />

            <DetailItem label="Tin học" value={recruitmentData.computer_skill || '-'} />

            <DetailItem label="Kinh nghiệm" value={recruitmentData.experience || '-'} />

            <DetailItem label="Loại hợp đồng" value={recruitmentData.contract_type || '-'} />

            <DetailItem label="Giới tính" value={recruitmentData.gender || '-'} />

            <DetailItem label="Độ tuổi" value={recruitmentData.age_range || '-'} />

            <DetailItem label="Địa điểm làm việc" value={recruitmentData.work_location || '-'} />

            <DetailItem label="Thời gian làm việc" value={recruitmentData.working_hours || '-'} />

            <DetailItem
                label="Mô tả công việc"
                value={
                    <Typography
                        sx={{
                            fontSize: '1.4rem',
                            whiteSpace: 'pre-wrap',
                            wordWrap: 'break-word',
                        }}
                    >
                        {recruitmentData.job_description || '-'}
                    </Typography>
                }
            />

            <DetailItem
                label="Yêu cầu khác"
                value={
                    <Typography
                        sx={{
                            fontSize: '1.4rem',
                            whiteSpace: 'pre-wrap',
                            wordWrap: 'break-word',
                        }}
                    >
                        {recruitmentData.other_requirements || '-'}
                    </Typography>
                }
            />
        </>
    );
}
