import { Box, IconButton, Menu, MenuItem, Typography } from "@mui/material"
import MoreVertIcon from '@mui/icons-material/MoreVert'
import Image from "next/image"
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import { useState } from "react"
import './PlayerCard.css'
import SvgIcon from "@/assets/icons/SvgIcon"

const PlayerCard = ({ data, isUser, onClick, isMVP }) => {
    const [anchorEl, setAnchorEl] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    const handleClick = (event, item) => {
        setAnchorEl(event.currentTarget);
        setSelectedItem(item)
    };

    const handleClose = () => {
        setAnchorEl(null);
        setSelectedItem(null)
    };

    const handleMenuItemClick = (action) => {
        if (selectedItem) {
            onClick(selectedItem, action)
        }
        handleClose();
    };

    return (
        <Box className={`player_card_section ${isMVP ? 'mvp' : ''}`}>
            <Box className="player_card_details">
                <Box className="player_card_img">
                    {
                        data?.playerImage ?
                            <Image src={`/${data?.playerImage}`} alt='image' height={80} width={80} />
                            :
                            <Box className="player_card_avatar" sx={{ backgroundColor: data?.playerColor }}>
                                <Typography variant='body2'>{data?.letter}</Typography>
                            </Box>
                    }
                </Box>
                <Box className="player_card_name">
                    <Typography variant='h5'>{data?.playerName}</Typography>
                    {isMVP && <Typography variant='body2'>
                        <SvgIcon id={'gold-coin'} />
                        {data?.playerAmount}
                        </Typography>}
                    {isMVP && <Typography variant='p'>{data?.teamName}</Typography>}
                </Box>
            </Box>
            {!isUser && !isMVP && <Box>
                <IconButton onClick={(e) => handleClick(e, data)} aria-controls="simple-menu" aria-haspopup="true" className='menu-icon-box'>
                    <MoreVertIcon />
                </IconButton>
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                    className='list-menu'
                >
                    {
                        <div>
                            <MenuItem onClick={() => handleMenuItemClick('edit')}>
                                <Box className='AddPlayerTag' >
                                    <EditIcon />
                                    <Typography variant='body2'>Edit</Typography>
                                </Box>
                            </MenuItem>
                            <MenuItem onClick={() => handleMenuItemClick('delete')}>
                                <Box className='AddPlayerTag delete' >
                                    <DeleteIcon color='error' />
                                    <Typography variant='body2'>Delete</Typography>
                                </Box>
                            </MenuItem>
                        </div>
                    }
                </Menu>
            </Box>}
        </Box>
    )
}

export default PlayerCard