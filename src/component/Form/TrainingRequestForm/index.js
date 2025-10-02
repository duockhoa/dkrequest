import { Stack, Typography, TextField} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { setRequestFormData, clearErrors } from '../../../redux/slice/requestFormDataSlice';
import FileUpload from '../FileUpload';

function TrainingRequestForm() {
    const dispatch = useDispatch();
    const requestFormData = useSelector((state) => state.requestFormData.value);
    const errors = useSelector((state) => state.requestFormData.errors);

    const handleChange = (event) => {
        dispatch(clearErrors());
        const { name, value } = event.target;

        dispatch(
            setRequestFormData({
                ...requestFormData,
                meeting_room_request: {
                    ...requestFormData.meeting_room_request,
                    [name]: value,
                },
            }),
        );
    };


    return (
            <Stack spacing={2}>
                <Stack direction="row" alignItems="flex-start" spacing={2}>
                    <Typography sx={{ minWidth: 120, fontSize: '1.4rem', mt: 1 }}>Ghi chú thêm:</Typography>
                    <TextField
                        fullWidth
                        name="additional_notes"
                        multiline
                        minRows={1}
                        maxRows={4}
                        value={requestFormData?.meeting_room_request?.additional_notes || ''}
                        onChange={handleChange}
                        size="medium"
                        inputProps={{ style: { fontSize: '1.4rem' } }}
                        error={!!errors?.additional_notes}
                        helperText={errors?.additional_notes || ''}
                    />
                </Stack>
                 <FileUpload fieldName="participants" label="Danh sách nhân sự tham gia" multiple={true} maxSize={100} />
            </Stack>

    );
}

export default TrainingRequestForm;
