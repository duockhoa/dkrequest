import { Box, Typography, Button, Stack } from '@mui/material';

function ConfirmForm({ question = 'Bạn có chắc chắn muốn xác nhận yêu cầu này?', onCancel, onSubmit }) {
    return (
        <Box
            sx={{
                minHeight: 200,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'background.default',
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
                    onClick={onSubmit}
                    size="large"
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
