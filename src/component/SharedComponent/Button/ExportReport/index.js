import { useState } from 'react';
import { Button, Dialog } from '@mui/material';
import AssessmentIcon from '@mui/icons-material/Assessment';
import ExportReportForm from '../../../Form/ExportReportForm';
import { useSelector } from 'react-redux';
import useMediaQuery from '@mui/material/useMediaQuery';
import { de } from 'date-fns/locale';

function ExportReport() {
    const [isOpenExportForm, setIsOpenExportForm] = useState(false);
    const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));
    const user = useSelector((state) => state.user.userInfo);
    const requestTypeId = useSelector((state) => state.requestId.requestTypeId);
    const department = useSelector((state) => state.requestId.department);

    // Chỉ hiển thị nút khi có requestTypeId hợp lệ
    if (department !== user?.department) {
        return null;
    }

    if (typeof requestTypeId !== 'number' || requestTypeId <= 0) {
        return null;
    }

    const handleExportReport = () => {
        setIsOpenExportForm(true);
    };

    const handleCloseDialog = () => {
        setIsOpenExportForm(false);
    };

    return (
        <>
            <Button
                variant="outlined"
                color="primary"
                startIcon={<AssessmentIcon />}
                onClick={handleExportReport}
                sx={{
                    fontSize: 12,
                    textTransform: 'none',
                    whiteSpace: 'nowrap',
                    minWidth: 'auto',
                }}
            >
                {isMobile ? 'Báo cáo' : 'Xuất báo cáo'}
            </Button>

            <Dialog
                open={isOpenExportForm}
                onClose={handleCloseDialog}
                fullWidth
                maxWidth="md"
                PaperProps={{
                    sx: {
                        borderRadius: 2,
                        width: isMobile ? '100%' : '600px',
                        height: isMobile ? '100%' : 'auto',
                    },
                }}
            >
                <ExportReportForm onClose={handleCloseDialog} />
            </Dialog>
        </>
    );
}

export default ExportReport;
