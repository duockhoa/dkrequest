import { Typography , TextField} from "@mui/material";
import Box from "@mui/system/Box";
import { useSelector } from "react-redux";
function Filter() {
    const user = useSelector((state) => state.user.userInfo);
 return <Box sx={{ margin: 'auto' }}>
    <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1, fontSize: '1.6rem', pt:10, textAlign: 'center' }}>
        Tính năng lọc dữ liệu
    </Typography>
    <Typography sx={{ fontSize: '1.6rem', color: 'text.secondary', mb: 2 }}>
        Xin chào {user.name}.
    </Typography >
    <Typography sx={{ fontSize: '1.4rem', color: 'text.secondary', mb: 2 }}>
        Tôi làm nút này chỉ đơn giản để thử xem bạn có kích vào nó không thôi.
    </Typography>
    <Typography sx={{ fontSize: '1.4rem', color: 'text.secondary', mb: 2 }}>
        Việc bạn kích vào cho tôi biết rằng bạn đang quan tâm đến tính năng lọc dữ liệu.
    </Typography>
    <Typography sx={{ fontSize: '1.4rem', color: 'text.secondary', mb: 2 }}>
        Bạn vừa vô tình đóng góp ý kiến để tôi phát triển tính năng này.
    </Typography>
        <Typography sx={{ fontSize: '1.4rem', color: 'text.secondary', mb: 2 }}>
        Cảm ơn bạn rất nhiều!
    </Typography>
 </Box>;   
}

export default Filter;