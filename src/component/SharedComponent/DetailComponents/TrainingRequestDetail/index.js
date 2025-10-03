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
    IconButton,
    Dialog,
} from '@mui/material';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import TrainingRequestDetailExpand from '../TrainingRequestDetailExpand';

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

export default function TrainingRequestDetail() {
    const requestDetail = useSelector((state) => state.requestDetail.requestDetailvalue);
    const [openExpand, setOpenExpand] = useState(false);

    const trainingRequest = requestDetail?.trainingRequest;

    if (!trainingRequest) {
        return <Typography sx={{ fontSize: '1.4rem', color: 'text.secondary' }}>Không có thông tin đào tạo</Typography>;
    }

    const handleExpand = () => {
        setOpenExpand(true);
    };

    const handleCloseExpand = () => {
        setOpenExpand(false);
    };

    // Hàm format datetime
    const formatDateTime = (dateTimeString) => {
        if (!dateTimeString) return '-';
        try {
            const date = new Date(dateTimeString);
            return date.toLocaleString('vi-VN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (error) {
            return dateTimeString;
        }
    };

    return (
        <Stack sx={{ position: 'relative', mt: 0 }}>
            <DetailItem label="Tên khóa học" value={trainingRequest.course_name || '-'} />
            <DetailItem label="Đơn vị đào tạo" value={trainingRequest.training_provider || '-'} />
            <DetailItem label="Thời gian bắt đầu" value={formatDateTime(trainingRequest.start_time)} />
            <DetailItem label="Thời gian kết thúc" value={formatDateTime(trainingRequest.end_time)} />
            <DetailItem 
                label="Số buổi học" 
                value={trainingRequest.session_count ? `${trainingRequest.session_count} buổi` : '-'} 
            />
            <DetailItem 
                label="Ngân sách" 
                value={trainingRequest.budget ? `${Number(trainingRequest.budget).toLocaleString('vi-VN')} VNĐ` : '-'} 
            />
            
            <DetailItem label="Hình thức đào tạo" value={trainingRequest.training_mode || '-'} />
            <DetailItem label="Loại giảng viên" value={trainingRequest.trainer_type || '-'} />

            {trainingRequest.necessity && (
                <DetailItem label="Tính cần thiết" value={trainingRequest.necessity} />
            )}
            
            {trainingRequest.training_goal && (
                <DetailItem label="Mục tiêu đào tạo" value={trainingRequest.training_goal} />
            )}

            {/* Danh sách người tham gia */}
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1, mt: 3, fontSize: '1.4rem' }}>
                DANH SÁCH NGƯỜI THAM GIA ĐÀO TẠO ({trainingRequest.participants?.length || 0} người)
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
                            <TableCell sx={{ fontWeight: 'bold', fontSize: '14px' }}>Mã NV</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', fontSize: '14px' }}>Họ tên</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', fontSize: '14px' }}>Bộ phận</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {trainingRequest.participants?.map((participant) => (
                            <TableRow key={participant.id}>
                                <TableCell sx={{ fontSize: '14px' }}>{participant.employee_code}</TableCell>
                                <TableCell sx={{ fontSize: '14px' }}>{participant.employee_name}</TableCell>
                                <TableCell sx={{ fontSize: '14px' }}>{participant.department || '-'}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                
                {/* Nút mở rộng ở góc dưới phải */}
                <IconButton
                    size="small"
                    onClick={handleExpand}
                    sx={{
                        position: 'absolute',
                        bottom: 8,
                        right: 8,
                        background: '#fff',
                        border: '1px solid #1976d2',
                        boxShadow: 1,
                        zIndex: 2,
                        '&:hover': {
                            background: '#e3f2fd',
                        },
                    }}
                >
                    <OpenInFullIcon fontSize="small" color="primary" />
                </IconButton>
            </TableContainer>

            <Dialog open={openExpand} onClose={handleCloseExpand} maxWidth="lg" fullWidth>
                <TrainingRequestDetailExpand />
            </Dialog>
        </Stack>
    );
}
