export const APPROVAL_LIMITED_REQUEST_TYPE_IDS = [7, 8];

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

const getApprovalStep = (approver) => {
    const step = Number(approver?.step);

    if (!Number.isFinite(step) || step < 1) {
        return 1;
    }

    return Math.ceil(step);
};

export const getApprovalDeadline = (request, approver) => {
    const createdAt = request?.createAt;

    if (!createdAt) {
        return null;
    }

    const createdDate = new Date(createdAt);

    if (Number.isNaN(createdDate.getTime())) {
        return null;
    }

    return addBusinessDays(createdDate, getApprovalStep(approver));
};

export const isApprovalExpiredForApprover = (request, approver, now = new Date()) => {
    const deadline = getApprovalDeadline(request, approver);
    const currentDate = now instanceof Date ? now : new Date(now);

    if (!deadline || Number.isNaN(currentDate.getTime())) {
        return false;
    }

    return currentDate > deadline;
};
