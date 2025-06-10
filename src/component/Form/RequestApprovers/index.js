import { Stack, Typography, TextField } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { setRequestFormData } from '../../../redux/slice/requestFormDataSlice';
import { fetchRequestApprovers } from '../../../redux/slice/requestApproverSlice';
import { useEffect } from 'react';

function RequestApprovers() {
    const dispatch = useDispatch();
    const requestFormData = useSelector((state) => state.requestFormData.value);
    const requestTypeId = useSelector((state) => state.sidebar.requestTypeId);
    const user = useSelector((state) => state.user.userInfo);
    const requestApprovers = useSelector((state) => state.requestApprover.approverData);

    // Split into two separate effects
    useEffect(() => {
        if (requestTypeId && user.id) {
            dispatch(fetchRequestApprovers({ requestTypeId, userId: user.id }));
        }
    }, [requestTypeId, user.id, dispatch]);

    useEffect(() => {
        if (requestApprovers.length > 0) {
            const approversData = requestApprovers.map((approver) => ({
                user_id: approver.manager?.id || '',
                step: approver.level,
            }));

            // Sort by step to ensure correct order
            approversData.sort((a, b) => a.step - b.step);

            dispatch(
                setRequestFormData({
                    ...requestFormData,
                    approvers: approversData,
                }),
            );
        }
    }, [requestApprovers]); // Only depend on requestApprovers changes

    return (
        <Stack direction="column" spacing={2}>
            {requestApprovers.map((approver) => (
                <Stack key={approver.level} direction="row" alignItems="center" spacing={2}>
                    <Typography sx={{ minWidth: 120, fontSize: '1.4rem' }}>Phê duyệt cấp {approver.level}:</Typography>
                    <TextField
                        fullWidth
                        value={approver.manager?.name || ''}
                        disabled
                        required
                        size="medium"
                        inputProps={{
                            style: { fontSize: '1.4rem' },
                        }}
                    />
                </Stack>
            ))}
        </Stack>
    );
}

export default RequestApprovers;
