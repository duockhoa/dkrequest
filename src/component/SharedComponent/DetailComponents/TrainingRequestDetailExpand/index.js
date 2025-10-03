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
} from '@mui/material';
import { useSelector } from 'react-redux';

export default function TrainingRequestDetailExpand() {
    const requestDetail = useSelector((state) => state.requestDetail.requestDetailvalue);
    const trainingRequest = requestDetail?.trainingRequest;

    if (!trainingRequest) {
        return <Typography sx={{ fontSize: '1.4rem', color: 'text.secondary' }}>Không có thông tin đào tạo</Typography>;
    }

    return (
        <Stack sx={{ position: 'relative', p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, fontSize: '1.6rem', textAlign: 'center', color: 'primary.main' }}>
                Danh sách người tham gia đào tạo ({trainingRequest.participants?.length || 0} người)
            </Typography>
            
            <TableContainer
                component={Paper}
                sx={{
                    boxShadow: 2,
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
                            <TableCell sx={{ fontWeight: 'bold', fontSize: '14px', backgroundColor: '#f0f0f0' }}>Bộ phận</TableCell>
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
                                <TableCell sx={{ fontSize: '14px' }}>{participant.department || '-'}</TableCell>
                                <TableCell sx={{ fontSize: '14px' }}>{participant.phone_number || '-'}</TableCell>
                                <TableCell sx={{ fontSize: '14px' }}>{participant.email || '-'}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Stack>
    );
}