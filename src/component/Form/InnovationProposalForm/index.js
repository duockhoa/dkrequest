import { Box, TextField, Stack, Typography } from '@mui/material';

function InnovationProposalForm({ formData, onChange, errors }) {
    return (
        <Box sx={{ mt: 2 }}>
            <Typography variant="h6" sx={{ mb: 2, fontSize: '1.4rem', fontWeight: 600 }}>
                Thông tin Sáng kiến Cải tiến
            </Typography>
            <Stack spacing={2}>
                <Stack direction="row" alignItems="center" spacing={2}>
                    <Typography sx={{ minWidth: 200, fontSize: '1.4rem' }}>Tên sáng kiến (*)</Typography>
                    <TextField
                        fullWidth
                        name="innovation_name"
                        value={formData.innovation_name || ''}
                        onChange={onChange}
                        size="medium"
                        required
                        error={!!errors.innovation_name}
                        helperText={errors.innovation_name || ''}
                        inputProps={{ style: { fontSize: '1.4rem', padding: '1px 0px' } }}
                    />
                </Stack>

                <Stack direction="row" alignItems="flex-start" spacing={2}>
                    <Typography sx={{ minWidth: 200, fontSize: '1.4rem', pt: 1 }}>Mô tả chi tiết</Typography>
                    <TextField
                        fullWidth
                        name="description"
                        value={formData.description || ''}
                        onChange={onChange}
                        size="medium"
                        multiline
                        rows={3}
                        error={!!errors.description}
                        helperText={errors.description || ''}
                        inputProps={{ style: { fontSize: '1.4rem', padding: '1px 0px' } }}
                    />
                </Stack>

                <Stack direction="row" alignItems="center" spacing={2}>
                    <Typography sx={{ minWidth: 200, fontSize: '1.4rem' }}>Người thực hiện</Typography>
                    <TextField
                        fullWidth
                        name="implementer"
                        value={formData.implementer || ''}
                        onChange={onChange}
                        size="medium"
                        error={!!errors.implementer}
                        helperText={errors.implementer || ''}
                        inputProps={{ style: { fontSize: '1.4rem', padding: '1px 0px' } }}
                    />
                </Stack>

                <Stack direction="row" alignItems="flex-start" spacing={2}>
                    <Typography sx={{ minWidth: 200, fontSize: '1.4rem', pt: 1 }}>Lợi ích dự kiến (*)</Typography>
                    <TextField
                        fullWidth
                        name="expected_benefit"
                        value={formData.expected_benefit || ''}
                        onChange={onChange}
                        size="medium"
                        multiline
                        rows={2}
                        required
                        error={!!errors.expected_benefit}
                        helperText={errors.expected_benefit || ''}
                        inputProps={{ style: { fontSize: '1.4rem', padding: '1px 0px' } }}
                    />
                </Stack>

                <Stack direction="row" alignItems="center" spacing={2}>
                    <Typography sx={{ minWidth: 200, fontSize: '1.4rem' }}>Chi phí dự kiến (*)</Typography>
                    <TextField
                        fullWidth
                        name="expected_cost"
                        value={formData.expected_cost || ''}
                        onChange={onChange}
                        size="medium"
                        required
                        error={!!errors.expected_cost}
                        helperText={errors.expected_cost || ''}
                        inputProps={{ style: { fontSize: '1.4rem', padding: '1px 0px' } }}
                    />
                </Stack>

                <Stack direction="row" alignItems="center" spacing={2}>
                    <Typography sx={{ minWidth: 200, fontSize: '1.4rem' }}>Thời gian thực hiện (*)</Typography>
                    <TextField
                        fullWidth
                        name="implementation_time"
                        value={formData.implementation_time || ''}
                        onChange={onChange}
                        size="medium"
                        required
                        error={!!errors.implementation_time}
                        helperText={errors.implementation_time || ''}
                        placeholder="VD: 3 tháng, 6 tháng, 1 năm"
                        inputProps={{ style: { fontSize: '1.4rem', padding: '1px 0px' } }}
                    />
                </Stack>
            </Stack>
        </Box>
    );
}

export default InnovationProposalForm;
