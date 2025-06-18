import { Box, Typography, Button, Stack, TextField } from '@mui/material';
import { useState } from 'react';

function ConfirmForm({ question = 'Bạn có chắc chắn muốn từ chối yêu cầu này?', onCancel, onSubmit }) {
    const [rejectReason, setRejectReason] = useState('');

    const handleSubmit = () => {
        onSubmit(rejectReason);
    };

    return (
        <Box
            sx={{
                minHeight: 200,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'background.default',
                p: 2,
            }}
        >
            <Typography
                variant="h6"
                sx={{
                    mb: 3,
                    fontWeight: 'bold',
                    color: 'primary.main',
                    textAlign: 'center',
                    fontSize: '1.8rem',
                }}
            >
                {question}
            </Typography>

            <TextField
                fullWidth
                multiline
                rows={4}
                placeholder="Nhập lý do từ chối..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                sx={{
                    mb: 3,
                    '& .MuiInputBase-input': {
                        fontSize: '1.4rem',
                    },
                }}
            />

            <Stack direction="row" spacing={3} justifyContent="center">
                <Button
                    variant="outlined"
                    color="error"
                    onClick={onCancel}
                    size="large"
                    sx={{
                        minWidth: 110,
                        fontWeight: 500,
                        borderRadius: 2,
                        fontSize: '1rem',
                    }}
                >
                    Huỷ
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                    size="large"
                    disabled={!rejectReason.trim()}
                    sx={{
                        minWidth: 110,
                        fontWeight: 500,
                        borderRadius: 2,
                        fontSize: '1rem',
                        boxShadow: 2,
                    }}
                >
                    Xác nhận
                </Button>
            </Stack>
        </Box>
    );
}

export default ConfirmForm;
