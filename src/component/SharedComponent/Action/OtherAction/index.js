import { Box, Stack } from '@mui/material';
import ExportFile from '../../Button/ExportFile';
import MarkCompleted from '../../Button/MarkCompleted';
import MarkReceived from '../../Button/MarkReceived';
import MarkCancel from '../../Button/MarkCancel';

function OtherAction({ onClose }) {
    return (
        <Box sx={{ minWidth: 200 }}>
            <Stack direction="column" spacing={0}>
                {/* Mark Received Component */}
                <MarkReceived onClose={onClose} />
                {/* Mark Completed Component */}
                <MarkCompleted onClose={onClose} />
                <MarkCancel onClose={onClose} />

                {/* Export File Component */}
                <ExportFile onClose={onClose} />
            </Stack>
        </Box>
    );
}

export default OtherAction;
