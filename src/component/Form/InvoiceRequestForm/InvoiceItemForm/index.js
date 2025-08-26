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
import { setRequestFormData, clearErrors } from '../../../../redux/slice/requestFormDataSlice';
import {
    GridRowModes,
    DataGrid,
    GridActionsCellItem,
    GridRowEditStopReasons,
    GridToolbarContainer,
} from '@mui/x-data-grid';
import { getSapItems } from '../../../../services/sapitemService';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

const createRandomId = () => Math.floor(Math.random() * 100000);

const initialRows = [
    {
        id: createRandomId(),
        product_code: '',
        product_name: '',
        batch_number: '',
        quantity: '',
        unit_price: '',
        unit: '',
        tax_rate: '',
        note: '',
        isNew: true,
    },
];

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
                batch_number: '',
                quantity: '',
                unit_price: '',
                unit: '',
                tax_rate: '',
                note: '',
                isNew: true,
            },
        ]);
        setRowModesModel((oldModel) => ({
            ...oldModel,
            [id]: { mode: GridRowModes.Edit, fieldToFocus: 'product_code' },
        }));
    };

    return (
        <GridToolbarContainer>
            <Tooltip title="Thêm dòng mới">
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
                    Thêm dòng
                </Button>
            </Tooltip>
        </GridToolbarContainer>
    );
}

export default function InvoiceItemForm() {
    const dispatch = useDispatch();
    const requestFormData = useSelector((state) => state.requestFormData.value);

    const [rows, setRows] = useState(initialRows);
    const [items, setItems] = useState([]);
    const [rowModesModel, setRowModesModel] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            const sapItems = await getSapItems();
            setItems(sapItems);
        };
        fetchData();
    }, []);

    useEffect(() => {
        dispatch(
            setRequestFormData({
                ...requestFormData,
                invoice_request: { ...requestFormData.invoice_request, items: rows },
            }),
        );
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
        const updatedRow = {
            ...newRow,
            isNew: false,
        };
        setRows((prevRows) => prevRows.map((row) => (row.id === newRow.id ? updatedRow : row)));
        return updatedRow;
    };

    const handleRowModesModelChange = (newRowModesModel) => {
        setRowModesModel(newRowModesModel);
    };

    const columns = [
        {
            field: 'product_code',
            headerName: 'Mã hàng',
            width: 120,
            editable: true,
            renderEditCell: (params) => (
                <ItemAutoCompleteEditCell {...params} items={items} field="product_code" setRows={setRows} />
            ),
        },
        {
            field: 'product_name',
            headerName: 'Tên hàng',
            width: 280,
            editable: true,
            renderEditCell: (params) => <ItemAutoCompleteEditCell {...params} items={items} field="product_name" />,
        },
        {
            field: 'unit',
            headerName: 'ĐVT',
            width: 100,
            editable: true,
            renderEditCell: (params) => (
                <ItemAutoCompleteEditCell {...params} items={items} field="unit" setRows={setRows} />
            ),
        },
        {
            field: 'quantity',
            headerName: 'Số lượng',
            width: 120,
            type: 'number',
            editable: true,
        },
        {
            field: 'unit_price',
            headerName: 'Đơn giá (đ)',
            width: 150,
            type: 'number',
            editable: true,
        },
        {
            field: 'tax_rate',
            headerName: 'Thuế suất (%)',
            type: 'number',
            width: 140,
            editable: true,
        },
        {
            field: 'total_amount',
            headerName: 'Thành tiền(đ)',
            width: 120,
            editable: false,
            type: 'number',
            align: 'right',
            headerAlign: 'right',
            valueGetter: (params) => {
                const quantity = parseFloat(params.row.quantity) || 0;
                const unitPrice = parseFloat(params.row.unit_price) || 0;
                const taxRate = parseFloat(params.row.tax_rate || params.row.vat_rate) || 0;
                const total = quantity * unitPrice + quantity * unitPrice * (taxRate / 100);
                return total;
            },
            valueFormatter: (params) => {
                if (!params.value || isNaN(params.value)) return '';
                return new Intl.NumberFormat('vi-VN').format(params.value);
            },
            cellClassName: 'total-amount-cell',
        },
        {
            field: 'note',
            headerName: 'Ghi chú',
            width: 180,
            editable: true,
        },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Hành động',
            width: 130,
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
                height: 300,
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
                    whiteSpace: 'pre-line',
                    wordBreak: 'break-word',
                    lineHeight: 1.4,
                    maxHeight: 'none',
                },
                '& .MuiDataGrid-columnHeader': {
                    fontSize: '14px',
                    fontWeight: 600,
                    borderRight: '1px solid rgba(224, 224, 224, 1)',
                    borderBottom: '1px solid rgba(224, 224, 224, 1)',
                    borderTop: '1px solid rgba(224, 224, 224, 1)',
                    whiteSpace: 'pre-line',
                    wordBreak: 'break-word',
                    lineHeight: 1.4,
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

// Custom cell editor for Autocomplete fields
function ItemAutoCompleteEditCell({ id, value, field, api, items, setRows }) {
    let options = [];
    if (field === 'product_code') options = Array.from(new Set(items.map((i) => i.ItemCode))).filter(Boolean);
    if (field === 'product_name') options = Array.from(new Set(items.map((i) => i.ItemName))).filter(Boolean);
    if (field === 'unit') options = Array.from(new Set(items.map((i) => i.SalesUnit))).filter(Boolean);

    const handleChange = (event, newValue) => {
        let matchedItem = null;
        if (field === 'product_code') matchedItem = items.find((i) => i.ItemCode === newValue);
        if (field === 'product_name') matchedItem = items.find((i) => i.ItemName === newValue);

        if (matchedItem) {
            api.setEditCellValue({ id, field: 'product_code', value: matchedItem.ItemCode }, event);
            api.setEditCellValue({ id, field: 'product_name', value: matchedItem.ItemName }, event);
            api.setEditCellValue({ id, field: 'unit', value: matchedItem.SalesUnit }, event);
        } else {
            // Nếu đang sửa đơn vị tính thì chỉ cập nhật đơn vị tính
            api.setEditCellValue({ id, field, value: newValue }, event);
        }
    };
    const handlePaste = (event) => {
        const pasteData = (event.clipboardData || window.clipboardData).getData('text');
        // Kiểm tra có phải bảng không (có tab hoặc nhiều dòng)
        const isTable = pasteData.includes('\t') || pasteData.includes('\n');
        if (!isTable) {
            // Không phải bảng: điền giá trị vào ô hiện tại
            api.setEditCellValue({ id, field, value: pasteData }, event);
            event.preventDefault();
            return;
        }
        // Nếu là bảng: parse và push từng dòng vào items (rows)
        const rowsData = pasteData
            .trim()
            .split('\n')
            .map((row) => row.split('\t'));
        // Giả sử columns: [product_code, product_name, batch_number, quantity, unit_price, unit, tax_rate, note]
        const newRows = rowsData.map((cols) => ({
            id: createRandomId(),
            product_code: cols[0] || '',
            product_name: cols[1] || '',
            unit: cols[2] || '',
            quantity: cols[3] || '',
            unit_price: cols[4] || '',
            tax_rate: cols[5] || '',
            note: cols[6] || '',
            isNew: true,
        }));
        // Push vào items (rows)
        setRows((prev) => [...prev, ...newRows]);
        event.preventDefault();
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
            onInputChange={(event, newInputValue) => handleChange(event, newInputValue)}
            onChange={(event, newValue) => handleChange(event, newValue)}
            renderInput={(params) => <TextField {...params} autoFocus fullWidth sx={{ width: '100%' }} />}
            size="small"
            fullWidth
            sx={{ width: '100%' }}
            onPaste={handlePaste}
        />
    );
}
