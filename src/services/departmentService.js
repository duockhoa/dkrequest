import axios from './customize-axios';
async function getDepartmentsServiceInclude() {
    try {
        const response = await axios.get('/department/getallinclude');
        if (response.status === 200) {
            return extractDepartmentsWithRequestTypes(response.data.result);
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
    return departments
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
}

export { getDepartmentsServiceInclude };
