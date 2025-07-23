import axios from './customize-axios';

async function getItems() {
    try {
        const response = await axios.get('/items/getall');
        if (response.status === 200) {
            return response.data.result;
        } else {
            throw new Error('Không thể lấy danh sách mặt hàng');
        }
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.message || 'Lỗi từ server');
        } else if (error.request) {
            throw new Error('Không thể kết nối đến server');
        } else {
            throw new Error(error.message || 'Đã xảy ra lỗi khi lấy danh sách mặt hàng');
        }
    }
}

async function createNewItem(item) {
    try {
        const response = await axios.post('/items/create', item);
        if (response.status === 201) {
            return response.data.result;
        } else {
            throw new Error('Không thể thêm mặt hàng mới');
        }
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.message || 'Lỗi từ server');
        } else if (error.request) {
            throw new Error('Không thể kết nối đến server');
        } else {
            throw new Error(error.message || 'Đã xảy ra lỗi khi thêm mặt hàng mới');
        }
    }
}

async function updateItem(item) {
    try {
        const response = await axios.put(`/items/update/${item.product_code}`, item);
        if (response.status === 200) {
            return response.data.result;
        } else {
            throw new Error('Không thể cập nhật mặt hàng');
        }
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.message || 'Lỗi từ server');
        } else if (error.request) {
            throw new Error('Không thể kết nối đến server');
        } else {
            throw new Error(error.message || 'Đã xảy ra lỗi khi cập nhật mặt hàng');
        }
    }
}

async function deleteItem(itemId) {
    try {
        const response = await axios.delete(`/items/delete/${itemId}`);
        if (response.status === 200) {
            return response.data;
        } else {
            throw new Error('Không thể xóa mặt hàng');
        }
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.message || 'Lỗi từ server');
        } else if (error.request) {
            throw new Error('Không thể kết nối đến server');
        } else {
            throw new Error(error.message || 'Đã xảy ra lỗi khi xóa mặt hàng');
        }
    }
}

export { getItems, createNewItem, updateItem, deleteItem };
