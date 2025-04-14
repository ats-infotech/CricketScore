import { Box, Button, Typography } from "@mui/material";
import Image from "next/image";
import './CustomeFileCss/CustomeTags.css';

const CustomeTags = ({ label, data, keyName, onClick, value, error, disabled }) => {

    const handleChange = (title, keyName) => {
        if (title && keyName) {
            onClick(title, keyName)
        }
    }
    
    return (
        <Box className='custome_tags'>
            <label>{label}</label>
            <Box className={`tags_box ${keyName === 'ball_type' || keyName === 'skills' ? 'nowrap' : 'wrap'}`}>
                {
                    data.length > 0 && data.map((tag, i) => {
                        let selected = keyName === 'break' ? (value === tag?.key_name) : (value === tag?.title)
                        let isDisabled = (tag?.key_name === "test-match" && disabled)
                        if (keyName === 'ball_type' || keyName === 'skills') {
                            return (
                                <Box key={i} onClick={() => handleChange(tag?.title, keyName)}>
                                    <Box className={`tag_Image ${selected ? 'selected' : 'notSelected'}`}>
                                        <Box className={`image_tag_box ${selected ? 'active' : ''}`}>
                                            {tag?.image && <Image src={tag?.image} alt='tags Images' width={100} height={100} unoptimized />}
                                        </Box>
                                    </Box>
                                    <Typography variant="body2" className={`tag_title ${selected ? 'active' : ''}`}>{tag?.title}</Typography>
                                </Box>
                            )
                        } else if (keyName === 'break') {
                            return <Button variant="contained" key={i} className={`tag_button break ${selected ? 'activeblue' : ''} ${isDisabled ? 'disabled' : ''}`} onClick={() => handleChange(tag?.title, tag?.key_name)} disabled={isDisabled}> {tag?.title} </Button>
                        } else {
                            return <Button variant="contained" key={i} className={`tag_button ${selected ? 'active' : ''} ${isDisabled ? 'disabled' : ''}`} onClick={() => handleChange(tag?.title, keyName)} disabled={isDisabled}> {tag?.title} </Button>
                        }
                    })
                }
            </Box>
            {error && <Typography color="error" variant="body2" sx={{ fontSize: "var(--ex-small)", padding: '6px 10px 0' }}>{error}</Typography>}
        </Box>
    )
}

export default CustomeTags