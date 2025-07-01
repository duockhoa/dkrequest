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
import HomeIcon from '@mui/icons-material/Home';
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
import Tooltip from '@mui/material/Tooltip';
import useMediaQuery from '@mui/material/useMediaQuery';
import { setIsOpen } from '../../../redux/slice/sibarSlice';

// Hàm ánh xạ tên đề nghị sang icon
const getRequestIcon = (name, description) => {
    let icon;
    switch (name) {
        case 'Đề nghị thanh toán':
            icon = <PaymentIcon fontSize="large" />;
            break;
        case 'Đề nghị tạm ứng':
            icon = <AddCircleOutlineIcon fontSize="large" />;
            break;
        case 'Đề nghị xin nghỉ':
            icon = <TimeToLeaveIcon fontSize="large" />;
            break;
        case 'Đề nghị đăng ký làm thêm':
            icon = <WorkIcon fontSize="large" />;
            break;
        case 'Đề nghị xác nhận công việc':
            icon = <AssignmentIcon fontSize="large" />;
            break;
        case 'Đề nghị cung ứng VPP':
            icon = <LocalMallIcon fontSize="large" />;
            break;
        case 'Đề nghị cung ứng BHLĐ':
            icon = <LocalMallIcon fontSize="large" />;
            break;
        case 'Đề nghị đào tạo':
            icon = <SchoolIcon fontSize="large" />;
            break;
        case 'Đề nghị tuyển dụng':
            icon = <GroupAddIcon fontSize="large" />;
            break;
        case 'Đề nghị đánh giá NL':
            icon = <AssessmentIcon fontSize="large" />;
            break;
        default:
            icon = <AssignmentIcon fontSize="large" />;
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
        navigator(path);
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
                {/* menu1 */}
                <ListItemButton
                    id="Quan trọng"
                    sx={{
                        '&:hover': {
                            backgroundColor: '#f5f5f5',
                        },
                        py: 0.7, // Giảm chiều cao menu
                        borderRadius: '800px',
                        backgroundColor: activeSidebar === '/' ? '#e3f2fd' : 'inherit', // Thêm dòng này
                    }}
                    onClick={() => switchActiveSidebar('/')} // Thêm dòng này
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
                                py: 0.7, // Giảm chiều cao menu
                                borderRadius: '800px', // Thêm dòng này
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
                                            py: 0.7, // Giảm chiều cao menu
                                            borderRadius: '800px', // Thêm dòng này
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
            </List>
            <Box flexGrow={1}></Box>
        </Stack>
    );
}
