import { useState } from 'react';
import { Box, Button, Stack, Dialog, DialogContent } from '@mui/material';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import DownloadIcon from '@mui/icons-material/Download';
import ConfirmForm from '../../Form/ConfirmForm';
import { approverUpdateStatus } from '../../../services/approverService';
import { useSelector, useDispatch } from 'react-redux';
import { fetchRequestDetail } from '../../../redux/slice/requestDetailSlice';
import { fetchRequests } from '../../../redux/slice/requestSlice';
import { exportsFileDocService } from '../../../services/exportsFileService';
import dayjs from 'dayjs';
import { numberToVietnameseWords, formatNumberWithCommas } from '../../../utils/numberToWords';
import { markCompleted } from '../../../services/requestService';

function OtherAction() {
    const dispatch = useDispatch();
    const [open, setOpen] = useState(false);
    const user = useSelector((state) => state.user.userInfo);
    const requestId = useSelector((state) => state.requestId.requestId);
    const requestDetail = useSelector((state) => state.requestDetail.requestDetailvalue);

    const handleComplete = () => {
        setOpen(true);
    };

    const createdAt = requestDetail?.createAt;
    const day = createdAt ? dayjs(createdAt).date() : '';
    const month = createdAt ? dayjs(createdAt).month() + 1 : ''; // month() trả về 0-11
    const year = createdAt ? dayjs(createdAt).year() : '';
    const userName = requestDetail?.requestor?.name || '';
    const department = requestDetail?.requestor?.department || '';
    const departmentHead =
        Array.isArray(requestDetail?.approvers) && requestDetail.approvers.length > 0
            ? requestDetail.approvers[0]?.approver?.name || ''
            : '';

    // Check if request is completed
    const isCompleted = requestDetail?.isCompleted;

    switch (requestDetail.requestType_id) {
        case 1:
            const payment = requestDetail?.paymentRegistration || {};
            var template = 'payment_request/Mau05TT.docx';
            var data = {
                department: department,
                day: day,
                month: month,
                year: year,
                userName: userName,
                payment_content: payment.payment_content || '',
                pay_to: payment.pay_to || '',
                amount: formatNumberWithCommas(parseInt(Number(payment.amount))) || '',
                amount_text: payment.amount ? numberToVietnameseWords(parseInt(Number(payment.amount))) : '',
                due_date: payment.due_date ? dayjs(payment.due_date).format('DD/MM/YYYY') : '',
                attachments:
                    requestDetail.attachments && requestDetail.attachments.length > 0
                        ? requestDetail.attachments.map((a) => a.file_group).join(', ')
                        : '',
                bank_name: payment.bank_name || '',
                bank_account_number: payment.bank_account_number || '',
                beneficiary_name: payment.beneficiary_name || '',
                department_head: departmentHead,
                description: requestDetail.description || '',
                request_name: requestDetail.requestName || '',
            };
            break;
        case 2:
            var template = 'advance_money/Mau03TT.docx';
            const advance = requestDetail?.advance_request || {};
            var data = {
                department: department,
                day: day,
                month: month,
                year: year,
                userName: userName,
                address: advance.address || '',
                reason: advance.reason || '',
                amount: formatNumberWithCommas(parseInt(Number(advance.amount))) || '',
                amount_text: advance.amount ? numberToVietnameseWords(parseInt(Number(advance.amount))) : '',
                due_date: advance.due_date ? dayjs(advance.due_date).format('DD/MM/YYYY') : '',
                bank_name: advance.bank_name || '',
                bank_account_number: advance.bank_account_number || '',
                beneficiary_name: advance.beneficiary_name || '',
                department_head: departmentHead,
            };
            break;

        default:
            var template = 'default_template';
            var data = requestDetail.data || {};
            break;
    }

    const handleExportFile = async () => {
        await exportsFileDocService(template, data);
    };

    const handleClose = () => setOpen(false);

    const handleSubmitConfirm = async () => {
        try {
            const payload = {
                requestId: requestId,
                completedBy: user.id,
            };
            const response = await markCompleted(payload);
            dispatch(fetchRequestDetail(requestId));
            dispatch(fetchRequests(requestDetail.requestType_id));
            handleClose();
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const question = 'Bạn có chắc chắn muốn xác nhận hoàn thành yêu cầu này?';

    return (
        <Box sx={{ bgcolor: 'background.paper', p: 2, borderRadius: 1 }}>
            <Stack direction="row" spacing={2} justifyContent="center" flexWrap="wrap" rowGap={2}>
                {/* Only show complete button if request is not completed */}
                {!isCompleted && user.department === requestDetail?.requestType?.department.name && (
                    <Button
                        variant="contained"
                        color="success"
                        startIcon={<DoneAllIcon />}
                        onClick={handleComplete}
                        sx={{
                            fontSize: '1.4rem',
                            textTransform: 'none',
                            minWidth: 150,
                        }}
                    >
                        Đánh dấu hoàn thành
                    </Button>
                )}

                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<DownloadIcon />}
                    onClick={handleExportFile}
                    sx={{
                        fontSize: '1.4rem',
                        textTransform: 'none',
                        minWidth: 120,
                    }}
                >
                    Xuất File
                </Button>
            </Stack>

            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogContent>
                    <ConfirmForm question={question} onCancel={handleClose} onSubmit={handleSubmitConfirm} />
                </DialogContent>
            </Dialog>
        </Box>
    );
}

export default OtherAction;
