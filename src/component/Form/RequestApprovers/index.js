import { Stack, Typography, TextField, Avatar } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { setRequestFormData } from '../../../redux/slice/requestFormDataSlice';
import { fetchRequestApprovers } from '../../../redux/slice/requestApproverSlice';
import { useEffect } from 'react';

function RequestApprovers() {
    const dispatch = useDispatch();
    const requestFormData = useSelector((state) => state.requestFormData.value);
    const requestTypeId = useSelector((state) => state.requestId.requestTypeId);
    const user = useSelector((state) => state.user.userInfo);
    const requestApprovers = useSelector((state) => state.requestApprover.approverData);

    useEffect(() => {
        if (requestTypeId && user.id) {
            dispatch(fetchRequestApprovers({ requestTypeId, userId: user.id }));
        }
    }, [requestTypeId, user.id, dispatch]);

    useEffect(() => {
        if (requestApprovers.length > 0) {
            const approversData = requestApprovers.map((approver) => ({
                user_id: approver.id || '',
                step: approver.level,
            }));

            approversData.sort((a, b) => a.step - b.step);

            dispatch(
                setRequestFormData({
                    ...requestFormData,
                    approvers: approversData,
                }),
            );
        }
    }, [requestApprovers]);

    return (
        <Stack direction="column" spacing={2}>
            {requestApprovers.map((approver) => (
                <Stack key={approver.level} direction="row" alignItems="center" spacing={2}>
                    <Typography sx={{ minWidth: 120, fontSize: '1.4rem' }}>Phê duyệt cấp {approver.level}:</Typography>
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
