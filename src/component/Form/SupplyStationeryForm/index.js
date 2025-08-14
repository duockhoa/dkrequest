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
import { setRequestFormData, clearErrors, setFormErrors } from '../../../redux/slice/requestFormDataSlice';
import { fetchItems } from '../../../redux/slice/itemsSlice';
import {
    GridRowModes,
    DataGrid,
    GridActionsCellItem,
    GridRowEditStopReasons,
    GridToolbarContainer,
} from '@mui/x-data-grid';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

// Tạo dữ liệu mẫu thay thế cho data-grid-generator

const createRandomId = () => Math.floor(Math.random() * 100000);

const initialRows = [
    {
        id: createRandomId(),
        product_code: 'VPP00075',
        product_name: 'Bút bi xanh Double A Tritouch ngòi 0.7mm',
        quantity: 1,
        unit: 'Cái',
        usage_purpose: '',
        note: '',
    },
];

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
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(fetchItems());
    }, [dispatch]);
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
                    size="medium" // Thay đổi từ "small" thành "medium"
                    sx={{
                        textTransform: 'none',
                        fontSize: '14px', // Tăng font size
                        padding: '8px 16px', // Tăng padding
                        minHeight: '40px', // Đặt chiều cao tối thiểu
                    }}
                >
                    Thêm mặt hàng
                </Button>
            </Tooltip>
        </GridToolbarContainer>
    );
}

export default function SupplyStationeryForm() {
    const dispatch = useDispatch();
    const requestFormData = useSelector((state) => state.requestFormData.value);

    const [rows, setRows] = useState(initialRows);
    const [rowModesModel, setRowModesModel] = useState({});
    useEffect(() => {
        dispatch(setRequestFormData({ ...requestFormData, supply_stationery: rows  }));
        dispatch(clearErrors());
    }, [rows]);

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
        console.log(rows);
    };

    const handleCancelClick = (id) => () => {
        setRowModesModel({
            ...rowModesModel,
            [id]: { mode: GridRowModes.View, ignoreModifications: true },
        });

        const editedRow = rows.find((row) => row.id === id);
        if (editedRow.isNew) {
            setRows(rows.filter((row) => row.id !== id));
        }
    };

    const processRowUpdate = (newRow) => {
        // Tìm item theo tên hàng (không phân biệt dấu, hoa thường)
        const matchedItem = items.find(
            (item) =>
                removeVietnameseTones(item.product_name.toLowerCase()) ===
                removeVietnameseTones((newRow.product_name || '').toLowerCase()),
        );

        const updatedRow = {
            ...newRow,
            product_code: matchedItem ? matchedItem.product_code : '',
            // Chỉ cập nhật unit nếu chưa có giá trị
            unit: newRow.unit && newRow.unit.trim() !== ''
                ? newRow.unit
                : (matchedItem ? matchedItem.unit?.replace(/\r/g, '').trim() : ''),
            isNew: false, // Đánh dấu là đã được lưu
        };
        setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
        return updatedRow;
    };

    const handleRowModesModelChange = (newRowModesModel) => {
        setRowModesModel(newRowModesModel);
    };

    const items = useSelector((state) => state.items.items);

    const columns = [
        {
            field: 'product_code',
            headerName: 'Mã hàng',
            width: 100,
            editable: false, // Không cho phép chỉnh sửa
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
                            // Bỏ dấu và tách từ khóa
                            const keywords = removeVietnameseTones(state.inputValue.toLowerCase())
                                .split(' ')
                                .filter(Boolean);
                            return options.filter((option) => {
                                const optionNoTone = removeVietnameseTones(option.toLowerCase());
                                return keywords.every((kw) => optionNoTone.includes(kw));
                            });
                        }}
                        onInputChange={(_, newInputValue) => {
                            // Tìm item phù hợp
                            const matchedItem = items.find(
                                (item) =>
                                    removeVietnameseTones(item.product_name.toLowerCase()) ===
                                    removeVietnameseTones((newInputValue || '').toLowerCase()),
                            );
                            // Cập nhật cả product_name, product_code, unit ngay khi nhập
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
        },
        {
            field: 'usage_purpose',
            headerName: 'Mục đích sử dụng',
            width: 250,
            editable: true,
        },
        {
            field: 'note',
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
                            sx={{
                                color: 'primary.main',
                            }}
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
        <Box
            sx={{
                height: 500,
                width: '100%',
                '& .actions': {
                    color: 'text.secondary',
                },
                '& .textPrimary': {
                    color: 'text.primary',
                },
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
                    borderTop: '1px solid rgba(224, 224, 224, 1)', // Thêm border trên cho header
                },
                // Thêm border top cho header container
                '& .MuiDataGrid-columnHeaders': {
                    borderTop: '1px solid rgba(224, 224, 224, 1)',
                },
                // Thêm styling cho input khi edit
                '& .MuiDataGrid-cell--editing': {
                    fontSize: '14px',
                },
                '& .MuiDataGrid-cell--editing .MuiInputBase-root': {
                    fontSize: '14px',
                },
                '& .MuiDataGrid-cell--editing .MuiInputBase-input': {
                    fontSize: '14px',
                },
                '& .MuiDataGrid-cell--editing .MuiSelect-select': {
                    fontSize: '14px',
                },
                // Thêm border cho toàn bộ bảng
                '& .MuiDataGrid-root': {
                    border: '1px solid rgba(224, 224, 224, 1)',
                },
                // Thêm border cho các row
                '& .MuiDataGrid-row': {
                    borderBottom: '1px solid rgba(224, 224, 224, 1)',
                },
                // Đảm bảo cột cuối không có border phải
                '& .MuiDataGrid-cell:last-child': {
                    borderRight: 'none',
                },
                '& .MuiDataGrid-columnHeader:last-child': {
                    borderRight: 'none',
                },
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
    );
}
