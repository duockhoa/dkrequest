import { useEffect, useRef, useState } from 'react';
import { temphumiService } from '../../services/tempHumiService';
import { loginService } from '../../services/loginService';
import { useNavigate } from 'react-router-dom';
import { Stack, Paper, TableContainer, Table, TableHead, TableBody, TableRow, TableCell } from '@mui/material';
import { LineChart } from '@mui/x-charts/LineChart';

function Device1() {
    const [datas, setDatas] = useState([]);
    const filterDatas = datas.filter((_, index) => index % 10 === 0).reverse();

    const t = useRef();
    const navigate = useNavigate();

    const login = async () => {
        const status = await loginService();
        if (status.data) {
            getTempHumi();
        } else {
            navigate('/login');
        }
    };

    const getTempHumi = async () => {
        const result = await temphumiService();
        setDatas(result.data);
    };

    useEffect(() => {
        login();
    }, []);

    useEffect(() => {
        t.current = setInterval(() => {
            getTempHumi();
        }, 5000);
        return () => {
            clearInterval(t.current);
        };
    }, []);

    return (
        <Stack sx={{ width: '100%', height: '100%' }}>
            <Stack sx={{ width: '100%', height: '100%' }}>
                <Paper sx={{ width: '100%', height: '100%', display: 'flex', flexWrap: 'wrap' }} variant="outlined">
                    <Paper
                        sx={{
                            maxWidth: '450px',
                            maxHeight: '450px',
                            overflow: 'auto',
                            border: 'solid 1px red',
                            padding: 1,
                        }}
                        elevation={6}
                    >
                        <TableContainer component={Paper}>
                            <Table stickyHeader>
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ fontSize: '16px' }}>Thời điểm</TableCell>
                                        <TableCell sx={{ fontSize: '16px' }}>Nhiệt độ</TableCell>
                                        <TableCell sx={{ fontSize: '16px' }}>Độ ẩm</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {datas.map((data) => {
                                        return (
                                            <TableRow key={data.time}>
                                                <TableCell sx={{ fontSize: '16px' }}>
                                                    {' '}
                                                    {transTime(data.time)}{' '}
                                                </TableCell>
                                                <TableCell sx={{ fontSize: '16px' }}> {data.temp} </TableCell>
                                                <TableCell sx={{ fontSize: '16px' }}> {data.humi} </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                    <Paper sx={{ border: 'solid 1px red', width: '1000px', height: '450px' }}>
                        <LineChart
                            xAxis={[{ scaleType: 'point', data: filterDatas.map((item) => transTime(item.time)) }]}
                            series={[
                                {
                                    data: filterDatas.map((item) => item.temp),
                                    label: 'Nhiệt độ',
                                },
                            ]}
                            width={1000}
                            height={450}
                        />
                    </Paper>
                    <Paper sx={{ border: 'solid 1px red', width: '1000px', height: '450px' }}>
                        <LineChart
                            xAxis={[{ scaleType: 'point', data: filterDatas.map((item) => transTime(item.time)) }]}
                            series={[
                                {
                                    data: filterDatas.map((item) => item.humi),
                                    label: 'Độ ẩm',
                                },
                            ]}
                            width={1000}
                            height={450}
                        />
                    </Paper>
                </Paper>
            </Stack>
        </Stack>
    );
}

export default Device1;

function transTime(time) {
    const utcDate = new Date(time);
    const vietnamTime = utcDate.toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
    return vietnamTime;
}
