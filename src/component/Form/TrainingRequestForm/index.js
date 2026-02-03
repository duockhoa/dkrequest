import { Stack, Typography, TextField, MenuItem, Checkbox } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { setRequestFormData, clearErrors } from '../../../redux/slice/requestFormDataSlice';
import FileUpload from '../FileUpload';
import { formatNumberWithCommas, parseFormattedNumber } from '../../../utils/numberToWords';
import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import {
    GridRowModes,
    DataGrid,
    GridActionsCellItem,
    GridRowEditStopReasons,
    GridToolbarContainer,
} from '@mui/x-data-grid';
import Autocomplete from '@mui/material/Autocomplete';

// Hàm bỏ dấu tiếng Việt
function removeVietnameseTones(str) {
    return str
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'D');
}

function UserAutoCompleteEditCell({ id, value, field, api, users }) {
    // Tạo options duy nhất cho từng trường
    let options = [];
    if (field === 'employee_code') options = Array.from(new Set(users.map((u) => u.employee_code))).filter(Boolean);
    if (field === 'employee_name') options = Array.from(new Set(users.map((u) => u.name))).filter(Boolean);
    if (field === 'department') options = Array.from(new Set(users.map((u) => u.department))).filter(Boolean);
    if (field === 'email') options = Array.from(new Set(users.map((u) => u.email))).filter(Boolean);

    const handleChange = (event, newValue) => {
        let matchedUser = null;
        if (field === 'employee_code') matchedUser = users.find((u) => u.employee_code === newValue);
        if (field === 'employee_name') matchedUser = users.find((u) => u.name === newValue);
        if (field === 'department') {
            // Khi chọn bộ phận, chỉ cập nhật bộ phận, không fill thông tin khác
            api.setEditCellValue({ id, field, value: newValue }, event);
            return;
        }
        if (field === 'email') matchedUser = users.find((u) => u.email === newValue);

        if (matchedUser) {
            // Tự động fill thông tin nhân viên khi chọn mã hoặc tên hoặc email
            api.setEditCellValue({ id, field: 'employee_code', value: matchedUser.employee_code }, event);
            api.setEditCellValue({ id, field: 'employee_name', value: matchedUser.name }, event);
            api.setEditCellValue({ id, field: 'department', value: matchedUser.department }, event);
            api.setEditCellValue({ id, field: 'position', value: matchedUser.position }, event);
            api.setEditCellValue({ id, field: 'phone_number', value: matchedUser.phoneNumber || '' }, event);
            api.setEditCellValue({ id, field: 'email', value: matchedUser.email }, event);
        } else {
            api.setEditCellValue({ id, field, value: newValue }, event);
        }
    };

    return (
        <Autocomplete
            freeSolo
            options={options}
            value={value || ''}
            getOptionLabel={(option) => (typeof option === 'string' ? option : '')}
            renderOption={(props, option, { index }) => (
                <li {...props} key={option + '-' + index}>
                    {option}
                </li>
            )}
            filterOptions={(options, state) => {
                // Tìm kiếm không phân biệt dấu và hoa thường
                const keywords = removeVietnameseTones(state.inputValue.toLowerCase()).split(' ').filter(Boolean);
                return options.filter((option) => {
                    const optionNoTone = removeVietnameseTones(option.toLowerCase());
                    return keywords.every((kw) => optionNoTone.includes(kw));
                });
            }}
            onInputChange={(event, newInputValue) => handleChange(event, newInputValue)}
            onChange={(event, newValue) => handleChange(event, newValue)}
            renderInput={(params) => <TextField {...params} autoFocus fullWidth sx={{ width: '100%' }} />}
            size="small"
            fullWidth
            sx={{ width: '100%' }}
        />
    );
}

const createRandomId = () => Math.floor(Math.random() * 100000);

function ParticipantToolbar(props) {
    const { setParticipants, setRowModesModel } = props;

    const handleClick = () => {
        const id = createRandomId();
        setParticipants((oldRows) => [
            ...oldRows,
            {
                id,
                employee_code: '',
                employee_name: '',
                department: '',
                position: '',
                phone_number: '',
                email: '',
                isNew: true,
            },
        ]);
        setRowModesModel((oldModel) => ({
            ...oldModel,
            [id]: { mode: GridRowModes.Edit, fieldToFocus: 'employee_name' },
        }));
    };

    return (
        <GridToolbarContainer>
            <Tooltip title="Thêm người tham gia">
                <Button
                    color="primary"
                    startIcon={<AddIcon sx={{ fontSize: 20 }} />}
                    onClick={handleClick}
                    size="medium"
                    sx={{
                        textTransform: 'none',
                        fontSize: '14px',
                        padding: '8px 16px',
                        minHeight: '40px',
                    }}
                >
                    Thêm người tham gia
                </Button>
            </Tooltip>
        </GridToolbarContainer>
    );
}

function TrainingRequestForm() {
    const dispatch = useDispatch();
    const requestFormData = useSelector((state) => state.requestFormData.value);
    const errors = useSelector((state) => state.requestFormData.errors);
    const users = useSelector((state) => state.users.users);
    console.log('Users from Redux:', users);
    // State cho danh sách người tham gia
    const [participants, setParticipants] = useState([]);
    const [rowModesModel, setRowModesModel] = useState({});

    // Cập nhật participants vào Redux
    useEffect(() => {
        dispatch(
            setRequestFormData({
                ...requestFormData,
                training_request: {
                    ...requestFormData.training_request,
                    participants: participants,
                },
            }),
        );
        dispatch(clearErrors());
    }, [participants]);

    const handleChange = (event) => {
        dispatch(clearErrors());
        const { name, value } = event.target;

        let newTrainingRequest = {
            ...requestFormData.training_request,
            [name]: value,
        };

        // Xử lý format số tiền (luôn là VNĐ)
        if (name === 'budgetText') {
            const formattedValue = formatNumberWithCommas(value);
            const numericValue = parseFormattedNumber(formattedValue);
            newTrainingRequest.budgetText = formattedValue;
            newTrainingRequest.budget = numericValue;
            newTrainingRequest.currency = 'VND'; // Luôn là VNĐ
        }

        dispatch(
            setRequestFormData({
                ...requestFormData,
                training_request: newTrainingRequest,
            }),
        );
    };

    const trainingModes = ['Trực tiếp (Offline)', 'Trực tuyến (Online)', 'Kết hợp (Hybrid)'];

    const trainingLocationTypes = ['Bên trong', 'Bên ngoài', 'Tại bộ phận'];

    const trainerTypes = ['Giảng viên nội bộ', 'Giảng viên bên ngoài', 'Chuyên gia', 'Tư vấn viên'];

    // Handlers cho DataGrid
    const handleRowEditStop = (params, event) => {
        if (params.reason === GridRowEditStopReasons.rowFocusOut) {
            event.defaultMuiPrevented = true;
        }
    };

    const handleEditClick = (id) => () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
    };

    const handleSaveClick = (id) => () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
    };

    const handleDeleteClick = (id) => () => {
        setParticipants(participants.filter((row) => row.id !== id));
    };

    const handleCancelClick = (id) => () => {
        setRowModesModel({
            ...rowModesModel,
            [id]: { mode: GridRowModes.View, ignoreModifications: true },
        });

        const editedRow = participants.find((row) => row.id === id);
        if (editedRow.isNew) {
            setParticipants(participants.filter((row) => row.id !== id));
        }
    };

    const processRowUpdate = (newRow) => {
        const updatedRow = { ...newRow, isNew: false };
        setParticipants(participants.map((row) => (row.id === newRow.id ? updatedRow : row)));
        return updatedRow;
    };

    const handleRowModesModelChange = (newRowModesModel) => {
        setRowModesModel(newRowModesModel);
    };

    // Columns cho DataGrid người tham gia
    const participantColumns = [
        {
            field: 'employee_code',
            headerName: 'Mã nhân viên',
            width: 100,
            editable: true,
            renderEditCell: (params) => <UserAutoCompleteEditCell {...params} users={users} field="employee_code" />,
        },
        {
            field: 'employee_name',
            headerName: 'Họ tên (*)',
            width: 200,
            editable: true,
            renderEditCell: (params) => <UserAutoCompleteEditCell {...params} users={users} field="employee_name" />,
        },
        {
            field: 'department',
            headerName: 'Bộ phận',
            width: 150,
            editable: true,
            renderEditCell: (params) => <UserAutoCompleteEditCell {...params} users={users} field="department" />,
        },
        {
            field: 'position',
            headerName: 'Chức vụ',
            width: 150,
            editable: true,
        },
        {
            field: 'phone_number',
            headerName: 'Số điện thoại',
            width: 130,
            editable: true,
        },
        {
            field: 'email',
            headerName: 'Email',
            width: 240,
            editable: true,
            renderEditCell: (params) => <UserAutoCompleteEditCell {...params} users={users} field="email" />,
        },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Hành động',
            width: 100,
            cellClassName: 'actions',
            getActions: ({ id }) => {
                const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

                if (isInEditMode) {
                    return [
                        <GridActionsCellItem
                            key="save"
                            icon={<SaveIcon sx={{ fontSize: 20 }} />}
                            label="Lưu"
                            sx={{ color: 'primary.main' }}
                            onClick={handleSaveClick(id)}
                        />,
                        <GridActionsCellItem
                            key="cancel"
                            icon={<CancelIcon sx={{ fontSize: 20 }} />}
                            label="Hủy"
                            className="textPrimary"
                            onClick={handleCancelClick(id)}
                            color="inherit"
                        />,
                    ];
                }

                return [
                    <GridActionsCellItem
                        key="edit"
                        icon={<EditIcon sx={{ fontSize: 20 }} />}
                        label="Sửa"
                        className="textPrimary"
                        onClick={handleEditClick(id)}
                        color="inherit"
                    />,
                    <GridActionsCellItem
                        key="delete"
                        icon={<DeleteIcon sx={{ fontSize: 20 }} />}
                        label="Xóa"
                        onClick={handleDeleteClick(id)}
                        color="inherit"
                    />,
                ];
            },
        },
    ];

    return (
        <Stack spacing={1}>
            <Stack direction="row" alignItems="center" spacing={2}>
                <Typography sx={{ minWidth: 120, fontSize: '1.4rem' }}>Tên khóa đào tạo (*):</Typography>
                <TextField
                    fullWidth
                    name="course_name"
                    value={requestFormData?.training_request?.course_name || ''}
                    onChange={handleChange}
                    size="medium"
                    required
                    inputProps={{ style: { fontSize: '1.4rem' } }}
                    error={!!errors?.course_name}
                    helperText={errors?.course_name || ''}
                />
            </Stack>

            <Stack direction="row" alignItems="center" spacing={2}>
                <Typography sx={{ minWidth: 120, fontSize: '1.4rem' }}>Đơn vị đào tạo(*):</Typography>
                <TextField
                    fullWidth
                    name="training_provider"
                    value={requestFormData?.training_request?.training_provider || ''}
                    onChange={handleChange}
                    size="medium"
                    inputProps={{ style: { fontSize: '1.4rem' } }}
                    error={!!errors?.training_provider}
                    helperText={errors?.training_provider || ''}
                />
            </Stack>

            <Stack direction="row" alignItems="center" spacing={2}>
                <Typography sx={{ minWidth: 120, fontSize: '1.4rem' }}>Thời gian bắt đầu(*):</Typography>
                <TextField
                    fullWidth
                    name="start_time"
                    type="datetime-local"
                    value={requestFormData?.training_request?.start_time || ''}
                    onChange={handleChange}
                    size="medium"
                    inputProps={{ style: { fontSize: '1.4rem' } }}
                    error={!!errors?.start_time}
                    helperText={errors?.start_time || ''}
                />
            </Stack>

            <Stack direction="row" alignItems="center" spacing={2}>
                <Typography sx={{ minWidth: 120, fontSize: '1.4rem' }}>Thời gian kết thúc(*):</Typography>
                <TextField
                    fullWidth
                    name="end_time"
                    type="datetime-local"
                    value={requestFormData?.training_request?.end_time || ''}
                    onChange={handleChange}
                    size="medium"
                    inputProps={{ style: { fontSize: '1.4rem' } }}
                    error={!!errors?.end_time}
                    helperText={errors?.end_time || ''}
                />
            </Stack>

            <Stack direction="row" alignItems="center" spacing={2}>
                <Typography sx={{ minWidth: 120, fontSize: '1.4rem' }}>Số buổi học(*):</Typography>
                <TextField
                    fullWidth
                    name="session_count"
                    type="number"
                    value={requestFormData?.training_request?.session_count || ''}
                    onChange={handleChange}
                    size="medium"
                    inputProps={{ style: { fontSize: '1.4rem' }, min: 1 }}
                    error={!!errors?.session_count}
                    helperText={errors?.session_count || ''}
                />
            </Stack>

            <Stack direction="row" alignItems="center" spacing={2}>
                <Typography sx={{ minWidth: 120, fontSize: '1.4rem' }}>Ngân sách dự kiến(*):</Typography>
                <TextField
                    fullWidth
                    name="budgetText"
                    value={requestFormData?.training_request?.budgetText || ''}
                    onChange={handleChange}
                    size="medium"
                    inputProps={{
                        style: { fontSize: '1.4rem' },
                    }}
                    error={!!errors?.budgetText}
                    helperText={errors?.budgetText || ''}
                    placeholder="Nhập số tiền (VNĐ)"
                />
            </Stack>

            <Stack direction="row" alignItems="center" spacing={2}>
                <Typography sx={{ minWidth: 120, fontSize: '1.4rem' }}>Hình thức đào tạo(*):</Typography>
                <TextField
                    fullWidth
                    name="training_mode"
                    select
                    value={requestFormData?.training_request?.training_mode || ''}
                    onChange={handleChange}
                    size="medium"
                    inputProps={{ style: { fontSize: '1.4rem' } }}
                    error={!!errors?.training_mode}
                    helperText={errors?.training_mode || ''}
                >
                    {trainingModes.map((mode) => (
                        <MenuItem key={mode} value={mode}>
                            {mode}
                        </MenuItem>
                    ))}
                </TextField>
            </Stack>

            <Stack direction="row" alignItems="center" spacing={2}>
                <Typography sx={{ minWidth: 120, fontSize: '1.4rem' }}>Hình thức đào tạo(**):</Typography>
                <TextField
                    fullWidth
                    name="training_location_type"
                    select
                    value={requestFormData?.training_request?.training_location_type || ''}
                    onChange={handleChange}
                    size="medium"
                    inputProps={{ style: { fontSize: '1.4rem' } }}
                    error={!!errors?.training_location_type}
                    helperText={errors?.training_location_type || ''}
                >
                    {trainingLocationTypes.map((location) => (
                        <MenuItem key={location} value={location}>
                            {location}
                        </MenuItem>
                    ))}
                </TextField>
            </Stack>

            <Stack direction="row" alignItems="center" spacing={2}>
                <Typography sx={{ minWidth: 120, fontSize: '1.4rem' }}>Loại giảng viên(*):</Typography>
                <TextField
                    fullWidth
                    name="trainer_type"
                    select
                    value={requestFormData?.training_request?.trainer_type || ''}
                    onChange={handleChange}
                    size="medium"
                    inputProps={{ style: { fontSize: '1.4rem' } }}
                    error={!!errors?.trainer_type}
                    helperText={errors?.trainer_type || ''}
                >
                    {trainerTypes.map((type) => (
                        <MenuItem key={type} value={type}>
                            {type}
                        </MenuItem>
                    ))}
                </TextField>
            </Stack>

            <Stack direction="row" alignItems="flex-start" spacing={2}>
                <Typography sx={{ minWidth: 120, fontSize: '1.4rem', mt: 1 }}>Tính cấp thiết(*):</Typography>
                <TextField
                    fullWidth
                    name="necessity"
                    multiline
                    minRows={2}
                    maxRows={7}
                    value={requestFormData?.training_request?.necessity || ''}
                    onChange={handleChange}
                    size="medium"
                    inputProps={{ style: { fontSize: '1.4rem' } }}
                    error={!!errors?.necessity}
                    helperText={errors?.necessity || ''}
                    placeholder="Viết ngắn gọn 3-5 dòng nêu rõ kiến thức/kỹ năng còn thiếu, ảnh hưởng đến công việc hiện tại và lý do tham gia đào tạo"
                />
            </Stack>

            <Stack direction="row" alignItems="flex-start" spacing={2}>
                <Typography sx={{ minWidth: 120, fontSize: '1.4rem', mt: 1 }}>Mục tiêu đào tạo(*):</Typography>
                <TextField
                    fullWidth
                    name="training_goal"
                    multiline
                    minRows={2}
                    maxRows={4}
                    value={requestFormData?.training_request?.training_goal || ''}
                    onChange={handleChange}
                    size="medium"
                    inputProps={{ style: { fontSize: '1.4rem' } }}
                    error={!!errors?.training_goal}
                    helperText={errors?.training_goal || ''}
                    placeholder="Mô tả mục tiêu và kết quả mong đợi"
                />
            </Stack>

            {/* Thay thế FileUpload bằng DataGrid */}
            <Stack spacing={1}>
                <Typography sx={{ fontSize: '1.4rem', fontWeight: 600 }}>
                    Danh sách người tham gia đào tạo (bỏ qua và đính kèm file excel nếu nhiều người tham gia)
                </Typography>
                <Box
                    sx={{
                        height: 400,
                        width: '100%',
                        '& .actions': { color: 'text.secondary' },
                        '& .textPrimary': { color: 'text.primary' },
                        '& .MuiDataGrid-cell': {
                            fontSize: '14px',
                            borderRight: '1px solid rgba(224, 224, 224, 1)',
                            borderBottom: '1px solid rgba(224, 224, 224, 1)',
                        },
                        '& .MuiDataGrid-columnHeader': {
                            fontSize: '14px',
                            fontWeight: 600,
                            borderRight: '1px solid rgba(224, 224, 224, 1)',
                            borderBottom: '1px solid rgba(224, 224, 224, 1)',
                            borderTop: '1px solid rgba(224, 224, 224, 1)',
                        },
                        '& .MuiDataGrid-columnHeaders': {
                            borderTop: '1px solid rgba(224, 224, 224, 1)',
                        },
                        '& .MuiDataGrid-root': {
                            border: '1px solid rgba(224, 224, 224, 1)',
                        },
                        '& .MuiDataGrid-cell:last-child': { borderRight: 'none' },
                        '& .MuiDataGrid-columnHeader:last-child': { borderRight: 'none' },
                    }}
                >
                    <DataGrid
                        rows={participants}
                        columns={participantColumns}
                        editMode="row"
                        rowModesModel={rowModesModel}
                        onRowModesModelChange={handleRowModesModelChange}
                        onRowEditStop={handleRowEditStop}
                        processRowUpdate={processRowUpdate}
                        slots={{ toolbar: ParticipantToolbar }}
                        slotProps={{
                            toolbar: { setParticipants, setRowModesModel },
                        }}
                        hideFooter
                    />
                </Box>
            </Stack>
            <Stack direction="row" alignItems="flex-start" spacing={2} sx={{ p: 1 }}>
                <Typography sx={{ fontSize: '1.4rem', mt: 1 }}>
                    <Checkbox
                        sx={{ '& .MuiSvgIcon-root': { fontSize: 22 } }}
                        name="agreement"
                        defaultChecked
                    ></Checkbox>
                    <strong>Tôi và nhân sự tham gia đồng ý với các cam kết sau:</strong>
                    <br />
                    1. <strong>Tài liệu đào tạo:</strong> Gửi tài liệu đào tạo (giáo trình, slide bài giảng, video bài
                    giảng, tài liệu tham khảo,…) cho Phòng ĐT&NC sau khi hoàn thành khóa học, dưới dạng bản mềm (ưu
                    tiên) hoặc bản cứng để phục vụ lưu trữ và chia sẻ nội bộ.
                    <br />
                    2. <strong> Chứng chỉ/ Giấy chứng nhận hoàn thành khóa học: </strong> Gửi lại Phòng ĐT&NC bản sao/
                    bản scan (ưu tiên) sau khi hoàn thành khóa học để lưu trữ.
                    <br />
                    3. <strong>Báo cáo kết quả đào tạo: </strong> Học viên gửi báo cáo kết quả đào tạo sau khi hoàn
                    thành khóa học đến Quản lý bộ phận và Phòng ĐT&NC để theo dõi, hỗ trợ triển khai áp dụng kiến thức
                    sau đào tạo. hỗ trợ triển khai.
                </Typography>
            </Stack>
        </Stack>
    );
}

export default TrainingRequestForm;
