import Paper from '@mui/material/Paper';
import { Box, Typography, Grid, Card, CardContent } from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';

export default function Home() {
    const stats = [
        { label: 'Tổng số yêu cầu', value: 120 },
        { label: 'Đang xử lý', value: 35 },
        { label: 'Đã hoàn thành', value: 70 },
        { label: 'Từ chối', value: 15 },
        { label: 'Đến hạn', value: 10 }, // Thêm số yêu cầu đến hạn
        { label: 'Quá hạn', value: 5 }, // Thêm số yêu cầu quá hạn
    ];

    return (
        <Paper sx={{ width: '100%', height: '100%', p: 3 }}>
            <Typography variant="h5" gutterBottom>
                Tổng quan các yêu cầu
            </Typography>
            <Grid container spacing={2} mt={1}>
                {stats.map((stat) => (
                    <Grid item xs={12} sm={6} md={3} key={stat.label}>
                        <Card sx={{ background: '#e3f2fd' }}>
                            <CardContent>
                                <Typography variant="h6" color="text.secondary" gutterBottom>
                                    {stat.label}
                                </Typography>
                                <Typography variant="h4" color="primary">
                                    {stat.value}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Paper>
    );
}
