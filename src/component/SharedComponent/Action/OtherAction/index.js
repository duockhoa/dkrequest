import { Box, Stack } from '@mui/material';
import ExportFile from '../../Button/ExportFile';
import MarkCompleted from '../../Button/MarkCompleted';
import { useSelector } from 'react-redux';

function OtherAction({ onClose }) {
    const user = useSelector((state) => state.user.userInfo);
    const requestDetail = useSelector((state) => state.requestDetail.requestDetailvalue);

    return (
        <Box sx={{ minWidth: 200 }}>
            <Stack direction="column" spacing={0}>
                {/* Mark Completed Component */}
                <MarkCompleted onClose={onClose} />

                {/* Export File Component */}
                <ExportFile onClose={onClose} />
            </Stack>
        </Box>
    );
}

export default OtherAction;
