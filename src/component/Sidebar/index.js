import { Divider, List, Stack } from '@mui/material';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import InboxIcon from '@mui/icons-material/Inbox';
import StarBorder from '@mui/icons-material/StarBorder';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { useSelector, useDispatch } from 'react-redux';
import { setActiveCollapse } from '../../redux/slice/sibarSlice';
import HomeIcon from '@mui/icons-material/Home';

export default function Sidebar() {
    const activeSidebar = useSelector((state) => state.sidebar.activeSidebar);
    const activeCollapse = useSelector((state) => state.sidebar.activeCollapse);
    const dispatch = useDispatch();

    const handleClick = (event) => {
        const buttonId = event.currentTarget.id;
        dispatch(setActiveCollapse(buttonId));
    };

    const commonIconStyle = {
        width: '24px',
        height: '24px',
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
                    id="Trang chủ"
                    sx={{
                        '&:hover': {
                            backgroundColor: '#f5f5f5',
                        },
                        py: 1.5,
                    }}
                >
                    <ListItemIcon sx={{ minWidth: '40px' }}>
                        <HomeIcon sx={commonIconStyle} />
                    </ListItemIcon>
                    <ListItemText primary="Trang chủ" primaryTypographyProps={{ sx: commonTextStyle }} />
                </ListItemButton>
                <Divider></Divider>

                <ListItemButton
                    id="Phòng ĐBCL"
                    onClick={handleClick}
                    sx={{
                        '&:hover': {
                            backgroundColor: '#f5f5f5',
                        },
                        py: 1.5,
                    }}
                >
                    <ListItemIcon sx={{ minWidth: '40px' }}>
                        <InboxIcon sx={commonIconStyle} />
                    </ListItemIcon>
                    <ListItemText primary="Phòng ĐBCL" primaryTypographyProps={{ sx: commonTextStyle }} />
                    {activeCollapse?.includes('Phòng ĐBCL') ? (
                        <ExpandLess sx={commonIconStyle} />
                    ) : (
                        <ExpandMore sx={commonIconStyle} />
                    )}
                </ListItemButton>

                <Collapse in={activeCollapse?.includes('Phòng ĐBCL')} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        <ListItemButton
                            sx={{
                                pl: 4,
                                '&:hover': {
                                    backgroundColor: '#f5f5f5',
                                },
                                py: 1.5,
                            }}
                        >
                            <ListItemIcon sx={{ minWidth: '40px' }}>
                                <StarBorder sx={commonIconStyle} />
                            </ListItemIcon>
                            <ListItemText primary="Phiếu pha chế" primaryTypographyProps={{ sx: commonTextStyle }} />
                        </ListItemButton>
                        <ListItemButton
                            sx={{
                                pl: 4,
                                '&:hover': {
                                    backgroundColor: '#f5f5f5',
                                },
                                py: 1.5,
                            }}
                        >
                            <ListItemIcon sx={{ minWidth: '40px' }}>
                                <StarBorder sx={commonIconStyle} />
                            </ListItemIcon>
                            <ListItemText
                                primary="Quy trình sản xuất"
                                primaryTypographyProps={{ sx: commonTextStyle }}
                            />
                        </ListItemButton>
                    </List>
                </Collapse>
            </List>
        </Stack>
    );
}
