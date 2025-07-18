import { Tabs, Tab, Box, Typography, Stack, Avatar, Chip, AvatarGroup, Dialog, Divider, Badge } from '@mui/material';
import { useState, useEffect, useRef } from 'react';
import AddIcon from '@mui/icons-material/Add';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import MarkAsUnreadIcon from '@mui/icons-material/MarkAsUnread';
// Bỏ import DraftsIcon
import Button from '@mui/material/Button';
import { format, isSameDay } from 'date-fns';
import AddRequestForm from '../../Form/AddRequestForm';
import { useSelector, useDispatch } from 'react-redux';
import { fetchRequests } from '../../../redux/slice/requestSlice';
import { useNavigate } from 'react-router-dom';
import { useElementWidth } from '../../../hooks/useElementWidth';
import { clearRequestFormData, clearErrors } from '../../../redux/slice/requestFormDataSlice';
import { setRequestData } from '../../../redux/slice/requestSlice';
import LoadingPage from '../LoadingPage';
import useMediaQuery from '@mui/material/useMediaQuery';
import ExportReport from '../Button/ExportReport';
import StationeryItems from '../Button/StationeryItems';

const tabList = ['Tất cả', 'Đến lượt duyệt', 'Quá hạn', 'Đang chờ duyệt', 'Đã chấp nhận', 'Đã từ chối'];

export default function Requests() {
    const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));

    const navigate = useNavigate();
    const [tab, setTab] = useState(0);
    const [openForm, setOpenForm] = useState(false);
    const dispatch = useDispatch();
    const requests = useSelector((state) => state.request.requestData);
    const originalData = useSelector((state) => state.request.originalData);
    const loading = useSelector((state) => state.request.loading);
    const requestTypeId = useSelector((state) => state.requestId.requestTypeId);
    const requestId = useSelector((state) => state.requestId.requestId);
    const user = useSelector((state) => state.user.userInfo);

    useEffect(() => {
        if (requestTypeId) {
            dispatch(fetchRequests({ requestTypeId, user_id: user.id }));
        }
    }, [dispatch, requestTypeId]);

    // Thêm useEffect để filter theo tab
    useEffect(() => {
        if (originalData.length > 0) {
            let filteredRequests = [...originalData];

            switch (tabList[tab]) {
                case 'Tất cả':
                    // Hiển thị tất cả
                    filteredRequests = originalData;
                    break;
                case 'Đang chờ duyệt':
                    filteredRequests = originalData.filter((request) => request.status === 'pending');
                    break;
                case 'Đã chấp nhận':
                    filteredRequests = originalData.filter((request) => request.status === 'approved');
                    break;
                case 'Đã từ chối':
                    filteredRequests = originalData.filter((request) => request.status === 'rejected');
                    break;
                case 'Đến lượt duyệt':
                    // Filter requests mà user hiện tại cần phê duyệt
                    filteredRequests = originalData.filter((request) => {
                        if (request.status !== 'pending') return false;

                        // Tìm approver có step nhỏ nhất trong các pending approvers
                        const pendingApprovers = request.approvers.filter((approver) => approver.status === 'pending');
                        if (pendingApprovers.length === 0) return false;

                        const nextStep = Math.min(...pendingApprovers.map((approver) => approver.step));
                        const nextApprover = pendingApprovers.find((approver) => approver.step === nextStep);

                        return nextApprover && nextApprover.user_id === user.id;
                    });
                    break;
                case 'Quá hạn':
                    // Có thể thêm logic quá hạn nếu có trường deadline
                    filteredRequests = originalData.filter((request) => {
                        // Tạm thời filter theo requests pending quá 7 ngày
                        const createDate = new Date(request.createAt);
                        const now = new Date();
                        const daysDiff = Math.floor((now - createDate) / (1000 * 60 * 60 * 24));
                        return request.status === 'pending' && daysDiff > 7;
                    });
                    break;
                default:
                    filteredRequests = originalData;
            }

            dispatch(setRequestData(filteredRequests));
        }
    }, [tab, originalData, dispatch, user.id]);

    // Hàm để mở/đóng form
    const handleToggleForm = () => {
        setOpenForm(!openForm);
        if (!openForm) {
            dispatch(clearRequestFormData());
            dispatch(clearErrors());
        }
    };

    // Thêm hàm getStatusConfig để xử lý style và label theo requestStatus
    const getStatusConfig = (status) => {
        switch (status) {
            case 'approved':
                return {
                    label: 'Chấp nhận',
                    bgcolor: '#4caf50', // success main color
                    color: '#ffffff', // white text
                };
            case 'rejected':
                return {
                    label: 'Từ chối',
                    bgcolor: '#f44336', // error main color
                    color: '#ffffff', // white text
                };
            case 'pending':
            default:
                return {
                    label: 'Chờ duyệt',
                    bgcolor: '#ff9800', // warning main color
                    color: '#ffffff', // white text
                };
        }
    };

    // Hàm tạo badge icon cho trạng thái approver
    const getApproverBadgeIcon = (status) => {
        switch (status) {
            case 'approved':
                return (
                    <CheckCircleIcon
                        sx={{
                            fontSize: 14,
                            color: '#4caf50',
                            bgcolor: 'white',
                            borderRadius: '50%',
                        }}
                    />
                );
            case 'rejected':
                return (
                    <CancelIcon
                        sx={{
                            fontSize: 14,
                            color: '#f44336',
                            bgcolor: 'white',
                            borderRadius: '50%',
                        }}
                    />
                );
            default:
                return null;
        }
    };

    // Hàm lấy trạng thái tiếp nhận - Cập nhật để bỏ icon và hiển thị cho cả trường hợp
    const getReceiveStatus = (request) => {
        if (!request.isReceived) {
            return {
                icon: <MarkAsUnreadIcon sx={{ fontSize: 16, color: 'warning.main' }} />,
                label: 'Chưa tiếp nhận',
                color: 'warning.main',
            };
        } else {
            return {
                icon: null, // Bỏ icon
                label: 'Đã tiếp nhận',
                color: 'success.main',
            };
        }
    };

    // Hàm nhóm requests theo ngày
    const groupRequestsByDate = (requests) => {
        const groups = [];
        let currentDate = null;
        let currentGroup = [];

        requests.forEach((request) => {
            const requestDate = new Date(request.createAt);

            if (!currentDate || !isSameDay(currentDate, requestDate)) {
                // Nếu có group trước đó, push vào groups
                if (currentGroup.length > 0) {
                    groups.push({
                        date: currentDate,
                        requests: currentGroup,
                    });
                }
                // Tạo group mới
                currentDate = requestDate;
                currentGroup = [request];
            } else {
                // Cùng ngày, thêm vào group hiện tại
                currentGroup.push(request);
            }
        });

        // Đừng quên group cuối cùng
        if (currentGroup.length > 0) {
            groups.push({
                date: currentDate,
                requests: currentGroup,
            });
        }

        return groups;
    };

    // Component Date Separator
    const DateSeparator = ({ date }) => (
        <Box
            sx={{
                bgcolor: '#f5f5f5',
                borderTop: '1px solid #e0e0e0',
                borderBottom: '1px solid #e0e0e0',
                py: 1,
                px: 2,
                top: 0,
                zIndex: 1,
            }}
        >
            <Typography
                sx={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: 'primary.main',
                }}
            >
                {format(date, 'dd/MM/yyyy')}
            </Typography>
        </Box>
    );

    const containerRef = useRef(null);
    const containerWidth = useElementWidth(containerRef);

    // Định nghĩa ngưỡng hiển thị
    const showCreator = containerWidth > 700;
    const showApprovers = containerWidth > 900;
    const showId = containerWidth > 1100;
    const showExportButton = containerWidth > 600; // Ngưỡng cho nút xuất báo cáo

    return (
        <Stack
            ref={containerRef}
            sx={{
                height: '100%',
                border: '1px solid #ccc',
                padding: 1,
            }}
            spacing={0}
        >
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'nowrap',
                    gap: 1,
                }}
            >
                <Box
                    sx={{
                        flex: 1,
                        minWidth: 0,
                        overflow: 'hidden',
                    }}
                >
                    <Tabs
                        value={tab}
                        onChange={(e, newValue) => setTab(newValue)} // Logic filter sẽ chạy qua useEffect
                        variant="scrollable"
                        scrollButtons="auto"
                        allowScrollButtonsMobile
                    >
                        {tabList.map((label, index) => (
                            <Tab key={index} sx={{ fontWeight: 600, fontSize: 11 }} label={label} />
                        ))}
                    </Tabs>
                </Box>

                <Stack
                    direction="row"
                    spacing={1}
                    sx={{
                        flexShrink: 0,
                        minWidth: 'fit-content',
                    }}
                >
                    {/* Sử dụng component StationeryItems */}
                    {showExportButton && <StationeryItems />}

                    {/* Sử dụng component ExportReport */}
                    {showExportButton && <ExportReport />}

                    {typeof requestTypeId === 'number' && requestTypeId > 0 && (
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<AddIcon />}
                            onClick={handleToggleForm}
                            sx={{
                                fontSize: 12,
                                whiteSpace: 'nowrap',
                                minWidth: 'auto',
                            }}
                        >
                            {isMobile ? 'Thêm' : 'Thêm mới'}
                        </Button>
                    )}
                </Stack>
            </Box>

            <Divider sx={{ borderColor: 'black' }} />

            <Dialog
                open={openForm}
                onClose={handleToggleForm}
                fullWidth
                sx={{
                    '& .MuiDialog-paper': {
                        borderRadius: 2,
                        maxWidth: requestTypeId === 4 ? 'lg' : 'xs',
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

            {loading ? (
                <LoadingPage />
            ) : (
                <Box overflow="auto">
                    {/* Render requests grouped by date */}
                    {groupRequestsByDate(requests).map((group, groupIndex) => (
                        <Box key={group.date.toISOString()}>
                            {/* Date Separator */}
                            <DateSeparator date={group.date} />

                            {/* Requests in this date group */}
                            {group.requests.map((request, index) => (
                                <Box
                                    key={request.id}
                                    onClick={() => {
                                        navigate(`?view=detail&requestid=${request.id}`);
                                    }}
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        pt: 1.5,
                                        pb: 1.5,
                                        pl: 2,
                                        pr: 1,
                                        borderBottom: '1px solid #e0e0e0',
                                        '&:hover': {
                                            bgcolor: '#f0f7ff',
                                            transition: 'background-color 0.2s ease',
                                        },
                                        cursor: 'pointer',
                                        backgroundColor: requestId === request.id ? '#e3f2fd' : '#fff',
                                        minHeight: 64,
                                    }}
                                >
                                    {/* Tên đề xuất */}
                                    <Box
                                        sx={{
                                            flex: 2,
                                            minWidth: 0,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <Stack direction="row" alignItems="center" spacing={1}>
                                            <Typography
                                                sx={{
                                                    fontWeight: 500,
                                                    fontSize: 14,
                                                    whiteSpace: 'nowrap',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    maxWidth: '900px',
                                                    lineHeight: 1.2,
                                                }}
                                            >
                                                {request.requestName}
                                            </Typography>
                                            {/* Completion Status Icon */}
                                            {request.isCompleted && (
                                                <TaskAltIcon
                                                    sx={{
                                                        fontSize: 16,
                                                        color: 'info.main',
                                                        flexShrink: 0,
                                                    }}
                                                    titleAccess="Đã hoàn thành"
                                                />
                                            )}
                                            {/* Receive Status Icon - Hiển thị cho approved requests và chỉ khi chưa tiếp nhận */}
                                            {request.status === 'approved' && !request.isReceived && (
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        flexShrink: 0,
                                                    }}
                                                    title={getReceiveStatus(request).label}
                                                >
                                                    {getReceiveStatus(request).icon}
                                                </Box>
                                            )}
                                        </Stack>
                                    </Box>

                                    {/* Người tạo - Ẩn khi màn hình nhỏ */}
                                    {showCreator && (
                                        <Box
                                            sx={{
                                                minWidth: 150,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}
                                        >
                                            <Stack direction="row" spacing={0.5} alignItems="center">
                                                <Avatar src={request.requestor.avatar} sx={{ width: 24, height: 24 }} />
                                                <Typography sx={{ fontSize: 13, lineHeight: 1.2 }}>
                                                    {request.requestor.name}
                                                </Typography>
                                            </Stack>
                                        </Box>
                                    )}

                                    {/* Trạng thái - Luôn hiển thị */}
                                    <Box
                                        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 2 }}
                                    >
                                        <Chip
                                            label={getStatusConfig(request.status).label}
                                            size="small"
                                            sx={{
                                                minWidth: 90,
                                                fontSize: 12,
                                                bgcolor: getStatusConfig(request.status).bgcolor,
                                                color: getStatusConfig(request.status).color,
                                                fontWeight: 600,
                                                height: 24,
                                            }}
                                        />
                                    </Box>

                                    {/* Người phê duyệt với badge trạng thái - Ẩn khi màn hình nhỏ */}
                                    {showApprovers && (
                                        <Box
                                            sx={{
                                                minWidth: 100,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}
                                        >
                                            <AvatarGroup
                                                max={3}
                                                sx={{
                                                    '& .MuiAvatar-root': { width: 24, height: 24, fontSize: 12 },
                                                }}
                                            >
                                                {request.approvers.map((approver) => (
                                                    <Badge
                                                        key={approver.id}
                                                        overlap="circular"
                                                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                                        badgeContent={getApproverBadgeIcon(approver.status)}
                                                    >
                                                        <Avatar
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
                                                            {approver?.approver?.name
                                                                ? approver.approver.name.charAt(0)
                                                                : ''}
                                                        </Avatar>
                                                    </Badge>
                                                ))}
                                            </AvatarGroup>
                                        </Box>
                                    )}

                                    {/* ID and Completion + Receive Status - Ẩn khi màn hình nhỏ */}
                                    {showId && (
                                        <Box
                                            sx={{
                                                ml: 2,
                                                minWidth: 250, // Tăng width để chứa thêm receive status chip
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'flex-end',
                                            }}
                                        >
                                            <Stack direction="row" spacing={1} alignItems="center">
                                                {/* Completion Status */}
                                                <Chip
                                                    label={request.isCompleted ? 'Hoàn thành' : 'Chưa hoàn thành'}
                                                    size="small"
                                                    variant="outlined"
                                                    sx={{
                                                        fontSize: 10,
                                                        color: request.isCompleted ? 'info.main' : 'grey.600',
                                                        borderColor: request.isCompleted ? 'info.main' : 'grey.400',
                                                        height: 24,
                                                    }}
                                                />

                                                {/* Receive Status - hiển thị cho tất cả approved requests với style tương tự completion */}
                                                {
                                                    <Chip
                                                        label={request.isReceived ? 'Đã tiếp nhận' : 'Chưa tiếp nhận'}
                                                        size="small"
                                                        variant="outlined"
                                                        sx={{
                                                            fontSize: 10,
                                                            color: request.isReceived ? 'success.main' : 'warning.main',
                                                            borderColor: request.isReceived
                                                                ? 'success.main'
                                                                : 'warning.main',
                                                            height: 24,
                                                            // Thêm animation cho trạng thái chưa tiếp nhận
                                                            ...(request.isReceived
                                                                ? {}
                                                                : {
                                                                      animation: 'pulse 2s infinite',
                                                                      '@keyframes pulse': {
                                                                          '0%': { opacity: 1 },
                                                                          '50%': { opacity: 0.7 },
                                                                          '100%': { opacity: 1 },
                                                                      },
                                                                  }),
                                                        }}
                                                    />
                                                }

                                                {/* Request ID */}
                                                <Typography
                                                    sx={{
                                                        fontSize: 12,
                                                        color: 'text.secondary',
                                                        bgcolor: '#f5f5f5',
                                                        px: 1,
                                                        py: 0.5,
                                                        borderRadius: 1,
                                                        lineHeight: 1.2,
                                                        minHeight: 24,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                    }}
                                                >
                                                    #{request.id}
                                                </Typography>
                                            </Stack>
                                        </Box>
                                    )}
                                </Box>
                            ))}
                        </Box>
                    ))}
                </Box>
            )}
        </Stack>
    );
}
