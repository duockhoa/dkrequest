import { MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import { useSelector } from 'react-redux';
import { exportsFileDocService } from '../../../../services/exportsFileService';
import dayjs from 'dayjs';
import { numberToVietnameseWords, formatNumberWithCommas } from '../../../../utils/numberToWords';

function ExportFile({ onClose }) {
    const requestDetail = useSelector((state) => state.requestDetail.requestDetailvalue);

    const createdAt = requestDetail?.createAt;
    const day = createdAt ? dayjs(createdAt).date() : '';
    const month = createdAt ? dayjs(createdAt).month() + 1 : ''; // month() trả về 0-11
    const year = createdAt ? dayjs(createdAt).year() : '';
    const userName = requestDetail?.requestor?.name || '';
    const department = requestDetail?.requestor?.department || '';
    const requesterPosition = requestDetail?.requestor?.position || '';
    const departmentHead =
        Array.isArray(requestDetail?.approvers) && requestDetail.approvers.length > 0
            ? requestDetail.approvers[0]?.approver?.name || ''
            : '';

    // Prepare template and data based on request type
    const getTemplateAndData = () => {
        switch (requestDetail.requestType_id) {
            case 1:
                const payment = requestDetail?.paymentRegistration || {};
                return {
                    template: 'payment_request/Mau05TT.docx',
                    data: {
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
                    },
                };
            case 2:
                const advance = requestDetail?.advance_request || {};
                return {
                    template: 'advance_money/Mau03TT.docx',
                    data: {
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
                    },
                };
            case 9:
                const recruitment = requestDetail?.recruitmentRequest || {};
                return {
                    template: 'recruitment/BMTD01TC.docx',
                    data: {
                        department: department,
                        day: day,
                        month: month,
                        year: year,
                        userName: userName,
                        requesterPosition: requesterPosition,
                        position: recruitment.position || '',
                        quantity: recruitment.quantity || '',
                        probation_start_date: recruitment.probation_start_date
                            ? dayjs(recruitment.probation_start_date).format('DD/MM/YYYY')
                            : '',
                        probation_salary: formatNumberWithCommas(parseInt(Number(recruitment.probation_salary))) || '',
                        probation_salary_text: recruitment.probation_salary
                            ? numberToVietnameseWords(parseInt(Number(recruitment.probation_salary)))
                            : '',
                        official_salary: formatNumberWithCommas(parseInt(Number(recruitment.official_salary))) || '',
                        official_salary_text: recruitment.official_salary
                            ? numberToVietnameseWords(parseInt(Number(recruitment.official_salary)))
                            : '',
                        recruitment_reason: recruitment.recruitment_reason || '',
                        education_level: recruitment.education_level || '',
                        major: recruitment.major || '',
                        foreign_language: recruitment.foreign_language || '',
                        computer_skill: recruitment.computer_skill || '',
                        experience: recruitment.experience || '',
                        contract_type: recruitment.contract_type || '',
                        gender: recruitment.gender || '',
                        age_range: recruitment.age_range || '',
                        work_location: recruitment.work_location || '',
                        working_hours: recruitment.working_hours || '',
                        job_description: recruitment.job_description || '',
                        other_requirements: recruitment.other_requirements || '',
                        department_head: departmentHead,
                        description: requestDetail.description || '',
                        request_name: requestDetail.requestName || '',
                    },
                };
            default:
                return {
                    template: 'default_template',
                    data: requestDetail.data || {},
                };
        }
    };

    const handleExportFile = async () => {
        try {
            const { template, data } = getTemplateAndData();
            await exportsFileDocService(template, data);
            if (onClose) onClose(); // Close popover after action
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
