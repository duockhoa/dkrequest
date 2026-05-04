import axios from './customize-axios';
import organizationRequestTypes from '../utils/organizationRequestTypes';

async function getDepartmentsServiceInclude() {
    try {
        const response = await axios.get('/department/getallinclude');
        if (response.status === 200) {
            return extractDepartmentsWithRequestTypes(response.data.result || []);
        } else {
            throw new Error('Không thể lấy danh sách phòng ban');
        }
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.message || 'Lỗi từ server');
        } else if (error.request) {
            throw new Error('Không thể kết nối đến server');
        } else {
            throw new Error(error.message || 'Đã xảy ra lỗi khi lấy danh sách phòng ban');
        }
    }
}

function extractDepartmentsWithRequestTypes(departments) {
    const mappedDepartments = departments
        .filter((dept) => Array.isArray(dept.requestTypes) && dept.requestTypes.length > 0)
        .map((dept) => ({
            departmentName: dept.name,
            requestTypes: dept.requestTypes.map((rt) => {
                return {
                    id: rt.id,
                    requestTypeName: rt.name,
                    requestTypePath: rt.path,
                };
            }),
        }));

    const organizationDepartment = mappedDepartments.find((dept) => dept.departmentName === 'Tổ chức');
    const organizationTypes = organizationRequestTypes.map((requestType) => ({
        id: requestType.id,
        requestTypeName: requestType.name,
        requestTypePath: requestType.path,
    }));

    if (!organizationDepartment) {
        return [
            ...mappedDepartments,
            {
                departmentName: 'Tổ chức',
                requestTypes: organizationTypes,
            },
        ];
    }

    const existingIds = new Set(organizationDepartment.requestTypes.map((requestType) => requestType.id));
    const existingPaths = new Set(
        organizationDepartment.requestTypes.map((requestType) => requestType.requestTypePath),
    );
    organizationDepartment.requestTypes = [
        ...organizationDepartment.requestTypes,
        ...organizationTypes.filter(
            (requestType) => !existingIds.has(requestType.id) && !existingPaths.has(requestType.requestTypePath),
        ),
    ];

    return mappedDepartments;
}

export { getDepartmentsServiceInclude };
