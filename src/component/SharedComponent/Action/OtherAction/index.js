import { Box, Stack } from '@mui/material';
import ExportFile from '../../Button/ExportFile';
import MarkCompleted from '../../Button/MarkCompleted';

function OtherAction({ onClose }) {
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
