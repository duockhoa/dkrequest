import axios from './customize-axios';

async function getAvatarService(userId) {
    try {
        const response = await axios.get(`/user/avatarbyid/${userId}`, {
            responseType: 'blob', // Quan trọng: set responseType là 'blob'
        });

        // Tạo URL từ blob data
        const imageUrl = URL.createObjectURL(response.data);
        return imageUrl;
    } catch (error) {
        console.error('Error fetching avatar:', error);
        return null;
    }
}

export { getAvatarService };
