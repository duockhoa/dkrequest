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

export default function VehicleRequestDetailExpand() {
    const requestDetail = useSelector((state) => state.requestDetail.requestDetailvalue);
    const vehicleRequest = requestDetail?.vehicleRequest;

    if (!vehicleRequest) {
        return <Typography sx={{ fontSize: '1.4rem', color: 'text.secondary' }}>Không có thông tin xe</Typography>;
    }

    return (
        <Stack sx={{ position: 'relative', p: 3 }}>
            <Typography
                variant="h6"
                sx={{ fontWeight: 'bold', mb: 2, fontSize: '1.6rem', textAlign: 'center', color: 'primary.main' }}
            >
                Danh sách người tham gia xe ({vehicleRequest.passengers?.length || 0} người)
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
                            <TableCell sx={{ fontWeight: 'bold', fontSize: '14px', backgroundColor: '#f0f0f0' }}>
                                STT
                            </TableCell>
                            <TableCell sx={{ fontWeight: 'bold', fontSize: '14px', backgroundColor: '#f0f0f0' }}>
                                Họ và tên
                            </TableCell>
                            <TableCell sx={{ fontWeight: 'bold', fontSize: '14px', backgroundColor: '#f0f0f0' }}>
                                Bộ phận
                            </TableCell>
                            <TableCell sx={{ fontWeight: 'bold', fontSize: '14px', backgroundColor: '#f0f0f0' }}>
                                Số điện thoại
                            </TableCell>
                            <TableCell sx={{ fontWeight: 'bold', fontSize: '14px', backgroundColor: '#f0f0f0' }}>
                                ghi chú
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {vehicleRequest.passengers?.map((passenger, index) => (
                            <TableRow key={passenger.id} sx={{ '&:nth-of-type(even)': { backgroundColor: '#f9f9f9' } }}>
                                <TableCell sx={{ fontSize: '14px', textAlign: 'center' }}>{index + 1}</TableCell>
                                <TableCell sx={{ fontSize: '14px' }}>{passenger.full_name}</TableCell>
                                <TableCell sx={{ fontSize: '14px' }}>{passenger.department || '-'}</TableCell>
                                <TableCell sx={{ fontSize: '14px' }}>{passenger.phone || '-'}</TableCell>
                                <TableCell sx={{ fontSize: '14px' }}>{passenger.notes || '-'}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Stack>
    );
}
