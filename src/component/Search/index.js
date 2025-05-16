import { TextField } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';  
import { changeValue } from '../../redux/slice/searchSlice';

function Search() {
    const dispatch = useDispatch();
    const value = useSelector((state) => state.search.value);
    const handleChange = (event) => {
        dispatch(changeValue(event.target.value));
    };
    return (
        <TextField
            variant="outlined"
            size="small"
            placeholder="Tìm kiếm..."
            sx={{
        width: '250px',
        maxWidth: '45vw',
        marginRight: '16px',
        backgroundColor: '#f9f9f9',
        borderRadius: '900px',
        '& .MuiOutlinedInput-root': {
            borderRadius: '900px',
            borderColor: '#ddd',
        },
    }}
    value={value}
    onChange={handleChange}
    InputProps={{
        sx: {
            fontSize: '1.4rem',
                    fontWeight: '400',
                },
            }}
        />
    );
}

export default Search;