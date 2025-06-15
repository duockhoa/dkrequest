import AppBar from '@mui/material/AppBar';
import { Box, Toolbar, Typography } from '@mui/material';
import Avatar from '../Avatar';
import Notification from '../Notification';
import { logo } from '../../../assets/images';
import { Link } from 'react-router-dom';
import Search from '../Search';
import { useSelector, useDispatch } from 'react-redux';
import { setIsOpen, clearActiveCollapse } from '../../../redux/slice/sibarSlice';
import MenuIcon from '@mui/icons-material/Menu';
import IconButton from '@mui/material/IconButton';

function Header() {
    const isSidebarOpen = useSelector((state) => state.sidebar.isOpen);
    const dispatch = useDispatch();

    function handleMenuClick() {
        dispatch(setIsOpen(!isSidebarOpen));
        dispatch(clearActiveCollapse()); // Reset active collapse when menu is clicked
    }

    return (
        <AppBar
            position="static"
            sx={{
                backgroundColor: 'rgb(255,255,255)',
                height: '56px',
            }}
        >
            <Toolbar variant="dense">
                <IconButton onClick={handleMenuClick} size="small" style={{ padding: 6 }}>
                    <MenuIcon style={{ fontSize: 22 }} />
                </IconButton>
                <Link to="/" style={{ height: '100%', display: 'flex', paddingLeft: 16 }}>
                    <img
                        src={logo}
                        alt="Logo"
                        style={{
                            display: 'block',
                            height: '70%',
                            margin: 'auto',
                        }}
                    />
                </Link>

                {/* Title */}
                <Typography
                    color="text.primary"
                    fontSize={18}
                    sx={{
                        paddingLeft: 4,
                        display: { xs: 'none', sm: 'none', md: 'block' },
                    }}
                >
                    DK REQUEST
                </Typography>

                {/* Spacer */}
                <Box flexGrow={1} />

                {/* Search Input */}
                <Search />

                {/* Notification */}
                <Notification notifications={[]}></Notification>

                {/* Avatar */}
                <Box sx={{ paddingLeft: 1, paddingRight: 2 }}>
                    <Avatar />
                </Box>
            </Toolbar>
        </AppBar>
    );
}

export default Header;
