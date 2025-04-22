import { formatNumberShort } from '@/components/common/commomFunction'
import CustomeBack from '@/components/common/commonUi/CustomeBack'
import CustomeMessageBox from '@/components/common/commonUi/CustomeMessageBox'
import PlayerCard from '@/components/common/commonUi/PlayerCard/PlayerCard'
import { Box, Typography } from '@mui/material'
import './AuctionMVP.css'

const AuctionMVP = ({ auctionData, teamData, playerData, type = null }) => {
    const topPlayersPerTeam = () => {
        const topPlayersMap = {}
        auctionData?.soldPlayers?.forEach((player) => {
            const teamId = player?.teamId
            if (!topPlayersMap[teamId] || player?.bidPrice > topPlayersMap[teamId]?.bidPrice) {
                topPlayersMap[teamId] = player
            }
        })
        return Object.values(topPlayersMap)
    }
    const filteredPlayers = topPlayersPerTeam().sort((a,b) => b.bidPrice - a.bidPrice)

    return (
        <Box className="auction_mvp_section">
            {filteredPlayers?.length === 0 ? (
                <Box className="auction_mvp_message">
                    <CustomeMessageBox
                        title={"MVP Guide"}
                        describe={"No MVP yet – either the auction hasn't started or no players have been sold so far."}
                    />
                </Box>
            ) : (
                <Box className="mvp_players_list">
                    {type === 'page' ? <CustomeBack title='Auction MVPs of Each Team' />
                        :
                        <Typography variant='h4'>MVPs of Each Team – Highest Paid Players</Typography>
                    }
                    {filteredPlayers.map((items, i) => {
                        const team = teamData?.find((item) => item?.id === items?.teamId)
                        const player = playerData?.find((item) => String(item?.id) === String(items?.soldPlayer))
                        const playerAmount = formatNumberShort(items?.bidPrice)

                        const data = {
                            playerName: player?.playerName,
                            playerImage: player?.playerImage,
                            playerColor: player?.playerColor || '',
                            letter: player?.letter || '',
                            teamName: team?.team_name,
                            playerAmount: playerAmount
                        }

                        return (
                            <Box key={i}>
                                <PlayerCard data={data} isUser={true} isMVP={true} />
                            </Box>
                        )
                    })}
                </Box>
            )}
        </Box>
    )
}

export default AuctionMVP
