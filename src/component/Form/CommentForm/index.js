import { Box, TextField, IconButton } from '@mui/material';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import SendIcon from '@mui/icons-material/Send';

function CommentForm({ onSubmit }) {
    const handleSubmit = () => {
        // Handle submit logic here
        if (onSubmit) onSubmit();
    };

    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                p: 1,
                border: '1px solid #e0e0e0',
                borderRadius: '50px',
                mb: 2,
            }}
        >
            <IconButton
                size="small"
                sx={{
                    mx: 1,
                    transform: 'rotate(45deg)', // Rotate the attachment icon
                }}
            >
                <AttachFileIcon />
            </IconButton>
            <TextField
                fullWidth
                placeholder="Thêm bình luận..."
                variant="standard"
                InputProps={{
                    disableUnderline: true,
                    sx: {
                        fontSize: '1.4rem',
                        '& input': {
                            p: 1,
                        },
                    },
                }}
            />
            <IconButton
                size="small"
                onClick={handleSubmit}
                sx={{
                    mx: 1,
                    bgcolor: 'primary.main',
                    color: 'white',
                    '&:hover': {
                        bgcolor: 'primary.dark',
                    },
                }}
            >
                <SendIcon fontSize="small" />
            </IconButton>
        </Box>
    );
}

export default CommentForm;
