'use client'
import CustomeButton from '@/components/common/commonUi/CustomeButton'
import { Box } from '@mui/material'
import './AuctionPlayerPage.css'
import { useRouter } from 'next/navigation'

const AuctionPlayerPage = ({ tournamentData }) => {

    const router = useRouter()

    return (
        <Box className="auction_player">
            <Box className="auction_add_player">
                <CustomeButton
                    icon="addTeams"
                    title="Add Player"
                    onClick={() => router.push(`/create-auction-player`)}
                />
            </Box>
        </Box>
    )
}

export default AuctionPlayerPage