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
import { fetchRequests } from '../../../redux/slice/requestSlice';
import { fetchDepartments } from '../../../redux/slice/departmentSlice';
import HomeIcon from '@mui/icons-material/Home';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Sidebar() {
    const dispatch = useDispatch();
    const navigator = useNavigate();
    const activeSidebar = useSelector((state) => state.sidebar.activeSidebar);
    const activeCollapse = useSelector((state) => state.sidebar.activeCollapse);
    const departments = useSelector((state) => state.department.departments);
    const switchActiveSidebar = (path) => {
        if (activeSidebar === path) return;
        navigator(path);
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
            }}
        >
            <List>
                {/* menu1 */}
                <ListItemButton
                    id="Tổng quan"
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
                        <HomeIcon sx={commonIconStyle} />
                    </ListItemIcon>
                    <ListItemText primary="Tổng quan" primaryTypographyProps={{ sx: commonTextStyle }} />
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
                                primary={dept.departmentName}
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
                                            <StarBorder sx={commonIconStyle} />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={requestType.requestTypeName}
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
