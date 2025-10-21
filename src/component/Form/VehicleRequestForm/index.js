import { Stack, Typography, TextField, Select, MenuItem } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { setRequestFormData, clearErrors } from '../../../redux/slice/requestFormDataSlice';
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
    if (field === 'full_name') options = Array.from(new Set(users.map((u) => u.name))).filter(Boolean);
    if (field === 'department') options = Array.from(new Set(users.map((u) => u.department))).filter(Boolean);
    if (field === 'phone') options = Array.from(new Set(users.map((u) => u.phoneNumber))).filter(Boolean);

    const handleChange = (event, newValue) => {
        let matchedUser = null;
        if (field === 'full_name') matchedUser = users.find((u) => u.name === newValue);
        if (field === 'phone') matchedUser = users.find((u) => u.phoneNumber === newValue);
        if (field === 'department') {
            // Khi chọn bộ phận, chỉ cập nhật bộ phận, không fill thông tin khác
            api.setEditCellValue({ id, field, value: newValue }, event);
            return;
        }

        if (matchedUser) {
            // Tự động fill thông tin nhân viên khi chọn họ tên hoặc số điện thoại
            api.setEditCellValue({ id, field: 'full_name', value: matchedUser.name }, event);
            api.setEditCellValue({ id, field: 'department', value: matchedUser.department }, event);
            api.setEditCellValue({ id, field: 'phone', value: matchedUser.phoneNumber || '' }, event);
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

function PassengerToolbar(props) {
    const { setPassengers, setRowModesModel } = props;

    const handleClick = () => {
        const id = createRandomId();
        setPassengers((oldRows) => [
            ...oldRows,
            {
                id,
                full_name: '',
                department: '',
                phone: '',
                notes: '',
                isNew: true,
            },
        ]);
        setRowModesModel((oldModel) => ({
            ...oldModel,
            [id]: { mode: GridRowModes.Edit, fieldToFocus: 'full_name' },
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

function VehicleRequestForm() {
    const dispatch = useDispatch();
    const requestFormData = useSelector((state) => state.requestFormData.value);
    const errors = useSelector((state) => state.requestFormData.errors);
    const users = useSelector((state) => state.users.users);

    // State cho danh sách người tham gia
    const [passengers, setPassengers] = useState([]);
    const [rowModesModel, setRowModesModel] = useState({});

    // Khởi tạo passengers từ Redux data (cho copy mode)
    useEffect(() => {
        if (requestFormData?.vehicle_request?.passengers && requestFormData.vehicle_request.passengers.length > 0) {
            const passengersWithIds = requestFormData.vehicle_request.passengers.map((passenger, index) => ({
                ...passenger,
                id: passenger.id || createRandomId(),
                isNew: false,
            }));
            setPassengers(passengersWithIds);
        }
    }, []); // CHỈ CHẠY 1 LẦN KHI MOUNT

    // Cập nhật passengers vào Redux - SỬA ĐỂ TRÁNH LOOP
    useEffect(() => {
        // Chỉ cập nhật khi passengers có dữ liệu và khác với Redux
        if (passengers.length > 0) {
            const currentPassengers = requestFormData?.vehicle_request?.passengers || [];

            // So sánh để tránh cập nhật không cần thiết
            if (JSON.stringify(passengers) !== JSON.stringify(currentPassengers)) {
                dispatch(
                    setRequestFormData({
                        ...requestFormData,
                        vehicle_request: {
                            ...requestFormData.vehicle_request,
                            passengers: passengers,
                        },
                    }),
                );
            }
        }
        dispatch(clearErrors());
    }, [passengers, dispatch]); // BỎ requestFormData khỏi dependencies

    // Handler cho Autocomplete
    const handleAutoChange = (field) => (event, newValue) => {
        dispatch(clearErrors());
        dispatch(
            setRequestFormData({
                ...requestFormData,
                vehicle_request: {
                    ...requestFormData.vehicle_request,
                    [field]: newValue || '',
                },
            }),
        );
    };

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
        setPassengers(passengers.filter((row) => row.id !== id));
    };

    const handleCancelClick = (id) => () => {
        setRowModesModel({
            ...rowModesModel,
            [id]: { mode: GridRowModes.View, ignoreModifications: true },
        });

        const editedRow = passengers.find((row) => row.id === id);
        if (editedRow.isNew) {
            setPassengers(passengers.filter((row) => row.id !== id));
        }
    };

    const processRowUpdate = (newRow) => {
        const updatedRow = { ...newRow, isNew: false };
        setPassengers(passengers.map((row) => (row.id === newRow.id ? updatedRow : row)));
        return updatedRow;
    };

    const handleRowModesModelChange = (newRowModesModel) => {
        setRowModesModel(newRowModesModel);
    };

    // Columns cho DataGrid người tham gia
    const passengerColumns = [
        {
            field: 'full_name',
            headerName: 'Họ tên (*)',
            width: 200,
            editable: true,
            renderEditCell: (params) => <UserAutoCompleteEditCell {...params} users={users} field="full_name" />,
        },
        {
            field: 'department',
            headerName: 'Bộ phận',
            width: 150,
            editable: true,
            renderEditCell: (params) => <UserAutoCompleteEditCell {...params} users={users} field="department" />,
        },
        {
            field: 'phone',
            headerName: 'Số điện thoại',
            width: 130,
            editable: true,
            renderEditCell: (params) => <UserAutoCompleteEditCell {...params} users={users} field="phone" />,
        },
        {
            field: 'notes',
            headerName: 'Ghi chú',
            width: 200,
            editable: true,
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
        <Stack spacing={2}>
            {/* Lý do đặt xe */}
            <Stack direction="row" alignItems="center" spacing={2}>
                <Typography sx={{ width: 150, fontSize: '1.4rem' }}>Lý do(*):</Typography>
                <TextField
                    fullWidth
                    name="reason"
                    value={requestFormData?.vehicle_request?.reason || ''}
                    onChange={(e) => handleAutoChange('reason')(null, e.target.value)}
                    size="medium"
                    inputProps={{ style: { fontSize: '1.4rem' } }}
                    error={!!errors?.reason}
                    helperText={errors?.reason || ''}
                    placeholder="VD: Làm việc tại Bắc Ninh"
                />
            </Stack>

            <Stack direction="row" alignItems="center" spacing={2}>
                <Typography sx={{ width: 150, fontSize: '1.4rem' }}>Tuyến đường(*):</Typography>
                <TextField
                    fullWidth
                    name="route"
                    value={requestFormData?.vehicle_request?.route || ''}
                    onChange={(e) => handleAutoChange('route')(null, e.target.value)}
                    size="medium"
                    inputProps={{ style: { fontSize: '1.4rem' } }}
                    error={!!errors?.route}
                    helperText={errors?.route || ''}
                    placeholder="VD: HN - Bắc Ninh - HN"
                />
            </Stack>

            <Stack direction="row" alignItems="center" spacing={2}>
                <Typography sx={{ width: 150, fontSize: '1.4rem' }}>Số km(*):</Typography>
                <TextField
                    fullWidth
                    type="number"
                    name="estimated_km"
                    value={requestFormData?.vehicle_request?.estimated_km || ''}
                    onChange={(e) => handleAutoChange('estimated_km')(null, e.target.value)}
                    size="medium"
                    inputProps={{ style: { fontSize: '1.4rem' } }}
                    error={!!errors?.estimated_km}
                    helperText={errors?.estimated_km || ''}
                />
            </Stack>

            <Stack direction="row" alignItems="center" spacing={2}>
                <Typography sx={{ width: 150, fontSize: '1.4rem' }}>Điểm đón(*):</Typography>
                <TextField
                    fullWidth
                    name="pickup_location"
                    value={requestFormData?.vehicle_request?.pickup_location || ''}
                    onChange={(e) => handleAutoChange('pickup_location')(null, e.target.value)}
                    size="medium"
                    inputProps={{ style: { fontSize: '1.4rem' } }}
                    error={!!errors?.pickup_location}
                    helperText={errors?.pickup_location || ''}
                    placeholder="VD: ĐH Dược , AEON, Cầu Lim , ..."
                />
            </Stack>

            <Stack direction="row" alignItems="center" spacing={2}>
                <Typography sx={{ width: 150, fontSize: '1.4rem' }}>Điểm trả(*):</Typography>
                <TextField
                    fullWidth
                    name="dropoff_location"
                    value={requestFormData?.vehicle_request?.dropoff_location || ''}
                    onChange={(e) => handleAutoChange('dropoff_location')(null, e.target.value)}
                    size="medium"
                    inputProps={{ style: { fontSize: '1.4rem' } }}
                    error={!!errors?.dropoff_location}
                    helperText={errors?.dropoff_location || ''}
                    placeholder="VD: Cầu Lim, AEON, ĐH Dược , ..."
                />
            </Stack>

            <Stack direction="row" alignItems="center" spacing={2}>
                <Typography sx={{ width: 150, fontSize: '1.4rem' }}>Thời điểm đi(*):</Typography>
                <TextField
                    fullWidth
                    name="departure_time"
                    value={requestFormData?.vehicle_request?.departure_time || ''}
                    onChange={(e) => handleAutoChange('departure_time')(null, e.target.value)}
                    size="medium"
                    inputProps={{ style: { fontSize: '1.4rem' } }}
                    error={!!errors?.departure_time}
                    helperText={errors?.departure_time || ''}
                    type="datetime-local"
                />
            </Stack>

            <Stack direction="row" alignItems="center" spacing={2}>
                <Typography sx={{ width: 150, fontSize: '1.4rem' }}>Dự kiến về(*):</Typography>
                <TextField
                    fullWidth
                    name="return_time"
                    value={requestFormData?.vehicle_request?.return_time || ''}
                    onChange={(e) => handleAutoChange('return_time')(null, e.target.value)}
                    size="medium"
                    inputProps={{ style: { fontSize: '1.4rem' } }}
                    error={!!errors?.return_time}
                    helperText={errors?.return_time || ''}
                    type="datetime-local"
                />
            </Stack>

            <Stack direction="row" alignItems="center" spacing={2}>
                <Typography sx={{ minWidth: 120, fontSize: '1.4rem' }}>Lái xe (*):</Typography>
                <Select
                    fullWidth
                    name="driver_option"
                    value={requestFormData?.vehicle_request?.driver_option || ''}
                    onChange={(e) => handleAutoChange('driver_option')(null, e.target.value)}
                    size="medium"
                    sx={{ fontSize: '1.4rem' }}
                    error={!!errors?.driver_option}
                >
                    <MenuItem value="Tự lái" sx={{ fontSize: 14 }}>
                        Tự lái
                    </MenuItem>
                    <MenuItem value="Thuê người lái" sx={{ fontSize: 14 }}>
                        Cty thuê tài xế
                    </MenuItem>
                </Select>
            </Stack>

            {/* Danh sách người tham gia */}
            <Stack spacing={1}>
                <Typography sx={{ fontSize: '1.4rem', fontWeight: 600 }}>Danh sách người tham gia đi xe</Typography>
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
                        rows={passengers}
                        columns={passengerColumns}
                        editMode="row"
                        rowModesModel={rowModesModel}
                        onRowModesModelChange={handleRowModesModelChange}
                        onRowEditStop={handleRowEditStop}
                        processRowUpdate={processRowUpdate}
                        slots={{ toolbar: PassengerToolbar }}
                        slotProps={{
                            toolbar: { setPassengers, setRowModesModel },
                        }}
                        hideFooter
                    />
                </Box>
            </Stack>
        </Stack>
    );
}

export default VehicleRequestForm;
