import { Paper, Tabs, Tab, Box, Typography, Stack, Avatar, Chip, AvatarGroup, Dialog, Divider } from '@mui/material';
import { useState, useEffect, useRef } from 'react';
import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import { format } from 'date-fns';
import AddRequestForm from '../../Form/AddRequestForm';
import { useSelector, useDispatch } from 'react-redux';
import { fetchRequests } from '../../../redux/slice/requestSlice';
import { useNavigate } from 'react-router-dom';
import { useElementWidth } from '../../../hooks/useElementWidth';
import { clearRequestFormData, clearErrors } from '../../../redux/slice/requestFormDataSlice';
import LoadingPage from '../LoadingPage';
import useMediaQuery from '@mui/material/useMediaQuery';

const tabList = ['Tất cả', 'Đến lượt duyệt', 'Quá hạn', 'Đang chờ duyệt', 'Đã chấp nhận', 'Đã từ chối'];
const miniTabList = ['Tất cả', 'Đã chấp nhận', 'Đã từ chối'];

export default function Requests() {
    const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));

    const navigate = useNavigate();
    const [tab, setTab] = useState(0);
    const [openForm, setOpenForm] = useState(false); // thêm state này
    const dispatch = useDispatch();
    const requests = useSelector((state) => state.request.requestData);
    const loading = useSelector((state) => state.request.loading); // Add this line
    const requestTypeId = useSelector((state) => state.requestId.requestTypeId);
    const requestId = useSelector((state) => state.requestId.requestId);
    useEffect(() => {
        dispatch(fetchRequests(requestTypeId));
    }, [dispatch, requestTypeId]);

    // Hàm để mở/đóng form
    const handleToggleForm = () => {
        setOpenForm(!openForm);
        if (!openForm) {
            // Reset form data when opening the form
            dispatch(clearRequestFormData());
            dispatch(clearErrors());
        }
    };

    // Thêm hàm getStatusConfig để xử lý style và label theo requestStatus
    const getStatusConfig = (status) => {
        switch (status) {
            case 'approved':
                return {
                    label: 'Chấp thuận',
                    bgcolor: '#e8f5e9',
                    color: '#2e7d32',
                };
            case 'rejected':
                return {
                    label: 'Từ chối',
                    bgcolor: '#ffebee',
                    color: '#d32f2f',
                };
            case 'pending':
            default:
                return {
                    label: 'Chờ duyệt',
                    bgcolor: '#fff3e0',
                    color: '#ed6c02',
                };
        }
    };

    const containerRef = useRef(null);
    const containerWidth = useElementWidth(containerRef);

    // Định nghĩa ngưỡng hiển thị
    const showCreator = containerWidth > 700;
    const showApprovers = containerWidth > 900;
    const showId = containerWidth > 1100;
    // Update thresholds
    const showTabs = containerWidth > 600; // Thêm ngưỡng cho tabs

    // Adjust the tab display logic
    const renderTabs = () => {
        if (!showTabs) {
            return (
                <Tabs
                    value={tab}
                    onChange={(e, newValue) => setTab(newValue)}
                    variant="scrollable"
                    scrollButtons="auto"
                    allowScrollButtonsMobile
                >
                    {miniTabList.map((label, index) => (
                        <Tab
                            key={index}
                            sx={{
                                fontWeight: 600,
                                fontSize: 11,
                                minWidth: 'auto',
                                px: 2,
                            }}
                            label={label}
                        />
                    ))}
                </Tabs>
            );
        }

        return (
            <Tabs
                value={tab}
                onChange={(e, newValue) => setTab(newValue)}
                variant="scrollable"
                scrollButtons="auto"
                allowScrollButtonsMobile
            >
                {tabList.map((label, index) => (
                    <Tab key={index} sx={{ fontWeight: 600, fontSize: 11 }} label={label} />
                ))}
            </Tabs>
        );
    };

    return (
        <Stack ref={containerRef} sx={{ height: '100%', border: '1px solid #ccc', padding: '16px' }} spacing={2}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                {renderTabs()}
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={handleToggleForm}
                    sx={{ fontSize: 12 }}
                >
                    Thêm mới
                </Button>
            </Box>
            <Divider sx={{ borderColor: 'black', mb: 1 }} />

            <Dialog
                open={openForm}
                onClose={handleToggleForm}
                fullWidth
                sx={{
                    '& .MuiDialog-paper': {
                        borderRadius: 2,

                        maxWidth: '650px',
                        width: '100%',
                    },
                }}
                PaperProps={{
                    sx: {
                        width: isMobile ? '100%' : 'auto',
                        height: isMobile ? '100%' : 'auto',
                        margin: isMobile ? 0 : 'auto',
                        maxHeight: isMobile ? '100%' : '90vh',
                        maxWidth: isMobile ? '100%' : '600px',
                    },
                }}
            >
                <AddRequestForm onClose={handleToggleForm} />
            </Dialog>

            {/* Replace the loading implementation with LoadingPage */}
            {loading ? (
                <LoadingPage />
            ) : (
                <Box overflow="auto">
                    <Stack spacing={1}>
                        {requests.map((request) => (
                            <Paper
                                elevation={2}
                                key={request.id}
                                onClick={() => {
                                    navigate(`?view=detail&requestid=${request.id}`); // Thêm requestTypeId vào URL
                                }}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    p: 1.5,
                                    borderBottom: '1px solid #eee',
                                    '&:hover': { bgcolor: '#f5faff' },
                                    cursor: 'pointer',
                                    backgroundColor: requestId === request.id ? '#e3f2fd' : '#fff',
                                }}
                            >
                                {/* Tên đề xuất và ngày */}
                                <Box sx={{ flex: 2, minWidth: 0 }}>
                                    <Typography
                                        sx={{
                                            fontWeight: 500,
                                            fontSize: 14,
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            maxWidth: '300px',
                                        }}
                                    >
                                        {request.requestName}
                                    </Typography>
                                    <Typography
                                        sx={{
                                            fontSize: 12,
                                            color: '#1976d2',
                                        }}
                                    >
                                        {format(new Date(request.createAt), 'dd-MM-yyyy')}
                                    </Typography>
                                </Box>

                                {/* Người tạo - Ẩn khi màn hình nhỏ */}
                                {showCreator && (
                                    <Stack direction="row" spacing={0.5} sx={{ minWidth: 150, alignItems: 'center' }}>
                                        <Avatar src={request.requestor.avatar} sx={{ width: 24, height: 24 }} />
                                        <Typography sx={{ fontSize: 13 }}>{request.requestor.name}</Typography>
                                    </Stack>
                                )}

                                {/* Trạng thái - Luôn hiển thị */}
                                <Chip
                                    label={getStatusConfig(request.status).label}
                                    size="small"
                                    sx={{
                                        minWidth: 90,
                                        fontSize: 12,
                                        bgcolor: getStatusConfig(request.status).bgcolor,
                                        color: getStatusConfig(request.status).color,
                                        fontWeight: 600,
                                        mx: 2,
                                    }}
                                />

                                {/* Người phê duyệt - Ẩn khi màn hình nhỏ */}
                                {showApprovers && (
                                    <Stack direction="row" spacing={0.5} sx={{ minWidth: 100, alignItems: 'center' }}>
                                        <AvatarGroup
                                            max={3}
                                            sx={{
                                                '& .MuiAvatar-root': { width: 24, height: 24, fontSize: 12 },
                                            }}
                                        >
                                            {request.approvers.map((approver) => (
                                                <Avatar
                                                    key={approver.id}
                                                    // Thêm kiểm tra null/undefined
                                                    src={approver?.approver.avatar}
                                                    alt={approver?.approver.name || ''}
                                                    sx={{
                                                        bgcolor:
                                                            approver.status === 'pending'
                                                                ? '#e0e0e0'
                                                                : approver.status === 'approved'
                                                                ? '#e8f5e9'
                                                                : '#ffebee',
                                                    }}
                                                >
                                                    {/* Thêm kiểm tra trước khi truy cập */}
                                                    {approver?.name ? approver.name.charAt(0) : ''}
                                                </Avatar>
                                            ))}
                                        </AvatarGroup>
                                    </Stack>
                                )}

                                {/* ID - Ẩn khi màn hình nhỏ */}
                                {showId && (
                                    <Box
                                        sx={{
                                            ml: 2,
                                            minWidth: 80,
                                            display: 'flex',
                                            justifyContent: 'flex-end',
                                        }}
                                    >
                                        <Typography
                                            sx={{
                                                fontSize: 12,
                                                color: 'text.secondary',
                                                bgcolor: '#f5f5f5',
                                                px: 1,
                                                py: 0.5,
                                                borderRadius: 1,
                                            }}
                                        >
                                            #{request.id}
                                        </Typography>
                                    </Box>
                                )}
                            </Paper>
                        ))}
                    </Stack>
                </Box>
            )}

            {/* ...existing Dialog code... */}
        </Stack>
    );
}
