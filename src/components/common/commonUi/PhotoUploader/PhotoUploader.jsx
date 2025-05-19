import SvgIcon from "@/assets/icons/SvgIcon";
import { Box } from "@mui/material";
import React, { useRef } from "react";
import './PhotoUploader.css'
import Avtar from "../Avtar/Avtar";

const PhotoUploader = ({ file, onChange, name, onNameChange, bgColor, type, previewOldImage }) => {
    const fileInputRef = useRef(null);

    const openFileManager = () => {
        fileInputRef.current.click();
    }

    return (
        <Box
            sx={{
                backgroundImage: `${previewOldImage ? `url(/${file})` : `url(${file})`}`,
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
            {
                name ?
                    <>
                    {(!file) && 
                        <Avtar name={name} onChange={onNameChange} bgColor={bgColor} type={type}  />
                    }
                    </>
                    :
                    <>
                        {!file && <SvgIcon id='profile' className='photo_profile_icon' />}
                    </>
            }
            <Box className='profile_sub_icon'>
                <SvgIcon id='addImage2' className='photo_profile_icon' />
            </Box>
        </Box>
    )
}

export default React.memo(PhotoUploader)