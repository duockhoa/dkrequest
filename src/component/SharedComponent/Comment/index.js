import { Box, Stack, Avatar, Typography } from '@mui/material';
import { format } from 'date-fns';
import CommentForm from '../../Form/CommentForm';

// Mock data for comments
const mockComments = [
    {
        id: 1,
        user: {
            name: 'Phạm Văn Bình',
            avatar: 'https://example.com/avatar1.jpg',
        },
        content: 'Đã xem xét và phê duyệt',
        createAt: '2025-06-09T08:00:00Z',
    },
    {
        id: 2,
        user: {
            name: 'Nguyễn Văn A',
            avatar: 'https://example.com/avatar2.jpg',
        },
        content: 'Cần bổ sung thêm thông tin chi tiết về thời gian nghỉ',
        createAt: '2025-06-09T09:30:00Z',
    },
];

const CommentItem = ({ comment }) => (
    <Stack direction="row" spacing={2} sx={{ py: 2 }}>
        <Avatar src={comment.user.avatar} alt={comment.user.name} sx={{ width: 40, height: 40 }} />
        <Box sx={{ flex: 1 }}>
            <Stack direction="row" spacing={1} alignItems="center">
                <Typography sx={{ fontSize: '1.4rem', fontWeight: 600 }}>{comment.user.name}</Typography>
                <Typography sx={{ fontSize: '1.2rem', color: 'text.secondary' }}>
                    {format(new Date(comment.createAt), 'dd/MM/yyyy HH:mm')}
                </Typography>
            </Stack>
            <Typography sx={{ fontSize: '1.4rem', mt: 1 }}>{comment.content}</Typography>
        </Box>
    </Stack>
);

function Comment() {
    const handleSubmitComment = () => {
        // Handle new comment submission
    };

    return (
        <Box sx={{ bgcolor: 'background.paper', p: 3, borderRadius: 1 }}>
            {/* Changed styling here */}
            <Typography
                variant="h6"
                sx={{
                    fontSize: '1.6rem',
                    fontWeight: 600,
                    mb: 2,
                    color: 'text.primary',
                }}
            >
                BÌNH LUẬN
            </Typography>
            <CommentForm onSubmit={handleSubmitComment} />
            <Stack spacing={2}>
                {mockComments.map((comment) => (
                    <CommentItem key={comment.id} comment={comment} />
                ))}
            </Stack>
        </Box>
    );
}

export default Comment;
