import { Stack, Typography, Chip, Box } from '@mui/material';
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

const DetailItemWithChips = ({ label, value }) => (
    <Stack direction="row" spacing={2} sx={{ py: 1 }}>
        <Typography
            sx={{
                minWidth: 150,
                color: 'text.secondary',
                fontSize: '1.4rem',
            }}
        >
            {label}
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {value.split(', ').map((item, index) => (
                <Chip
                    key={index}
                    label={item.trim()}
                    size="small"
                    sx={{
                        fontSize: '1.2rem',
                        height: '24px',
                        backgroundColor: '#e3f2fd',
                        color: '#1976d2',
                    }}
                />
            ))}
        </Box>
    </Stack>
);

export default function MeetingRoomRequestDetail() {
    const requestDetail = useSelector((state) => state.requestDetail.requestDetailvalue);

    const formatDate = (dateString) => {
        return dateString ? format(new Date(dateString), 'dd/MM/yyyy') : '-';
    };

    const formatTime = (timeString) => {
        if (!timeString) return '-';
        return timeString.slice(0, 5); // "20:00:00" -> "20:00"
    };

    // Safe access to meeting room request properties
    const meetingRoom = requestDetail?.meetingRoomRequest;
    const usageDate = meetingRoom?.usage_date;
    const startTime = meetingRoom?.start_time;
    const endTime = meetingRoom?.end_time;
    const location = meetingRoom?.location || '-';
    const roomName = meetingRoom?.room_name || '-';
    const purpose = meetingRoom?.purpose || '-';
    const participantCount = meetingRoom?.participant_count || 0;
    const equipmentRequirements = meetingRoom?.equipment_requirements || '';
    const additionalNotes = meetingRoom?.additional_notes || '-';

    return (
        <>
            <DetailItem label="Ngày sử dụng:" value={formatDate(usageDate)} />
            <DetailItem label="Thời gian bắt đầu:" value={formatTime(startTime)} />
            <DetailItem label="Thời gian kết thúc:" value={formatTime(endTime)} />
            <DetailItem label="Vị trí:" value={location} />
            <DetailItem label="Tên phòng:" value={roomName} />
            <DetailItem label="Mục đích:" value={purpose} />
            <DetailItem label="Số người tham gia:" value={`${participantCount} người`} />
            {equipmentRequirements && <DetailItemWithChips label="Yêu cầu thiết bị:" value={equipmentRequirements} />}
            <DetailItem label="Ghi chú thêm:" value={additionalNotes} />
        </>
    );
}
