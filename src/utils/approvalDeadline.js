export const APPROVAL_LIMITED_REQUEST_TYPE_IDS = [7, 8];
const FIRST_LEVEL_APPROVAL_DAYS = 1;
const NEXT_LEVEL_APPROVAL_DAYS = 2;

export const isApprovalLimitedRequestType = (requestTypeId) =>
    APPROVAL_LIMITED_REQUEST_TYPE_IDS.includes(Number(requestTypeId));

export const addBusinessDays = (date, days) => {
    const result = new Date(date);
    let remainingDays = Math.max(0, Math.ceil(Number(days) || 0));

    while (remainingDays > 0) {
        result.setDate(result.getDate() + 1);

        const dayOfWeek = result.getDay();
        if (dayOfWeek !== 0 && dayOfWeek !== 6) {
            remainingDays -= 1;
        }
    }

    return result;
};

const getEndOfLocalDay = (date) => {
    const result = new Date(date);
    result.setHours(23, 59, 59, 999);
    return result;
};

const getApprovalStep = (approver) => {
    const step = Number(approver?.step);

    if (!Number.isFinite(step) || step < 1) {
        return 1;
    }

    return Math.ceil(step);
};

const getValidDate = (value) => {
    if (!value) {
        return null;
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return null;
    }

    return date;
};

const getApprovedDateByStep = (request, step) => {
    if (!Array.isArray(request?.approvers)) {
        return null;
    }

    return request.approvers
        .filter((approver) => getApprovalStep(approver) === step && approver.status === 'approved')
        .map((approver) => getValidDate(approver.approved_at || approver.approvedAt))
        .filter(Boolean)
        .reduce((latestDate, approvedDate) => {
            if (!latestDate || approvedDate > latestDate) {
                return approvedDate;
            }

            return latestDate;
        }, null);
};

export const getApprovalDeadline = (request, approver) => {
    const approvalStep = getApprovalStep(approver);
    const baseDate =
        approvalStep === 1 ? getValidDate(request?.createAt) : getApprovedDateByStep(request, approvalStep - 1);

    if (!baseDate) {
        return null;
    }

    const deadlineDate = addBusinessDays(
        baseDate,
        approvalStep === 1 ? FIRST_LEVEL_APPROVAL_DAYS : NEXT_LEVEL_APPROVAL_DAYS,
    );

    return getEndOfLocalDay(deadlineDate);
};

export const isApprovalExpiredForApprover = (request, approver, now = new Date()) => {
    const deadline = getApprovalDeadline(request, approver);
    const currentDate = now instanceof Date ? now : new Date(now);

    if (!deadline || Number.isNaN(currentDate.getTime())) {
        return false;
    }

    return currentDate > deadline;
};
