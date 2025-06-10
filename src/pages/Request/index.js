import Requests from '../../component/SharedComponent/Requests';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import { useSearchParams } from 'react-router-dom';
import RequestDetail from '../../component/SharedComponent/RequestDetail';
import Comment from '../../component/SharedComponent/Comment';
import Approver from '../../component/SharedComponent/Approver';
import Follower from '../../component/SharedComponent/Follower';
import Progress from '../../component/SharedComponent/Progress';
export default function Request() {
    const [searchParams] = useSearchParams();
    const view = searchParams.get('view');
    return (
        <Stack height={'100%'} flexDirection={'row'} sx={{ width: '100%' }}>
            <Box
                sx={{
                    height: '100%',
                    mr: 1,
                    bgcolor: '#ffffff',
                }}
                flexGrow={1}
            >
                <Requests />
            </Box>
            {view === 'detail' && (
                <>
                    <Box
                        height={'100%'}
                        flexGrow={1}
                        padding={2}
                        pr={0}
                        sx={{ overflowY: 'auto', backgroundColor: '#ffff', mr: 1 }}
                    >
                        <Paper
                            elevation={2}
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 3,
                                fontSize: '2.2rem',
                                overflow: 'auto',
                                p: 3,
                            }}
                        >
                            <RequestDetail />
                            <Comment />
                        </Paper>
                    </Box>

                    <Box
                        height={'100%'}
                        flexGrow={1}
                        padding={2}
                        pr={0}
                        sx={{ overflowY: 'auto', backgroundColor: '#ffff' }}
                    >
                        <Paper
                            elevation={2}
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 3,
                                fontSize: '2.2rem',
                                overflow: 'auto',
                                p: 3, // Add padding to create space from edges
                            }}
                        >
                            <Approver />
                            <Follower />
                            <Progress />
                        </Paper>
                    </Box>
                </>
            )}
        </Stack>
    );
}
