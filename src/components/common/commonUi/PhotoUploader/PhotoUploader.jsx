import SvgIcon from "@/assets/icons/SvgIcon";
import { Box } from "@mui/material";
import { useRef } from "react";
import './PhotoUploader.css'

const PhotoUploader = ({ file, onChange }) => {
    const fileInputRef = useRef(null);

    const openFileManager = () => {
        fileInputRef.current.click();
    }

    return (
        <Box
            sx={{
                backgroundImage: `url(${file})`,
            }}
            className={`photo_uploader ${file ? 'isFile' : ''}`}
            onClick={openFileManager}>
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={onChange}
            />
            {!file && <SvgIcon id='profile' className='photo_profile_icon' />}
            <Box className='profile_sub_icon'>
                <SvgIcon id='addImage2' className='photo_profile_icon' />
            </Box>
        </Box>
    )
}

export default PhotoUploader