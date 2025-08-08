import Box from '@mui/material/Box';
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
import { Button } from '@mui/material';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setRequestFormData, clearErrors, setFormErrors } from '../../../redux/slice/requestFormDataSlice';

function randomId() {
    return Math.random().toString(36).substr(2, 9);
}

const initialRows = [];

function EditToolbar(props) {
    const { setRows, setRowModesModel } = props;

    const handleClick = () => {
        const id = randomId();
        setRows((oldRows) => [
            ...oldRows,
            {
                id,
                index: oldRows.length + 1,
                name: '',
                reason: '',
                handling_old_equipment: '',
                unit: '',
                quantity: 0,
                unit_price: 0,
                total_price: 0,
                reference_info: '',
                isNew: true,
            },
        ]);
        setRowModesModel((oldModel) => ({
            ...oldModel,
            [id]: { mode: GridRowModes.Edit, fieldToFocus: 'name' },
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
                        fontWeight: 500,
                    }}
                >
                    Thêm mặt hàng
                </Button>
            </Tooltip>
        </GridToolbarContainer>
    );
}

export default function OfficeEquipmentRequestForm() {
    const [rows, setRows] = useState(initialRows);
    const [rowModesModel, setRowModesModel] = useState({});
    const dispatch = useDispatch();
    const requestFormData = useSelector((state) => state.requestFormData.value);
    
    useEffect(() => {
        dispatch(setRequestFormData({ ...requestFormData, office_equipment_request: rows }));
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
        // Tự động tính thành tiền khi cập nhật row
        const quantity = parseFloat(newRow.quantity) || 0;
        const unitPrice = parseFloat(newRow.unit_price) || 0;
        const totalPrice = quantity * unitPrice;
        
        const updatedRow = { 
            ...newRow, 
            total_price: totalPrice,
            isNew: false 
        };
        
        setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
        return updatedRow;
    };

    const handleRowModesModelChange = (newRowModesModel) => {
        setRowModesModel(newRowModesModel);
    };

    // Format số tiền với dấu phân cách
    const formatCurrency = (value) => {
        if (!value || value === 0) return '0';
        return new Intl.NumberFormat('vi-VN').format(value);
    };

    const columns = [
        {
            field: 'index',
            headerName: 'STT',
            type: 'number',
            width: 60,
            align: 'center',
            headerAlign: 'center',
            editable: false,
        },
        {
            field: 'name',
            headerName: 'Tên mặt hàng',
            width: 240,
            align: 'start',
            headerAlign: 'center',
            editable: true,
        },
        {
            field: 'reason',
            headerName: 'Lý do cung ứng',
            type: 'text',
            width: 260,
            editable: true,
        },
        {
            field: 'unit',
            headerName: 'Đơn vị tính',
            width: 100,
            editable: true,
            type: 'text',
        },
        {
            field: 'quantity',
            headerName: 'Số lượng',
            width: 80,
            editable: true,
            type: 'number',
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'unit_price',
            headerName: `Đơn giá dự tính (đ)`,
            width: 130,
            editable: true,
            type: 'number',
            align: 'right',
            headerAlign: 'center',
            valueFormatter: (params) => {
                return formatCurrency(params.value);
            },
        },
        {
            field: 'total_price',
            headerName: 'Thành tiền (đ)',
            width: 120,
            editable: false,
            type: 'number',
            align: 'right',
            headerAlign: 'center',
            valueGetter: (params) => {
                const quantity = parseFloat(params.row.quantity) || 0;
                const unitPrice = parseFloat(params.row.unit_price) || 0;
                return quantity * unitPrice;
            },
            valueFormatter: (params) => {
                return formatCurrency(params.value);
            },
            cellClassName: 'total-price-cell',
        },
        {
            field: 'reference_info',
            headerName: 'Thông tin tham khảo',
            width: 180,
            editable: true,
            type: 'text',
        },
        {
            field: 'handling_old_equipment',
            headerName: 'Hướng dẫn XL TB cũ (nếu có)',
            width: 180,
            editable: true,
            type: 'text',
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
                '& .total-price-cell': {
                    backgroundColor: '#f5f5f5',
                    fontWeight: 600,
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
                    borderTop: '1px solid rgba(224, 224, 224, 1)',
                },
                '& .MuiDataGrid-columnHeaders': {
                    borderTop: '1px solid rgba(224, 224, 224, 1)',
                },
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
                '& .MuiDataGrid-root': {
                    border: '1px solid rgba(224, 224, 224, 1)',
                },
                '& .MuiDataGrid-row': {
                    borderBottom: '1px solid rgba(224, 224, 224, 1)',
                },
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
