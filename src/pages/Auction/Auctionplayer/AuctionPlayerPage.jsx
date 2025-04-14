'use client'
import CustomeButton from '@/components/common/commonUi/CustomeButton'
import { Box, IconButton, Menu, MenuItem, Typography } from '@mui/material'
import './AuctionPlayerPage.css'
import { useRouter } from 'next/navigation'
import CustomeMessageBox from '@/components/common/commonUi/CustomeMessageBox'
import Image from 'next/image'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { useState } from 'react'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import MessageModal from '@/components/common/commonUi/Modal/MessageModal'

const AuctionPlayerPage = ({ tournamentData, playerData }) => {
    const [anchorEl, setAnchorEl] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [alertModal, setAlertModal] = useState({ open: false, success: false, message: "" });
    const [playerId, setPlayerId] = useState(null);
    const [processing, setProcessing] = useState(false);

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
            handleEvent(selectedItem, action)
        }
        handleClose();
    };

    const handleModalClose = () => {
        setAlertModal({ open: false, success: false, message: "" });
        setPlayerId(null);
    };

    const handleEvent = (player, action) => {
        const routes = {
            edit: `/edit-auction-player/${player?.id}`,
            delete: () => handleDeletePlayerInfo(player),
            // view_player: `/teamplayers/${team?.id}`,
        };
        typeof routes[action] === "function" ? routes[action]() : router.push(routes[action]);
    };

    const handleDeletePlayerInfo = (player) => {
        setPlayerId(player?.id)
    }

    const router = useRouter()

    return (
        <Box className="auction_player">
            {
                playerData.length === 0 && <Box className="auction_player_message">
                    <CustomeMessageBox
                        title={"No Players Available"}
                        describe={"Looks like you haven't added any players yet. Add players to start creating matches and building teams effortlessly"}
                        icon={'add-player'}
                    />
                </Box>
            }
            <Box className="auction_add_player">
                <CustomeButton
                    width={"70%"}
                    title="Add Player"
                    bgColor={"var(--primary-color)"}
                    onClick={() => router.push(`/create-auction-player/${tournamentData?.id}`)}
                />
            </Box>
            {
                playerData.length > 0 && <Box className="auction_player_section">
                    {
                        playerData.map((items, i) => {
                            return (
                                <Box key={i} className="auction_players_sub_section">
                                    <Box className="auction_player_details">
                                        <Box className="auction_player_img">
                                            {
                                                items?.playerImage ?
                                                    <Image src={`/${items?.playerImage}`} alt='image' height={80} width={80} />
                                                    :
                                                    <Box className="auction_player_avatar" sx={{ backgroundColor: items?.playerColor }}>
                                                        <Typography variant='body2'>{items?.letter}</Typography>
                                                    </Box>
                                            }
                                        </Box>
                                        <Box className="auction_player_name">
                                            <Typography variant='body2'>{items?.playerName}</Typography>
                                        </Box>
                                    </Box>
                                    <Box>
                                        <IconButton onClick={(e) => handleClick(e, items)} aria-controls="simple-menu" aria-haspopup="true" className='menu-icon-box'>
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
                                    </Box>
                                </Box>
                            )
                        })
                    }
                </Box>
            }
            <MessageModal
                open={alertModal.open}
                handleClose={handleModalClose}
                success={alertModal.success}
                message={alertModal.message}
                // handleSubmit={handleDeleteTeam}
                processing={processing}
            />
        </Box>
    )
}

export default AuctionPlayerPage