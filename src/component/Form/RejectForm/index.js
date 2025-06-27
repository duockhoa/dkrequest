import { Box, Typography, Button, Stack, TextField } from '@mui/material';
import { useState } from 'react';

function RejectForm({ question = 'Bạn có chắc chắn muốn từ chối yêu cầu này?', onCancel, onSubmit }) {
    const [note, setNote] = useState('');

    const handleSubmit = () => {
        onSubmit({ note });
    };

    return (
        <Box
            sx={{
                minHeight: 300,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'background.default',
                p: 3,
            }}
        >
            <Typography
                variant="h6"
                sx={{
                    mb: 3,
                    fontWeight: 'bold',
                    color: 'error.main',
                    textAlign: 'center',
                    fontSize: '1.8rem',
                }}
            >
                {question}
            </Typography>

            <Stack spacing={3} sx={{ width: '100%', maxWidth: 500 }}>
                <TextField
                    fullWidth
                    label="Lý do"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Bạn bắt buộc phải nhập lý do từ chối"
                    multiline
                    rows={3}
                    inputProps={{ style: { fontSize: '1.4rem' } }}
                    InputLabelProps={{ style: { fontSize: '1.4rem' } }}
                />
            </Stack>

            <Stack direction="row" spacing={3} justifyContent="center" sx={{ mt: 4 }}>
                <Button
                    variant="outlined"
                    color="error"
                    onClick={onCancel}
                    size="large"
                    sx={{
                        minWidth: 110,
                        fontWeight: 500,
                        borderRadius: 2,
                        fontSize: '1.4rem',
                    }}
                >
                    Hủy
                </Button>
                <Button
                    variant="contained"
                    color="error"
                    onClick={handleSubmit}
                    disabled={!note.trim()}
                    size="large"
                    sx={{
                        minWidth: 110,
                        fontWeight: 500,
                        borderRadius: 2,
                        fontSize: '1.4rem',
                        boxShadow: 2,
                    }}
                >
                    Từ chối
                </Button>
            </Stack>
        </Box>
    );
}

export default RejectForm;
