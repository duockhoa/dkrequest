import { Box, Stack, Typography, Paper } from '@mui/material';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import CommentForm from '../../Form/CommentForm';
import PreviewFile from '../PreviewFile';
import { useSelector, useDispatch } from 'react-redux';
import { fetchComments } from '../../../redux/slice/commentSlice';
import { useEffect, useState } from 'react';
import LoadingPage from '../../SharedComponent/LoadingPage';

function CommentItem({ comment, onFileClick }) {
    return (
        <Box sx={{ mb: 3 }}>
            <Stack direction="row" alignItems="center" spacing={2}>
                <img
                    src={comment.commenter.avatar}
                    alt={comment.commenter.name}
                    style={{ width: 40, height: 40, borderRadius: '50%' }}
                />
                <Box>
                    <Typography sx={{ fontWeight: 600, fontSize: '1.25rem' }}>{comment.commenter.name}</Typography>
                    <Typography sx={{ color: 'text.secondary', fontSize: '1.1rem' }}>
                        {new Date(comment.createdAt).toLocaleString('vi-VN', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                        })}
                    </Typography>
                </Box>
            </Stack>
            <Typography sx={{ fontSize: '1.4rem', ml: 7, mb: 1 }}>{comment.comment_text}</Typography>
            {comment.files && comment.files.length > 0 && (
                <Stack spacing={1} sx={{ ml: 7 }}>
                    {comment.files.map((file) => (
                        <Paper
                            key={file.id}
                            elevation={0}
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                p: 1,
                                borderRadius: 2,
                                bgcolor: 'grey.50',
                                maxWidth: 400,
                            }}
                        >
                            <TextSnippetIcon sx={{ color: 'primary.main', fontSize: 28, mr: 1.5 }} />
                            <Typography
                                variant="body2"
                                sx={{
                                    flex: 1,
                                    fontWeight: 500,
                                    color: 'primary.main',
                                    fontSize: '1.1rem',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    cursor: 'pointer',
                                    textDecoration: 'underline',
                                }}
                                title={file.file_name}
                                onClick={() => onFileClick(file)}
                            >
                                {file.file_name}
                            </Typography>
                        </Paper>
                    ))}
                </Stack>
            )}
        </Box>
    );
}

function Comment() {
    const dispatch = useDispatch();
    const requestId = useSelector((state) => state.requestId.requestId);
    const comments = useSelector((state) => state.comment.comments);
    const loading = useSelector((state) => state.comment.loading);
    const error = useSelector((state) => state.comment.error);
    
    // State cho preview file
    const [previewFile, setPreviewFile] = useState(null);
    const [openPreview, setOpenPreview] = useState(false);

    useEffect(() => {
        console.log('Fetching comments for requestId:', requestId);
        if (requestId) {
            dispatch(fetchComments(requestId));
        }
    }, [requestId]);

    // Xử lý click vào file
    const handleFileClick = (file) => {
        setPreviewFile(file);
        setOpenPreview(true);
    };

    // Đóng preview
    const handleClosePreview = () => {
        setOpenPreview(false);
        setPreviewFile(null);
    };

    if (loading) {
        return <LoadingPage />;
    }

    return (
        <Box sx={{ bgcolor: 'background.paper', p: 3, borderRadius: 1 }}>
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
            <CommentForm />
            <Stack spacing={2}>
                {error && <Typography color="error">{error}</Typography>}
                {comments &&
                    [...comments].reverse().map((comment) => (
                        <CommentItem key={comment.id} comment={comment} onFileClick={handleFileClick} />
                    ))}
            </Stack>

            {/* Preview File Dialog */}
            <PreviewFile
                open={openPreview}
                file={previewFile}
                onClose={handleClosePreview}
            />
        </Box>
    );
}

export default Comment;
