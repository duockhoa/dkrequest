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
import { setRequestFormData, clearErrors } from '../../../redux/slice/requestFormDataSlice';
import {
    GridRowModes,
    DataGrid,
    GridActionsCellItem,
    GridRowEditStopReasons,
    GridToolbarContainer,
} from '@mui/x-data-grid';
import TextField from '@mui/material/TextField';

const createRandomId = () => Math.floor(Math.random() * 100000);

const initialRows = [
    {
        id: createRandomId(),
        customer_name: '',
        product_name: '',
        address: '',
        tax_code: '',
        quantity: "",
        unit_price: '',
        vat_rate: '',
        note: '',
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
                customer_name: '',
                product_name: '',
                address: '',
                tax_code: '',
                quantity: "",
                unit_price: '',
                vat_rate: '',
                note: '',
                isNew: true,
            },
        ]);
        setRowModesModel((oldModel) => ({
            ...oldModel,
            [id]: { mode: GridRowModes.Edit, fieldToFocus: 'customer_name' },
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

export default function InvoiceRequestForm() {
    const dispatch = useDispatch();
    const requestFormData = useSelector((state) => state.requestFormData.value);

    const [rows, setRows] = useState(initialRows);
    const [rowModesModel, setRowModesModel] = useState({});

    useEffect(() => {
        dispatch(setRequestFormData({ ...requestFormData, invoice_request: rows }));
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
        // Đảm bảo luôn set isNew về false khi lưu
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
            field: 'customer_name',
            headerName: 'Tên khách hàng',
            width: 180,
            editable: true,
        },
        {
            field: 'product_name',
            headerName: 'Mặt hàng',
            width: 200,
            editable: true,
        },
        {
            field: 'address',
            headerName: 'Địa chỉ',
            width: 240,
            editable: true,
        },
        {
            field: 'tax_code',
            headerName: 'Mã số thuế',
            width: 150,
            editable: true,
        },
        {
            field: 'quantity',
            headerName: 'Số lượng',
            width: 120,
            type: 'text',
            editable: true,
        },
        {
            field: 'unit_price',
            headerName: 'Đơn giá (chưa VAT)',
            width: 150,
            type: 'text',
            editable: true,
        },
        {
            field: 'vat_rate',
            headerName: 'Thuế suất VAT',
            width: 140,
            editable: true,
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
