import { Divider, List, Stack } from '@mui/material';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import InboxIcon from '@mui/icons-material/Inbox';
import StarBorder from '@mui/icons-material/StarBorder';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { Box } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { setActiveCollapse } from '../../../redux/slice/sibarSlice';
import { fetchDepartments } from '../../../redux/slice/departmentSlice';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PaymentIcon from '@mui/icons-material/Payment';
import TimeToLeaveIcon from '@mui/icons-material/TimeToLeave';
import WorkIcon from '@mui/icons-material/Work';
import AssignmentIcon from '@mui/icons-material/Assignment';
import LocalMallIcon from '@mui/icons-material/LocalMall';
import SchoolIcon from '@mui/icons-material/School';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import AssessmentIcon from '@mui/icons-material/Assessment';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import FeedbackIcon from '@mui/icons-material/Feedback';
import Tooltip from '@mui/material/Tooltip';
import useMediaQuery from '@mui/material/useMediaQuery';
import { setIsOpen } from '../../../redux/slice/sibarSlice';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import BuildIcon from '@mui/icons-material/Build';
import FolderSharedIcon from '@mui/icons-material/FolderShared';

// Hàm ánh xạ tên đề nghị sang icon
const getRequestIcon = (name, description) => {
    let icon;
    switch (name) {
        case 'Đề nghị thanh toán':
            icon = <PaymentIcon fontSize="medium" />;
            break;
        case 'Đề nghị tạm ứng':
            icon = <AddCircleOutlineIcon fontSize="medium" />;
            break;
        case 'Đề nghị xin nghỉ':
            icon = <TimeToLeaveIcon fontSize="medium" />;
            break;
        case 'Đề nghị đăng ký làm thêm':
            icon = <WorkIcon fontSize="medium" />;
            break;
        case 'Đề nghị xác nhận công việc':
            icon = <AssignmentIcon fontSize="medium" />;
            break;
        case 'Đề nghị cung ứng VPP':
            icon = <LocalMallIcon fontSize="medium" />;
            break;
        case 'Đề nghị cung ứng thiết bị văn phòng':
            icon = <LocalMallIcon fontSize="medium" />;
            break;
        case 'Đề nghị cung ứng BHLĐ':
            icon = <LocalMallIcon fontSize="medium" />;
            break;
        case 'Đề nghị đào tạo':
            icon = <SchoolIcon fontSize="medium" />;
            break;
        case 'Đề nghị tuyển dụng':
            icon = <GroupAddIcon fontSize="medium" />;
            break;
        case 'Đề nghị đánh giá NL':
            icon = <AssessmentIcon fontSize="medium" />;
            break;
        case 'Yêu cầu chuẩn bị phòng họp':
            icon = <MeetingRoomIcon fontSize="medium" />;
            break;
        case 'Đề nghị chuyển phát nhanh':
            icon = <LocalShippingIcon fontSize="medium" />;
            break;
        case 'Đề nghị sửa chữa thiết bị văn phòng':
            icon = <BuildIcon fontSize="medium" />;
            break;
        case 'Công tác văn thư':
            icon = <FolderSharedIcon fontSize="medium" />;
            break;
        default:
            icon = <AssignmentIcon fontSize="medium" />;
    }
    return (
        <Tooltip
            title={description || name}
            arrow
            slotProps={{
                tooltip: {
                    sx: { fontSize: '1.2rem', padding: '10px 16px' },
                },
            }}
            disableInteractive={true}
        >
            {icon}
        </Tooltip>
    );
};

export default function Sidebar() {
    const isMobile = useMediaQuery('(max-width:600px)');
    const dispatch = useDispatch();
    const navigator = useNavigate();
    const activeSidebar = useSelector((state) => state.sidebar.activeSidebar);
    const activeCollapse = useSelector((state) => state.sidebar.activeCollapse);
    const departments = useSelector((state) => state.department.departments);
    const isOpen = useSelector((state) => state.sidebar.isOpen);

    const switchActiveSidebar = (path) => {
        // Xử lý external links (bắt đầu với http/https)
        if (path.startsWith('http')) {
            window.open(path, '_blank');
        } else {
            navigator(path);
        }

        if (isMobile) {
            dispatch(setIsOpen(false));
        }
    };

    // Handler riêng cho feedback
    const handleFeedbackClick = () => {
        const feedbackUrl =
            'https://docs.google.com/spreadsheets/d/1lmycHuIN5G415SxacnqFWMortfMYv48iUTfWzHKIzJw/edit?gid=0#gid=0';
        window.open(feedbackUrl, '_blank');

        if (isMobile) {
            dispatch(setIsOpen(false));
        }
    };

    useEffect(() => {
        dispatch(fetchDepartments());
    }, [dispatch]);

    const handleClick = (event) => {
        const buttonId = event.currentTarget.id;
        dispatch(setActiveCollapse(buttonId));
    };

    const commonIconStyle = {
        width: '20px',
        height: '20px',
    };

    const commonTextStyle = {
        fontSize: '1.4rem',
    };

    return (
        <Stack
            elevation={5}
            pl={2}
            borderTop={'1px solid #ddd'}
            sx={{
                width: '100%',
                height: '100%',
                backgroundColor: '#fff',
                overflowY: 'auto',
            }}
        >
            <List>
                {/* Menu Quan trọng */}
                <ListItemButton
                    id="Quan trọng"
                    sx={{
                        '&:hover': {
                            backgroundColor: '#f5f5f5',
                        },
                        py: 0.7,
                        borderRadius: '800px',
                        backgroundColor: activeSidebar === '/' ? '#e3f2fd' : 'inherit',
                    }}
                    onClick={() => switchActiveSidebar('/')}
                >
                    <ListItemIcon sx={{ minWidth: '40px' }}>
                        <StarBorder sx={commonIconStyle} />
                    </ListItemIcon>
                    <ListItemText primary={!isOpen || 'Quan trọng'} primaryTypographyProps={{ sx: commonTextStyle }} />
                </ListItemButton>

                <Divider />

                {/* Render động các phòng ban và request type */}
                {departments.map((dept) => (
                    <div key={dept.departmentName}>
                        <ListItemButton
                            id={dept.departmentName}
                            onClick={handleClick}
                            sx={{
                                '&:hover': {
                                    backgroundColor: '#f5f5f5',
                                },
                                py: 0.7,
                                borderRadius: '800px',
                            }}
                        >
                            <ListItemIcon sx={{ minWidth: '40px' }}>
                                <InboxIcon sx={commonIconStyle} />
                            </ListItemIcon>
                            <ListItemText
                                primary={!isOpen || dept.departmentName}
                                primaryTypographyProps={{ sx: commonTextStyle }}
                            />
                            {activeCollapse?.includes(dept.departmentName) ? (
                                <ExpandLess sx={commonIconStyle} />
                            ) : (
                                <ExpandMore sx={commonIconStyle} />
                            )}
                        </ListItemButton>
                        <Collapse in={activeCollapse?.includes(dept.departmentName)} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding>
                                {dept.requestTypes.map((requestType) => (
                                    <ListItemButton
                                        key={requestType.requestTypeName}
                                        sx={{
                                            pl: 4,
                                            '&:hover': {
                                                backgroundColor: '#f5f5f5',
                                            },
                                            backgroundColor:
                                                activeSidebar === requestType.requestTypePath ? '#e3f2fd' : 'inherit',
                                            py: 0.7,
                                            borderRadius: '800px',
                                        }}
                                        onClick={() => {
                                            switchActiveSidebar(requestType.requestTypePath);
                                        }}
                                    >
                                        <ListItemIcon sx={{ minWidth: '40px' }}>
                                            {getRequestIcon(requestType.requestTypeName, requestType.description)}
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={!isOpen || requestType.requestTypeName}
                                            primaryTypographyProps={{ sx: commonTextStyle }}
                                        />
                                    </ListItemButton>
                                ))}
                            </List>
                        </Collapse>
                    </div>
                ))}

                {/* Divider trước menu Góp ý */}
                <Divider />

                {/* Menu Góp ý - mở Google Sheets trong tab mới */}
                <ListItemButton
                    id="Góp ý"
                    sx={{
                        '&:hover': {
                            backgroundColor: '#f5f5f5',
                        },
                        py: 0.7,
                        borderRadius: '800px',
                        backgroundColor: 'inherit', // Không highlight vì không phải internal route
                    }}
                    onClick={handleFeedbackClick}
                >
                    <ListItemIcon sx={{ minWidth: '40px' }}>
                        <FeedbackIcon sx={commonIconStyle} />
                    </ListItemIcon>
                    <ListItemText
                        primary={!isOpen || 'Đóng góp ý kiến'}
                        primaryTypographyProps={{ sx: commonTextStyle }}
                    />
                </ListItemButton>
            </List>

            <Box flexGrow={1}></Box>

            <Box
                sx={{
                    textAlign: 'center',
                    fontSize: '1.1rem',
                    color: '#888',
                    py: 1,
                    borderTop: '1px solid #eee',
                    background: '#fafbfc',
                    letterSpacing: 1,
                }}
            >
                version: 1.0.107
            </Box>
        </Stack>
    );
}
