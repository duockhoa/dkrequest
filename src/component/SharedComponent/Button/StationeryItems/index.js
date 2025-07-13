import { Button } from '@mui/material';
import InventoryIcon from '@mui/icons-material/Inventory';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import useMediaQuery from '@mui/material/useMediaQuery';

function StationeryItems() {
    const navigate = useNavigate();
    const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));
    const requestTypeId = useSelector((state) => state.requestId.requestTypeId);
    const user = useSelector((state) => state.user.userInfo);

    // Chỉ hiển thị nút khi:
    // 1. requestTypeId === 4 (Đề nghị cung ứng VPP)
    // 2. User thuộc department "Tổ chức"
    if (requestTypeId !== 4 || user?.department !== 'Tổ chức') {
        return null;
    }

    const handleGotoItems = () => {
        navigate('/items');
    };

    return (
        <Button
            variant="outlined"
            color="primary"
            startIcon={<InventoryIcon />}
            onClick={handleGotoItems}
            sx={{
                fontSize: 12,
                textTransform: 'none',
                whiteSpace: 'nowrap',
                minWidth: 'auto',
            }}
        >
            {isMobile ? 'Danh mục' : 'Danh mục hàng hoá'}
        </Button>
    );
}

export default StationeryItems;
