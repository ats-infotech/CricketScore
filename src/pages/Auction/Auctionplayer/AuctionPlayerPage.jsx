'use client'
import CustomeButton from '@/components/common/commonUi/CustomeButton'
import CustomeMessageBox from '@/components/common/commonUi/CustomeMessageBox'
import MessageModal from '@/components/common/commonUi/Modal/MessageModal'
import PlayerCard from '@/components/common/commonUi/PlayerCard/PlayerCard'
import { uploadPlayerFile } from '@/components/common/uploadFileApis'
import { deletePlayerData } from '@/redux/slices/playersSlice'
import { Box } from '@mui/material'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import './AuctionPlayerPage.css'

const AuctionPlayerPage = ({ tournamentData, playerData, isUser = false }) => {
    const [alertModal, setAlertModal] = useState({ open: false, success: false, message: "" });
    const [player, setPlayer] = useState(null);
    const [processing, setProcessing] = useState(false);
    const dispatch = useDispatch()

    const handleModalClose = () => {
        setAlertModal({ open: false, success: false, message: "" });
        setPlayer(null);
    };

    const handleEvent = (player, action) => {
        const routes = {
            edit: `/edit-auction-player/${player?.id}`,
            delete: () => handleDeletePlayerInfo(player),
        };
        typeof routes[action] === "function" ? routes[action]() : router.push(routes[action]);
    };

    const handleDeletePlayerInfo = (player) => {
        setPlayer(player)
        setAlertModal({
            success: false,
            open: true,
            message: `Are you sure want to Delete ${player?.playerName || ''} ?`
        });
    }

    const handleDeletePlayer = async () => {
        let playerId = player?.id
        setProcessing(true);
        if (playerId) {
            let fileName = (typeof player?.playerImage === 'string') ? (player?.playerImage).split('/').pop() : '';
            let method = 'DELETE';
            if (fileName) {
                const res = await uploadPlayerFile({
                    folderId: player.tournamentId,
                    subFolder: 'auction',
                    fileName: fileName,
                }, method);
            }
            let resp = await dispatch(deletePlayerData({ playerId }));
            if (resp) {
                setTimeout(() => {
                    setProcessing(false);
                    setAlertModal({
                        success: true,
                        open: true,
                        message: 'Player Deleted Successfully'
                    });
                }, 2000);
            }
        }
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
            {!isUser && <Box className="auction_add_player">
                <CustomeButton
                    width={"70%"}
                    title="Add Player"
                    bgColor={"var(--theme-primary)"}
                    onClick={() => router.push(`/create-auction-player/${tournamentData?.id}`)}
                />
            </Box>}
            {
                playerData.length > 0 && <Box className="auction_player_section">
                    {
                        playerData.map((items, i) => {
                            return (
                                <Box key={i}>
                                    <PlayerCard data={items} onClick={handleEvent} isAuction={true} title={"Add Player"} isUser={isUser} />
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
                handleSubmit={handleDeletePlayer}
                processing={processing}
            />
        </Box>
    )
}

export default AuctionPlayerPage