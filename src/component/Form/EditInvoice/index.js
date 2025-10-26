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
import { getSapItems } from '../../../services/sapitemService';

const createRandomId = () => Math.floor(Math.random() * 100000);

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
                unit_price: 0,
                unit: '',
                tax_rate: 10,
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

function EditInvoice({ onClose }) {
    const requestDetail = useSelector((state) => state.requestDetail.requestDetailvalue);

    // State cho danh sách items và SAP items
    const [rows, setRows] = useState([]);
    const [rowModesModel, setRowModesModel] = useState({});
    const [sapItems, setSapItems] = useState([]);

    // Lấy danh sách SAP items
    useEffect(() => {
        const fetchData = async () => {
            const items = await getSapItems();
            setSapItems(items);
        };
        fetchData();
    }, []);

    // Khởi tạo dữ liệu từ requestDetail
    useEffect(() => {
        if (requestDetail?.invoiceRequest?.items) {
            const formattedRows = requestDetail.invoiceRequest.items.map((item) => ({
                id: item.id || createRandomId(),
                product_code: item.product_code || '',
                product_name: item.product_name || '',
                quantity: item.quantity || 1,
                unit_price: item.unit_price || 0,
                unit: item.unit || '',
                tax_rate: item.tax_rate || 0,
                note: item.notes || item.note || '',
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
        const updatedRow = {
            ...newRow,
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
                unit_price: row.unit_price,
                unit: row.unit,
                tax_rate: row.tax_rate,
                notes: row.note,
                isNew: row.isNew, // Để backend biết đây là item mới hay cập nhật
            }));

            console.log('Saving invoice data:', updateData);

            // TODO: Gọi API để cập nhật dữ liệu invoice
            // await updateInvoiceItems(requestDetail.id, updateData);

            alert('Cập nhật thành công!');
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
            width: 120,
            editable: true,
            renderEditCell: (params) => (
                <ItemAutoCompleteEditCell {...params} sapItems={sapItems} field="product_code" />
            ),
        },
        {
            field: 'product_name',
            headerName: 'Tên hàng',
            width: 340,
            editable: true,
            renderEditCell: (params) => (
                <ItemAutoCompleteEditCell {...params} sapItems={sapItems} field="product_name" />
            ),
        },
        {
            field: 'unit',
            headerName: 'ĐVT',
            width: 100,
            editable: true,
            renderEditCell: (params) => <ItemAutoCompleteEditCell {...params} sapItems={sapItems} field="unit" />,
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
            headerName: 'Đơn giá (Chưa VAT)',
            width: 150,
            type: 'number',
            editable: true,
            valueFormatter: (params) => {
                if (!params.value || isNaN(params.value)) return '';
                return new Intl.NumberFormat('vi-VN').format(params.value);
            },
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
            headerName: 'Thành tiền',
            width: 150,
            editable: false,
            type: 'number',
            align: 'right',
            headerAlign: 'right',
            valueGetter: (params) => {
                const quantity = parseFloat(params.row.quantity) || 0;
                const unitPrice = parseFloat(params.row.unit_price) || 0;
                const taxRate = parseFloat(params.row.tax_rate) || 0;
                const total = quantity * unitPrice * (1 + taxRate / 100);
                return total;
            },
            valueFormatter: (params) => {
                if (!params.value || isNaN(params.value)) return '';
                return new Intl.NumberFormat('vi-VN').format(params.value);
            },
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
        <Box sx={{ width: '100%' }}>
            <DialogTitle sx={{ textAlign: 'center', fontSize: '1.6rem', fontWeight: 'bold', color: 'primary.main' }}>
                CHỈNH SỬA DANH SÁCH HÓA ĐƠN
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

// Custom cell editor for Autocomplete fields
function ItemAutoCompleteEditCell({ id, value, field, api, sapItems }) {
    let options = [];
    if (field === 'product_code') options = Array.from(new Set(sapItems.map((i) => i.ItemCode))).filter(Boolean);
    if (field === 'product_name') options = Array.from(new Set(sapItems.map((i) => i.ItemName))).filter(Boolean);
    if (field === 'unit') options = Array.from(new Set(sapItems.map((i) => i.SalesUnit))).filter(Boolean);

    const handleChange = (event, newValue) => {
        let matchedItem = null;
        if (field === 'product_code') matchedItem = sapItems.find((i) => i.ItemCode === newValue);
        if (field === 'product_name') matchedItem = sapItems.find((i) => i.ItemName === newValue);

        if (matchedItem) {
            // Tự động fill thông tin khi chọn mã hàng hoặc tên hàng
            api.setEditCellValue({ id, field: 'product_code', value: matchedItem.ItemCode }, event);
            api.setEditCellValue({ id, field: 'product_name', value: matchedItem.ItemName }, event);
            api.setEditCellValue({ id, field: 'unit', value: matchedItem.SalesUnit }, event);
        } else {
            // Chỉ cập nhật field hiện tại
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
            onInputChange={(event, newInputValue) => handleChange(event, newInputValue)}
            onChange={(event, newValue) => handleChange(event, newValue)}
            renderInput={(params) => <TextField {...params} autoFocus fullWidth sx={{ width: '100%' }} />}
            size="small"
            fullWidth
            sx={{ width: '100%' }}
        />
    );
}

export default EditInvoice;
