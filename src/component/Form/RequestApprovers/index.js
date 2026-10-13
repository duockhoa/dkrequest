import { Stack, Typography, Avatar, Alert, Button } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { setFormApprovers } from '../../../redux/slice/requestFormDataSlice';
import { fetchRequestApprovers } from '../../../redux/slice/requestApproverSlice';
import { useEffect } from 'react';

function RequestApprovers() {
    const dispatch = useDispatch();
    const requestTypeId = useSelector((state) => state.requestId.requestTypeId);
    const user = useSelector((state) => state.user.userInfo);
    const requestApprovers = useSelector((state) => state.requestApprover.approverData);
    const loading = useSelector((state) => state.requestApprover.loading);
    const error = useSelector((state) => state.requestApprover.error);

    useEffect(() => {
        if (requestTypeId && user.id) {
            dispatch(fetchRequestApprovers({ requestTypeId, userId: user.id }));
        }
    }, [requestTypeId, user.id, dispatch]);

    useEffect(() => {
        const approversData = requestApprovers.map((approver) => ({
            user_id: approver.id || '',
            step: approver.level,
        }));

        approversData.sort((a, b) => a.step - b.step);

        dispatch(setFormApprovers(approversData));
    }, [requestApprovers, dispatch]);

    return (
        <Stack direction="column" spacing={2}>
            {loading && <Typography sx={{ fontSize: '1.4rem' }}>Đang tải người phê duyệt...</Typography>}
            {error && (
                <Alert severity="error" action={
                    <Button onClick={() => dispatch(fetchRequestApprovers({ requestTypeId, userId: user.id }))}>
                        Thử lại
                    </Button>
                }>
                    {error}
                </Alert>
            )}
            {requestApprovers.map((approver) => (
                <Stack key={`${approver.id}-${approver.level}`} direction="row" alignItems="center" spacing={2}>
                    <Typography sx={{ minWidth: 120, fontSize: '1.4rem' }}>
                        Phê duyệt cấp {approver.level}{approver.approvalRole === 'technical_deputy' ? ' (Phó phòng)' : ''}:
                    </Typography>
                    <Avatar src={approver.avatar} alt={approver.name} sx={{ width: 32, height: 32 }} />
                    <Stack>
                        <Typography sx={{ fontSize: '1.4rem', fontWeight: 500 }}>{approver.name}</Typography>
                        <Typography sx={{ fontSize: '1.2rem', color: 'text.secondary' }}>
                            {approver.position} - {approver.department}
                        </Typography>
                    </Stack>
                </Stack>
            ))}
        </Stack>
    );
}

export default RequestApprovers;
