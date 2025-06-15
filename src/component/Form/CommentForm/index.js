import { Box, TextField, IconButton, Typography, Stack, Paper } from '@mui/material';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import { useSelector, useDispatch } from 'react-redux';
import { useState, useRef } from 'react';
import { createComment } from '../../../redux/slice/commentSlice';

function CommentForm() {
    const dispatch = useDispatch();
    const requestId = useSelector((state) => state.requestId.requestId);
    const user = useSelector((state) => state.user.userInfo);
    const [value, setValue] = useState('');
    const [attachments, setAttachments] = useState([]);
    const fileInputRef = useRef(null);

    const handleFileSelect = (event) => {
        const files = Array.from(event.target.files);
        setAttachments((prev) => [...prev, ...files]);
    };

    const handleRemoveFile = (index) => {
        setAttachments((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async () => {
        if (!value.trim() && attachments.length === 0) return;

        const formData = new FormData();
        formData.append('request_id', requestId);
        formData.append('comment_text', value);
        formData.append('user_id', user.id);

        attachments.forEach((file) => {
            formData.append('files', file);
        });

        await dispatch(createComment(formData));
        setValue('');
        setAttachments([]);
    };

    return (
        <Box sx={{ mb: 2 }}>
            {/* File Preview Area */}
            {attachments.length > 0 && (
                <Stack spacing={2} sx={{ mt: 2 }}>
                    {attachments.map((file, idx) => (
                        <Paper
                            key={idx}
                            elevation={0}
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                p: 1.5,
                                borderRadius: 2,
                                bgcolor: 'grey.50',
                            }}
                        >
                            <TextSnippetIcon sx={{ color: 'primary.main', fontSize: 36, mr: 2 }} />
                            <Typography
                                variant="subtitle1"
                                sx={{
                                    flex: 1,
                                    fontWeight: 500,
                                    fontSize: '1.1rem',
                                    color: 'text.primary',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                }}
                                title={file.name}
                            >
                                {file.name}
                            </Typography>
                            <IconButton size="small" color="error" onClick={() => handleRemoveFile(idx)} sx={{ ml: 2 }}>
                                <CloseIcon fontSize="small" />
                            </IconButton>
                        </Paper>
                    ))}
                </Stack>
            )}

            {/* Comment Input Area */}
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    p: 1,
                    border: '1px solid #e0e0e0',
                    borderRadius: '50px',
                }}
            >
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    multiple
                    style={{ display: 'none' }}
                />

                <IconButton
                    size="small"
                    onClick={() => fileInputRef.current?.click()}
                    sx={{
                        mx: 1,
                        transform: 'rotate(45deg)',
                    }}
                >
                    <AttachFileIcon />
                </IconButton>

                <TextField
                    fullWidth
                    multiline
                    minRows={1}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder="Nhập nội dung..."
                    variant="standard"
                    InputProps={{
                        disableUnderline: true,
                        sx: {
                            fontSize: '1.4rem',
                            bgcolor: 'background.paper',
                            borderRadius: 1,
                            boxShadow: 0,
                        },
                    }}
                    sx={{
                        '& .MuiInputBase-root': {
                            border: 'none',
                            boxShadow: 'none',
                        },
                    }}
                />

                <IconButton
                    size="small"
                    onClick={handleSubmit}
                    disabled={!value.trim() && attachments.length === 0}
                    sx={{
                        mx: 1,
                        bgcolor: 'primary.main',
                        color: 'white',
                        '&:hover': {
                            bgcolor: 'primary.dark',
                        },
                        '&.Mui-disabled': {
                            bgcolor: 'grey.300',
                            color: 'grey.500',
                        },
                    }}
                >
                    <SendIcon fontSize="small" />
                </IconButton>
            </Box>
        </Box>
    );
}

export default CommentForm;
