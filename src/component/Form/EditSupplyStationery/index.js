import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import { useSelector, useDispatch } from 'react-redux';
import { DialogTitle, DialogContent, DialogActions } from '@mui/material';
import {
    GridRowModes,
    DataGrid,
    GridActionsCellItem,
    GridRowEditStopReasons,
    GridToolbarContainer,
} from '@mui/x-data-grid';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { fetchItems } from '../../../redux/slice/itemsSlice';
import { updateSupplyStationery } from '../../../services/SupplyStationeryService';
import { fetchRequestDetail } from '../../../redux/slice/requestDetailSlice';
const createRandomId = () => Math.floor(Math.random() * 100000);

// Hàm bỏ dấu tiếng Việt
function removeVietnameseTones(str) {
    return str
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'D');
}

function EditToolbar(props) {
    const { setRows, setRowModesModel } = props;

    const handleClick = () => {
        const id = createRandomId();
        setRows((oldRows) => [
            ...oldRows,
            {
                id,
                product_code: '',
                product_name: '',
                quantity: 1,
                unit: '',
                usage_purpose: '',
                note: '',
                isNew: true,
            },
        ]);
        setRowModesModel((oldModel) => ({
            ...oldModel,
            [id]: { mode: GridRowModes.Edit, fieldToFocus: 'product_name' },
        }));
    };

    return (
        <GridToolbarContainer>
            <Tooltip title="Thêm mặt hàng mới">
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
                    Thêm mặt hàng
                </Button>
            </Tooltip>
        </GridToolbarContainer>
    );
}

function EditSupplyStationery({ onClose }) {
    const requestDetail = useSelector((state) => state.requestDetail.requestDetailvalue);
    const items = useSelector((state) => state.items.items);
    const dispatch = useDispatch();

    // Lấy danh sách mặt hàng từ backend khi component được mount
    useEffect(() => {
        dispatch(fetchItems());
    }, [dispatch]);

    // Chuyển đổi dữ liệu từ backend thành format cho DataGrid
    const [rows, setRows] = useState([]);
    const [rowModesModel, setRowModesModel] = useState({});

    // Khởi tạo dữ liệu từ requestDetail
    useEffect(() => {
        if (requestDetail?.supplyStationery) {
            const formattedRows = requestDetail.supplyStationery.map((item) => ({
                id: item.id || createRandomId(),
                product_code: item.product_code || '',
                product_name: item.product_name || '',
                quantity: item.quantity || 1,
                unit: item.unit || '',
                usage_purpose: item.usage_purpose || '',
                note: item.note || '',
                isNew: false,
                originalId: item.id, // Lưu ID gốc để update
            }));
            setRows(formattedRows);
        }
    }, [requestDetail]);

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
        setRows(rows.filter((row) => row.id !== id));
    };

    const handleCancelClick = (id) => () => {
        setRowModesModel({
            ...rowModesModel,
            [id]: { mode: GridRowModes.View, ignoreModifications: true },
        });

        const editedRow = rows.find((row) => row.id === id);
        if (editedRow?.isNew) {
            setRows(rows.filter((row) => row.id !== id));
        }
    };

    const processRowUpdate = (newRow) => {
        // Tìm item theo tên hàng
        const matchedItem = items.find(
            (item) =>
                removeVietnameseTones(item.product_name.toLowerCase()) ===
                removeVietnameseTones((newRow.product_name || '').toLowerCase()),
        );

        const updatedRow = {
            ...newRow,
            product_code: matchedItem ? matchedItem.product_code : newRow.product_code,
            unit: matchedItem ? matchedItem.unit?.replace(/\r/g, '').trim() : newRow.unit,
            isNew: false,
        };
        setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
        return updatedRow;
    };

    const handleRowModesModelChange = (newRowModesModel) => {
        setRowModesModel(newRowModesModel);
    };

    // Xử lý lưu dữ liệu
    const handleSave = async () => {
        try {
            // Chuẩn bị dữ liệu để gửi API
            const updateData = rows.map((row) => ({
                id: row.originalId, // ID gốc từ database
                product_code: row.product_code,
                product_name: row.product_name,
                quantity: row.quantity,
                unit: row.unit,
                usage_purpose: row.usage_purpose,
                note: row.note,
                isNew: row.isNew, // Để backend biết đây là item mới hay cập nhật
            }));
            await updateSupplyStationery({
                request_id: requestDetail.id,
                supplyStationeries: updateData,
            });
            dispatch(fetchRequestDetail(requestDetail.id));

            onClose();
        } catch (error) {
            console.error('Error saving:', error);
            alert('Có lỗi xảy ra khi cập nhật!');
        }
    };

    const columns = [
        {
            field: 'product_code',
            headerName: 'Mã hàng',
            width: 100,
            editable: true,
        },
        {
            field: 'product_name',
            headerName: 'Tên hàng',
            width: 300,
            editable: true,
            renderEditCell: (params) => {
                return (
                    <Autocomplete
                        freeSolo
                        options={items.map((item) => item.product_name)}
                        value={params.value || ''}
                        fullWidth
                        filterOptions={(options, state) => {
                            const keywords = removeVietnameseTones(state.inputValue.toLowerCase())
                                .split(' ')
                                .filter(Boolean);
                            return options.filter((option) => {
                                const optionNoTone = removeVietnameseTones(option.toLowerCase());
                                return keywords.every((kw) => optionNoTone.includes(kw));
                            });
                        }}
                        onInputChange={(_, newInputValue) => {
                            const matchedItem = items.find(
                                (item) =>
                                    removeVietnameseTones(item.product_name.toLowerCase()) ===
                                    removeVietnameseTones((newInputValue || '').toLowerCase()),
                            );

                            params.api.setEditCellValue({
                                id: params.id,
                                field: 'product_name',
                                value: newInputValue,
                            });
                            params.api.setEditCellValue({
                                id: params.id,
                                field: 'product_code',
                                value: matchedItem ? matchedItem.product_code : '',
                            });
                            params.api.setEditCellValue({
                                id: params.id,
                                field: 'unit',
                                value: matchedItem ? matchedItem.unit?.replace(/\r/g, '').trim() : '',
                            });
                        }}
                        renderInput={(paramsInput) => (
                            <TextField {...paramsInput} variant="outlined" size="small" autoFocus fullWidth />
                        )}
                    />
                );
            },
        },
        {
            field: 'quantity',
            headerName: 'Số lượng',
            type: 'number',
            width: 100,
            align: 'left',
            headerAlign: 'left',
            editable: true,
        },
        {
            field: 'unit',
            headerName: 'Đơn vị tính',
            width: 100,
            editable: true,
            renderEditCell: (params) => {
                const currentRow = rows.find((row) => row.id === params.id);
                const isReadOnly = currentRow?.product_code && currentRow.product_code.trim() !== '';

                return (
                    <TextField
                        value={params.value || ''}
                        onChange={(e) => {
                            if (!isReadOnly) {
                                params.api.setEditCellValue({
                                    id: params.id,
                                    field: 'unit',
                                    value: e.target.value,
                                });
                            }
                        }}
                        variant="outlined"
                        size="small"
                        fullWidth
                        disabled={isReadOnly}
                        sx={{
                            '& .MuiInputBase-input': {
                                fontSize: '14px',
                                backgroundColor: isReadOnly ? '#f5f5f5' : 'transparent',
                                cursor: isReadOnly ? 'not-allowed' : 'text',
                            },
                        }}
                    />
                );
            },
        },
        {
            field: 'usage_purpose',
            headerName: 'Mục đích sử dụng',
            width: 200,
            editable: true,
        },
        {
            field: 'note',
            headerName: 'Ghi chú',
            width: 150,
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
        <Box sx={{ width: '100%' }}>
            <DialogTitle sx={{ textAlign: 'center', fontSize: '1.6rem', fontWeight: 'bold', color: 'primary.main' }}>
                CHỈNH SỬA DANH SÁCH VĂN PHÒNG PHẨM
            </DialogTitle>

            <DialogContent>
                <Box
                    sx={{
                        height: 500,
                        width: '100%',
                        mt: 2,
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
                        rows={rows}
                        columns={columns}
                        editMode="row"
                        rowModesModel={rowModesModel}
                        onRowModesModelChange={handleRowModesModelChange}
                        onRowEditStop={handleRowEditStop}
                        processRowUpdate={processRowUpdate}
                        slots={{ toolbar: EditToolbar }}
                        slotProps={{
                            toolbar: { setRows, setRowModesModel },
                        }}
                        hideFooter
                    />
                </Box>
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 3 }}>
                <Button onClick={onClose} variant="outlined" size="large">
                    Hủy
                </Button>
                <Button onClick={handleSave} variant="contained" size="large">
                    Lưu thay đổi
                </Button>
            </DialogActions>
        </Box>
    );
}

export default EditSupplyStationery;
