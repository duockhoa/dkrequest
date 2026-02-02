import { MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import { useSelector } from 'react-redux';
import { exportsFileDocService } from '../../../../services/exportsFileService';
import dayjs from 'dayjs';
import { numberToVietnameseWords, formatNumberWithCommas } from '../../../../utils/numberToWords';
import { ta } from 'date-fns/locale';

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
            case 4:
                const supplyStationery = requestDetail?.supplyStationery || [];
                const stationeryData = {};

                for (let idx = 0; idx < 20; idx++) {
                    const item = supplyStationery[idx] || {};
                    stationeryData[`sst${idx + 1}`] = item.product_code || '';
                    stationeryData[`productName${idx + 1}`] = item.product_name || '';
                    stationeryData[`unit${idx + 1}`] = item.unit || '';
                    stationeryData[`ql${idx + 1}`] = item.quantity || '';
                    stationeryData[`reason${idx + 1}`] = item.usage_purpose || '';
                    stationeryData[`note${idx + 1}`] = item.note || '';
                }

                return {
                    template: 'supply_stationery/BMNS003.01.docx',
                    data: {
                        department: department,
                        day: day,
                        month: month,
                        year: year,
                        userName: userName,
                        ...stationeryData,
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
            case 15:
                const expressDeliveryRequest = requestDetail?.expressDeliveryRequest || {};
                return {
                    template: 'express_delivery/BMGH001.docx',
                    data: {
                        name: userName,
                        department: department,
                        recipient_name: expressDeliveryRequest.recipient_name || '',
                        receiving_address: expressDeliveryRequest.receiving_address || '',
                        recipient_phone: expressDeliveryRequest.recipient_phone || '',
                        receiving_unit: expressDeliveryRequest.receiving_unit || '',
                    },
                };
            case 20:
                const advanceClearanceRequest = requestDetail?.advanceClearanceRequest || {};
                const vouchers = advanceClearanceRequest.vouchers || [];
                const spendings = advanceClearanceRequest.spendings || [];

                // Tính tổng số tiền đã ứng
                const totalVoucherAmount = vouchers.reduce((sum, v) => sum + (parseFloat(v.amount) || 0), 0);
                // Tính tổng số tiền đã chi
                const totalSpendingAmount = spendings.reduce((sum, s) => sum + (parseFloat(s.amount) || 0), 0);

                var advance1 = '';
                var advanamont = '';
                const vouchersLength = vouchers.length;
                for (let i = 0; i < vouchersLength; i++) {
                    advance1 =
                        advance1 +
                        (i + 1) +
                        '. ' +
                        `Số phiếu chi ${vouchers[i].voucher_number || '---'} Ngày: ${formatDate(vouchers[i].voucher_date)}` +
                        '\n';
                    advanamont =
                        advanamont + formatNumberWithCommas(parseInt(Number(vouchers[i].amount || '---'))) + 'đ' + '\n';
                }

                console.log('advance1', advance1);
                var pay = '';
                var payamont = '';

                const payLength = spendings.length;
                for (let i = 0; i < payLength; i++) {
                    pay =
                        pay +
                        (i + 1) +
                        '. ' +
                        `Số phiếu chi ${spendings[i].document_number || '---'} Ngày: ${formatDate(spendings[i].spending_date)}` +
                        '\n';
                    payamont =
                        payamont + formatNumberWithCommas(parseInt(Number(spendings[i].amount || '---'))) + 'đ' + '\n';
                }

                const difference = {
                    positive_amount: '',
                    negative_amount: '',
                };

                const differenceValue =
                    parseInt(Number(advanceClearanceRequest.unspent_amount)) + totalVoucherAmount - totalSpendingAmount;

                if (differenceValue > 0) {
                    var positive = differenceValue;
                    difference.positive_amount = formatNumberWithCommas(positive) + 'đ' || '';
                } else if (differenceValue < 0) {
                    var negative = 0 - differenceValue;
                    difference.negative_amount = formatNumberWithCommas(negative) + 'đ' || '';
                }
                return {
                    template: 'advance_clearance/Mau04TT.docx',
                    data: Object.assign({
                        name: userName,
                        department: department,
                        day: day,
                        month: month,
                        year: year,
                        unspent_amount:
                            formatNumberWithCommas(parseInt(Number(advanceClearanceRequest.unspent_amount || 0))) +
                                'đ' || '',
                        total_voucher_amount: formatNumberWithCommas(totalVoucherAmount) + 'đ' || '',
                        total_spending_amount: formatNumberWithCommas(totalSpendingAmount) + 'đ' || '',
                        negative_amount: difference.negative_amount || '',
                        positive_amount: difference.positive_amount || '',
                        department_head: departmentHead,
                        advance: advance1 || '',
                        advanamont: advanamont || '',
                        pay: pay || '',
                        payamont: payamont || '',
                    }),
                };

            case 24:
                const trainingRequest = requestDetail?.trainingRequest || {};
                const participant = trainingRequest.participants || [];
                console.log('participant', participant);
                const particiants = {};
                for (let i = 0; i < 10; i++) {
                    const p = participant[i] || {};
                    console.log('p', p);
                    particiants[`employee_code_${i + 1}`] = p.employee_code || '';
                    particiants[`employee_name_${i + 1}`] = p.employee_name || '';
                    particiants[`employee_position_${i + 1}`] = p.position || '';
                    particiants[`employee_department_${i + 1}`] = p.department || '';
                    particiants[`employee_phone_number_${i + 1}`] = p.phone_number || '';
                    particiants[`employee_email_${i + 1}`] = p.email || '';
                }
                console.log('particiants', particiants);

                return {
                    template: 'training_request/BMNS016.04.docx',
                    data: {
                        name: userName,
                        department: department,
                        day: day,
                        month: month,
                        course_name: trainingRequest.course_name || '',
                        training_provider: trainingRequest.training_provider || '',
                        start_time: trainingRequest.start_time
                            ? dayjs(trainingRequest.start_time).format('DD/MM/YYYY')
                            : '',
                        end_time: trainingRequest.end_time ? dayjs(trainingRequest.end_time).format('DD/MM/YYYY') : '',
                        session_count: trainingRequest.session_count || '',
                        budget: trainingRequest.budget
                            ? formatNumberWithCommas(parseInt(Number(trainingRequest.budget)))
                            : '',
                        training_mode: trainingRequest.training_mode || '',
                        training_location_type: trainingRequest.training_location_type || '',
                        trainer_type: trainingRequest.trainer_type || '',
                        necessity: trainingRequest.necessity || '',
                        training_goal: trainingRequest.training_goal || '',
                        year: year,
                        department_head: departmentHead,
                        ...particiants,
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

// Hàm formatDate: chuyển yyyy-mm-dd thành dd/mm/yyyy
function formatDate(dateStr) {
    if (!dateStr) return '';
    return dayjs(dateStr).format('DD/MM/YYYY');
}

export default ExportFile;
