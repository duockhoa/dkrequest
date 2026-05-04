import { MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import { useSelector } from 'react-redux';
import { exportsFileDocService } from '../../../../services/exportsFileService';

function ExportFile({ onClose }) {
    const requestDetail = useSelector((state) => state.requestDetail.requestDetailvalue);

    const handleExportFile = async () => {
        try {
            await exportsFileDocService(requestDetail.id);
            if (onClose) onClose();
        } catch (error) {
            console.error('Error exporting file:', error);
        }
    };

    return (
        <MenuItem
            onClick={handleExportFile}
            sx={{
                py: 1.5,
                px: 2,
                '&:hover': {
                    backgroundColor: 'primary.light',
                    color: 'primary.contrastText',
                },
            }}
        >
            <ListItemIcon sx={{ color: 'inherit' }}>
                <DownloadIcon />
            </ListItemIcon>
            <ListItemText
                primary="Xuất File"
                primaryTypographyProps={{
                    fontSize: '14px',
                    fontWeight: 500,
                }}
            />
        </MenuItem>
    );
}

export default ExportFile;
