export const HIDDEN_REQUEST_TYPE_IDS = [33];
export const HIDDEN_REQUEST_TYPE_PATHS = ['/resignation-request'];
export const HIDDEN_REQUEST_TYPE_NAMES = ['Đơn xin thôi việc'];

const normalize = (value) => String(value || '').trim().toLowerCase();

const hiddenRequestTypePaths = HIDDEN_REQUEST_TYPE_PATHS.map(normalize);
const hiddenRequestTypeNames = HIDDEN_REQUEST_TYPE_NAMES.map(normalize);

const getRequestTypeId = (requestType) =>
    requestType?.id ?? requestType?.requestType_id ?? requestType?.requestTypeId ?? requestType?.requestType?.id;

const getRequestTypePath = (requestType) =>
    requestType?.path ?? requestType?.requestTypePath ?? requestType?.requestType?.path;

const getRequestTypeName = (requestType) =>
    requestType?.name ?? requestType?.requestTypeName ?? requestType?.requestType?.name;

export const isHiddenRequestType = (requestType = {}) => {
    const requestTypeId = Number(getRequestTypeId(requestType));
    const requestTypePath = normalize(getRequestTypePath(requestType));
    const requestTypeName = normalize(getRequestTypeName(requestType));

    return (
        HIDDEN_REQUEST_TYPE_IDS.includes(requestTypeId) ||
        hiddenRequestTypePaths.includes(requestTypePath) ||
        hiddenRequestTypeNames.includes(requestTypeName)
    );
};

export const isHiddenRequest = (request = {}) => {
    const requestName = normalize(request?.requestName);

    return (
        isHiddenRequestType(request) ||
        hiddenRequestTypeNames.some((hiddenRequestTypeName) => requestName.includes(hiddenRequestTypeName))
    );
};

export const filterHiddenRequestTypes = (requestTypes = []) => requestTypes.filter((type) => !isHiddenRequestType(type));

export const filterHiddenRequests = (requests = []) => requests.filter((request) => !isHiddenRequest(request));
