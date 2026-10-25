import { lazy, Suspense, useState } from 'react';
import LoadingPage from '../../LoadingPage';
import { Button, Dialog } from '@mui/material';
import AssessmentIcon from '@mui/icons-material/Assessment';
import { useSelector } from 'react-redux';
import useMediaQuery from '@mui/material/useMediaQuery';
import { canExportFuelPaymentReport } from '../../../../utils/fuelPayment';
import { hasDevFullAccess } from '../../../../utils/permissions';

const ExportReportForm = lazy(() => import('../../../Form/ExportReportForm'));

function ExportReport() {
    const [isOpenExportForm, setIsOpenExportForm] = useState(false);
    const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));
    const user = useSelector((state) => state.user.userInfo);
    const requestTypeId = useSelector((state) => state.requestId.requestTypeId);
    const department = useSelector((state) => state.requestId.department);

    const allowGeneralReport = hasDevFullAccess(user) || (!!department && department === user?.department);
    const allowFuelReport = requestTypeId === 1 && canExportFuelPaymentReport(user);

    if (!allowGeneralReport && !allowFuelReport) {
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
                {isOpenExportForm && <Suspense fallback={<LoadingPage />}><ExportReportForm onClose={handleCloseDialog} allowGeneralReport={allowGeneralReport} /></Suspense>}
            </Dialog>
        </>
    );
}

export default ExportReport;
