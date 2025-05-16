import AppBar from '@mui/material/AppBar';
import { Box, Toolbar, Typography } from '@mui/material';
import Avatar from '../Avatar';
import Notification from '../Notification';
import { logo } from '../../assets/images';
import Link from '@mui/material/Link';
import Search from '../Search';

function Header() {
    return (
        <AppBar
            position="static"
            sx={{
                backgroundColor: 'rgb(255,255,255)',
                height: '56px',
            }}
        >
            <Toolbar variant="dense">
                <Link height="100%" href="/" paddingLeft={2} display="flex">
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
                    DK WorkFlow
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
