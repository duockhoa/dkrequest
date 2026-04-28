import axios from './customize-axios';
import organizationRequestTypes from '../utils/organizationRequestTypes';

function mergeOrganizationRequestTypes(requestTypes) {
    const existingIds = new Set(requestTypes.map((type) => type.id));
    const existingPaths = new Set(requestTypes.map((type) => type.path));
    const missingTypes = organizationRequestTypes
        .filter((type) => !existingIds.has(type.id) && !existingPaths.has(type.path))
        .map((type) => ({
            id: type.id,
            name: type.name,
            path: type.path,
            despartmentName: type.departmentName,
        }));

    return [...requestTypes, ...missingTypes];
}

async function getAllRequestTypeService() {
    try {
        const response = await axios.get('/requesttype/getall');
        if (response.status === 200) {
            return mergeOrganizationRequestTypes(response.data.result || []);
        } else {
            throw new Error('Không thể lấy danh sách yêu cầu');
        }
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.message || 'Lỗi từ server');
        } else if (error.request) {
            throw new Error('Không thể kết nối đến server');
        } else {
            throw new Error(error.message || 'Đã xảy ra lỗi khi lấy danh sách yêu cầu');
        }
    }
}

export { getAllRequestTypeService };
