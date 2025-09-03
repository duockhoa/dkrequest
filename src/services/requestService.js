import axios from './customize-axios';
async function getAllRequestService(requestTypeId, user_id, page) {
    try {
        const response = await axios.get('/request/getall?requesttypeid=' + requestTypeId + '&userid=' + user_id + '&page=' + page + '&pageSize=350');
        if (response.status === 200) {
            return response.data.result;
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

async function getRequestByIdService(id) {
    try {
        const response = await axios.get(`/request/getbyid/${id}`);
        if (response.status === 200) {
            return response.data.result;
        } else {
            throw new Error('Không thể lấy yêu cầu theo ID');
        }
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.message || 'Lỗi từ server');
        } else if (error.request) {
            throw new Error('Không thể kết nối đến server');
        } else {
            throw new Error(error.message || 'Đã xảy ra lỗi khi lấy yêu cầu theo ID');
        }
    }
}

async function createRequestService(payload) {
    try {
        const response = await axios.post('/request/create', payload, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        if (response.status === 201) {
            return response.data.result;
        } else {
            throw new Error('Không thể tạo yêu cầu');
        }
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.message || 'Lỗi từ server');
        } else if (error.request) {
            throw new Error('Không thể kết nối đến server');
        } else {
            throw new Error(error.message || 'Đã xảy ra lỗi khi tạo yêu cầu');
        }
    }
}

async function markCompleted(payload) {
    try {
        const response = await axios.put(`/request/markcompleted/`, payload);
        if (response.status === 200) {
            return response.data.result;
        } else {
            throw new Error('Không thể đánh dấu yêu cầu là đã hoàn thành');
        }
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.message || 'Lỗi từ server');
        } else if (error.request) {
            throw new Error('Không thể kết nối đến server');
        } else {
            throw new Error(error.message || 'Đã xảy ra lỗi khi đánh dấu yêu cầu là đã hoàn thành');
        }
    }
}

async function markReceived(payload) {
    try {
        const response = await axios.put(`/request/markreceived/`, payload);
        if (response.status === 200) {
            return response.data.result;
        } else {
            throw new Error('Không thể đánh dấu yêu cầu là đã nhận');
        }
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.message || 'Lỗi từ server');
        } else if (error.request) {
            throw new Error('Không thể kết nối đến server');
        } else {
            throw new Error(error.message || 'Đã xảy ra lỗi khi đánh dấu yêu cầu là đã nhận');
        }
    }
}

async function markCanceled(payload) {
    try {
        const response = await axios.put(`/updatestatus/cancel/`, payload);
        if (response.status === 200) {
            return response.data.result;
        } else {
            throw new Error('Không thể đánh dấu yêu cầu là đã hủy');
        }
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.message || 'Lỗi từ server');
        } else if (error.request) {
            throw new Error('Không thể kết nối đến server');
        } else {
            throw new Error(error.message || 'Đã xảy ra lỗi khi đánh dấu yêu cầu là đã hủy');
        }
    }
}

export { getAllRequestService, getRequestByIdService, createRequestService, markCompleted, markReceived, markCanceled };
