import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchItems, setItems } from '../../redux/slice/itemsSlice';
import LoadingPage from '../../component/SharedComponent/LoadingPage';
import ConfirmForm from '../../component/Form/ConfirmForm';
import ItemsForm from '../../component/Form/ItemsForm';
import { deleteItem, createNewItem, updateItem } from '../../services/itemsService';
import { Dialog } from '@mui/material';

function Items() {
    const { items, loading, error } = useSelector((state) => state.items);
    const [item, setItem] = useState(null);
    const [openConfirm, setOpenConfirm] = useState(false);
    const [openForm, setOpenForm] = useState(false);
    const [formType, setFormType] = useState('create');
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
    const debounceRef = useRef(null);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchItems());
    }, [dispatch]);

    // Debounce search term
    useEffect(() => {
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }
        
        debounceRef.current = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 300); // 300ms delay

        return () => {
            if (debounceRef.current) {
                clearTimeout(debounceRef.current);
            }
        };
    }, [searchTerm]);

    // Memoize search function for better performance
    const searchItems = useCallback((items, searchTerm) => {
        if (!searchTerm.trim()) return items;
        
        const searchLower = searchTerm.toLowerCase().trim();
        return items.filter((item) => {
            const productCode = item.product_code?.toLowerCase() || '';
            const productName = item.product_name?.toLowerCase() || '';
            return productCode.includes(searchLower) || productName.includes(searchLower);
        });
    }, []);

    // Filter items based on debounced search term
    const filteredItems = useMemo(() => {
        return searchItems(items, debouncedSearchTerm);
    }, [items, debouncedSearchTerm, searchItems]);

    // Optimized handler functions với useCallback
    const handleEdit = useCallback((item) => {
        setItem(item);
        setFormType('edit');
        setOpenForm(true);
    }, []);

    const handleDelete = useCallback((selectedItem) => {
        setItem(selectedItem);
        setOpenConfirm(true);
    }, []);

    const handleSearchChange = useCallback((event) => {
        setSearchTerm(event.target.value);
    }, []);

    const handleClearSearch = useCallback(() => {
        setSearchTerm('');
        setDebouncedSearchTerm('');
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }
    }, []);

    // Memoize getNextProductCode để tránh tính toán lại không cần thiết
    const getNextProductCode = useMemo(() => {
        if (!items.length) return 'VPP00001';
        const maxCode = items.reduce((max, item) => {
            const num = parseInt(item.product_code.replace(/\D/g, ''), 10);
            return num > max ? num : max;
        }, 0);
        const nextNum = maxCode + 1;
        return `VPP${nextNum.toString().padStart(5, '0')}`;
    }, [items]);

    const handleAddNew = useCallback(() => {
        setItem({
            product_code: getNextProductCode,
            product_name: '',
            unit: '',
        });
        setFormType('create');
        setOpenForm(true);
    }, [getNextProductCode]);

    const handleConfirmDelete = useCallback(async () => {
        if (item) {
            try {
                const response = await deleteItem(item.product_code);
                console.log('Delete response:', response);
                if (response) {
                    // Cập nhật lại danh sách items sau khi xóa thành công
                    const updatedItems = items.filter((i) => i.product_code !== item.product_code);
                    dispatch(setItems(updatedItems));
                }
            } catch (error) {
                console.error('Error deleting item:', error);
            }
        }
        setOpenConfirm(false);
        setItem(null);
    }, [item, dispatch]);

    const handleCancelDelete = useCallback(() => {
        setOpenConfirm(false);
        setItem(null);
    }, []);

    const handleCloseForm = useCallback(() => {
        setOpenForm(false);
        setItem(null);
    }, []);

    // Memoize confirm message
    const confirmMessage = useMemo(() => {
        return item
            ? `Bạn có chắc chắn muốn xóa sản phẩm "${item.product_name}" (${item.product_code})?`
            : 'Bạn chắc chắn muốn xóa hàng hóa này?';
    }, [item]);

    // Memoize sorted items để tránh sắp xếp lại không cần thiết
    const sortedItems = useMemo(() => {
        return [...filteredItems].sort((a, b) => {
            const numA = parseInt(a.product_code.replace(/\D/g, ''), 10);
            const numB = parseInt(b.product_code.replace(/\D/g, ''), 10);
            return numB - numA;
        });
    }, [filteredItems]);

    // Memoize TableRow component để tránh re-render
    const TableRowComponent = useCallback(({ item }) => (
        <TableRow
            key={item.product_code}
            sx={{
                '&:nth-of-type(odd)': {
                    backgroundColor: '#f5f5f5',
                },
                '&:hover': {
                    backgroundColor: '#e3f2fd',
                },
                height: 48,
            }}
        >
            <TableCell
                component="th"
                scope="row"
                sx={{
                    fontWeight: 500,
                    fontSize: '14px',
                    py: 1,
                }}
            >
                {item.product_code}
            </TableCell>
            <TableCell sx={{ fontSize: '14px', py: 1 }}>{item.product_name}</TableCell>
            <TableCell align="center" sx={{ py: 1 }}>
                <Box
                    sx={{
                        backgroundColor: 'primary.light',
                        color: 'primary.contrastText',
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                        fontSize: '14px',
                        fontWeight: 500,
                        display: 'inline-block',
                        minWidth: 60,
                    }}
                >
                    {item.unit.replace('\r', '')}
                </Box>
            </TableCell>
            <TableCell align="center" sx={{ fontSize: '14px', py: 1 }}>
                {new Date(item.created_at).toLocaleDateString('vi-VN')}
            </TableCell>
            <TableCell align="center" sx={{ py: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                    <Tooltip title="Sửa">
                        <IconButton
                            size="small"
                            onClick={() => handleEdit(item)}
                            sx={{
                                color: 'primary.main',
                                '&:hover': {
                                    backgroundColor: 'primary.light',
                                    color: 'white',
                                },
                            }}
                        >
                            <EditIcon fontSize="large" />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Xóa">
                        <IconButton
                            size="small"
                            onClick={() => handleDelete(item)}
                            sx={{
                                color: 'error.main',
                                '&:hover': {
                                    backgroundColor: 'error.light',
                                    color: 'white',
                                },
                            }}
                        >
                            <DeleteIcon fontSize="large" />
                        </IconButton>
                    </Tooltip>
                </Box>
            </TableCell>
        </TableRow>
    ), [handleEdit, handleDelete]);

    // Memoize table rows
    const tableRows = useMemo(() => {
        return sortedItems.map((item) => (
            <TableRowComponent key={item.product_code} item={item} />
        ));
    }, [sortedItems, TableRowComponent]);



    if (loading) {
        return (
            <Paper sx={{ width: '100%', height: '100%', p: 3 }}>
                <LoadingPage />
            </Paper>
        );
    }

    if (error) {
        return (
            <Paper sx={{ width: '100%', height: '100%', p: 3 }}>
                <Typography color="error">Lỗi: {error}</Typography>
            </Paper>
        );
    }

    return (
        <>
            <Paper sx={{ width: '100%', height: '100%', overflow: 'hidden', p: 2 }}>
                <Box
                    sx={{
                        p: 3,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: 2,
                    }}
                >
                    <Typography
                        variant="h4"
                        component="h1"
                        sx={{
                            fontWeight: 'bold',
                            color: 'primary.main',
                            flex: 1,
                            minWidth: 'fit-content',
                        }}
                    >
                        DANH MỤC VĂN PHÒNG PHẨM
                    </Typography>

                    {/* Search and Add Button Section */}
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                            flexWrap: 'wrap',
                        }}
                    >
                        <TextField
                            size="small"
                            placeholder="Tìm kiếm..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                            sx={{
                                minWidth: 350,
                                maxWidth: 450,
                                '& .MuiOutlinedInput-root': {
                                    backgroundColor: '#f8f9fa',
                                    borderRadius: '50px',
                                    border: '1px solid #e0e0e0',
                                    '&:hover': {
                                        borderColor: '#c0c0c0',
                                    },
                                    '&.Mui-focused': {
                                        borderColor: '#1976d2',
                                        boxShadow: '0 0 0 2px rgba(25, 118, 210, 0.1)',
                                    },
                                    '& fieldset': {
                                        border: 'none',
                                    },
                                },
                                '& .MuiInputBase-input': {
                                    padding: '10px 20px 10px 0px',
                                    fontSize: '14px',
                                    color: '#333',
                                    '&::placeholder': {
                                        color: '#999',
                                        opacity: 1,
                                    },
                                },
                            }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start" sx={{ ml: 2 }}>
                                        <SearchIcon 
                                            sx={{ 
                                                color: '#666',
                                                fontSize: '20px'
                                            }} 
                                        />
                                    </InputAdornment>
                                ),
                                endAdornment: searchTerm && (
                                    <InputAdornment position="end" sx={{ mr: 1 }}>
                                        <IconButton
                                            size="small"
                                            onClick={handleClearSearch}
                                            edge="end"
                                            sx={{
                                                color: '#999',
                                                '&:hover': {
                                                    color: '#666',
                                                    backgroundColor: 'transparent',
                                                },
                                            }}
                                        >
                                            <ClearIcon fontSize="small" />
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<AddIcon />}
                            onClick={handleAddNew}
                            sx={{
                                fontSize: '14px',
                                fontWeight: 600,
                                textTransform: 'none',
                                whiteSpace: 'nowrap',
                                minWidth: 'auto',
                                px: 3,
                                py: 1,
                                borderRadius: '8px',
                            }}
                        >
                            Thêm mới
                        </Button>
                    </Box>
                </Box>

                {/* Results Counter */}
                <Box
                    sx={{
                        px: 3,
                        pb: 2,
                        display: 'flex',
                        justifyContent: 'flex-end',
                    }}
                >
                </Box>

                <TableContainer sx={{ maxHeight: 'calc(100vh - 200px)' }}>
                    <Table stickyHeader aria-label="items table">
                        <TableHead>
                            <TableRow>
                                <TableCell
                                    sx={{
                                        fontWeight: 'bold',
                                        backgroundColor: 'primary.main',
                                        color: 'white',
                                        minWidth: 120,
                                        fontSize: '14px',
                                    }}
                                >
                                    Mã sản phẩm
                                </TableCell>
                                <TableCell
                                    sx={{
                                        fontWeight: 'bold',
                                        backgroundColor: 'primary.main',
                                        color: 'white',
                                        minWidth: 300,
                                        fontSize: '14px',
                                    }}
                                >
                                    Tên sản phẩm
                                </TableCell>
                                <TableCell
                                    sx={{
                                        fontWeight: 'bold',
                                        backgroundColor: 'primary.main',
                                        color: 'white',
                                        minWidth: 100,
                                        fontSize: '14px',
                                    }}
                                    align="center"
                                >
                                    Đơn vị
                                </TableCell>
                                <TableCell
                                    sx={{
                                        fontWeight: 'bold',
                                        backgroundColor: 'primary.main',
                                        color: 'white',
                                        minWidth: 150,
                                        fontSize: '14px',
                                    }}
                                    align="center"
                                >
                                    Ngày tạo
                                </TableCell>
                                <TableCell
                                    sx={{
                                        fontWeight: 'bold',
                                        backgroundColor: 'primary.main',
                                        color: 'white',
                                        minWidth: 120,
                                        fontSize: '14px',
                                    }}
                                    align="center"
                                >
                                    Hành động
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {tableRows.length > 0 ? (
                                tableRows
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                                        <Typography variant="body2" color="text.secondary">
                                            {debouncedSearchTerm ? 'Không tìm thấy sản phẩm nào phù hợp' : 'Chưa có sản phẩm nào'}
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            <Dialog
                open={openConfirm}
                onClose={handleCancelDelete}
                maxWidth="sm"
                fullWidth
                keepMounted
                disablePortal={false}
                sx={{
                    '& .MuiDialog-paper': {
                        borderRadius: 2,
                    },
                }}
            >
                <ConfirmForm
                    onSubmit={handleConfirmDelete}
                    onCancel={handleCancelDelete}
                    question={confirmMessage}
                />
            </Dialog>

            <Dialog
                open={openForm}
                onClose={handleCloseForm}
                fullWidth
                keepMounted
                PaperProps={{ sx: { maxWidth: 600, width: '100%' } }}
            >
                <ItemsForm
                    onClose={handleCloseForm}
                    type={formType}
                    initialValues={item}
                />
            </Dialog>
        </>
    );
}

export default Items;
