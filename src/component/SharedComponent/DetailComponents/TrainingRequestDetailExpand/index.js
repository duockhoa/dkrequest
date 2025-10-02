import {
    Stack,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip,
    Box,
    Divider,
} from '@mui/material';
import { useSelector } from 'react-redux';

export default function TrainingRequestDetailExpand() {
    const requestDetail = useSelector((state) => state.requestDetail.requestDetailvalue);
    const trainingRequest = requestDetail?.trainingRequest;

    if (!trainingRequest) {
        return <Typography sx={{ fontSize: '1.4rem', color: 'text.secondary' }}>Không có thông tin đào tạo</Typography>;
    }

    return (
        <Stack sx={{ position: 'relative', mt: 2, p: 3, minHeight: '400px' }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3, fontSize: '1.8rem', textAlign: 'center', color: 'primary.main' }}>
                CHI TIẾT ĐỀ NGHỊ ĐÀO TẠO
            </Typography>

            {/* Thông tin tổng quan */}
            <Box sx={{ mb: 3, p: 2, backgroundColor: '#f5f5f5', borderRadius: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, fontSize: '1.6rem' }}>
                    Thông tin khóa đào tạo
                </Typography>
                <Stack spacing={1}>
                    <Typography><strong>Tên khóa học:</strong> {trainingRequest.course_name}</Typography>
                    <Typography><strong>Đơn vị đào tạo:</strong> {trainingRequest.training_provider}</Typography>
                    <Typography><strong>Thời gian dự kiến:</strong> {trainingRequest.expected_time}</Typography>
                    <Typography><strong>Số buổi học:</strong> {trainingRequest.session_count} buổi</Typography>
                    <Typography><strong>Ngân sách:</strong> {Number(trainingRequest.budget).toLocaleString('vi-VN')} VNĐ</Typography>
                    <Typography><strong>Hình thức đào tạo:</strong> {trainingRequest.training_mode}</Typography>
                    <Typography><strong>Loại giảng viên:</strong> {trainingRequest.trainer_type}</Typography>

                    {trainingRequest.necessity && (
                        <Typography><strong>Tính cần thiết:</strong> {trainingRequest.necessity}</Typography>
                    )}
                    
                    {trainingRequest.training_goal && (
                        <Typography><strong>Mục tiêu đào tạo:</strong> {trainingRequest.training_goal}</Typography>
                    )}
                </Stack>
            </Box>

            <Divider sx={{ mb: 3 }} />

            {/* Danh sách người tham gia chi tiết */}
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, fontSize: '1.6rem' }}>
                Danh sách người tham gia đào tạo ({trainingRequest.participants?.length || 0} người)
            </Typography>
            
            <TableContainer
                component={Paper}
                sx={{
                    boxShadow: 2,
                    position: 'relative',
                }}
            >
                <Table
                    size="small"
                    sx={{
                        border: '1px solid #bdbdbd',
                        '& th, & td': {
                            border: '1px solid #bdbdbd',
                        },
                        borderCollapse: 'collapse',
                    }}
                >
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold', fontSize: '14px', backgroundColor: '#f0f0f0' }}>STT</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', fontSize: '14px', backgroundColor: '#f0f0f0' }}>Mã nhân viên</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', fontSize: '14px', backgroundColor: '#f0f0f0' }}>Họ và tên</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', fontSize: '14px', backgroundColor: '#f0f0f0' }}>Chức vụ</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', fontSize: '14px', backgroundColor: '#f0f0f0' }}>Số điện thoại</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', fontSize: '14px', backgroundColor: '#f0f0f0' }}>Email</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {trainingRequest.participants?.map((participant, index) => (
                            <TableRow key={participant.id} sx={{ '&:nth-of-type(even)': { backgroundColor: '#f9f9f9' } }}>
                                <TableCell sx={{ fontSize: '14px', textAlign: 'center' }}>{index + 1}</TableCell>
                                <TableCell sx={{ fontSize: '14px', fontWeight: 'bold', color: 'primary.main' }}>
                                    {participant.employee_code}
                                </TableCell>
                                <TableCell sx={{ fontSize: '14px' }}>{participant.employee_name}</TableCell>
                                <TableCell sx={{ fontSize: '14px' }}>{participant.position}</TableCell>
                                <TableCell sx={{ fontSize: '14px' }}>{participant.phone_number || '-'}</TableCell>
                                <TableCell sx={{ fontSize: '14px' }}>{participant.email || '-'}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Thống kê */}
            <Box sx={{ mt: 3, p: 2, backgroundColor: '#e8f4fd', borderRadius: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: '1.4rem', color: 'primary.main' }}>
                    Thống kê
                </Typography>
                <Stack direction="row" spacing={4} sx={{ mt: 1 }}>
                    <Typography><strong>Tổng số người tham gia:</strong> {trainingRequest.participants?.length || 0} người</Typography>
                    <Typography><strong>Tổng ngân sách:</strong> {Number(trainingRequest.budget).toLocaleString('vi-VN')} VNĐ</Typography>
                    <Typography><strong>Chi phí/người:</strong> {trainingRequest.participants?.length ? (Number(trainingRequest.budget) / trainingRequest.participants.length).toLocaleString('vi-VN') : 0} VNĐ</Typography>
                </Stack>
            </Box>
        </Stack>
    );
}