import { Box } from '@mui/material'
import './AuctionMVP.css'
import CustomeMessageBox from '@/components/common/commonUi/CustomeMessageBox'

const AuctionMVP = ({ tournamentData, playerAuctioned, isUser }) => {

    return (
        <Box className="auction_mvp_section">
            <Box className="auction_mvp_message">
                <CustomeMessageBox title={"MVP Guide"} describe={"No MVP yet – either the auction hasn't started or no players have been sold so far."} />
            </Box>
        </Box>
    )
}

export default AuctionMVP