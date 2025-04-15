import SvgIcon from '@/assets/icons/SvgIcon';
import CloseIcon from '@mui/icons-material/Close';
import { Box } from '@mui/material';
import './SearchInput.css';

const SearchInput = ({ value, onChange, onClear, placeholder='' }) => {
    
    return (
        <Box className='search_input'>
            <SvgIcon id='search' />
            <input placeholder={placeholder || "Search Tournaments"} value={value} onChange={onChange} />
            {value && <CloseIcon className='searchClose' onClick={onClear}/>}
        </Box>
    )
}

export default SearchInput