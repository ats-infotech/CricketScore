import CustomeBack from "@/components/common/commonUi/CustomeBack"
import CustomeMessageBox from '@/components/common/commonUi/CustomeMessageBox'
import PlayerSelection from '@/pages/PlayerSelection/StrikePlayerSection'
import { Box } from "@mui/material"
import './UserPlayers.css'

const UserPlayers = ({ teamdata, playersData }) => {

    let teamName = teamdata?.team_name

    return (
        <Box className='players_page_main' >
            <CustomeBack title={teamName + ` 's Players`} />
            <Box className='player_box_main'>
                {
                    playersData && playersData.length > 0 ?
                        <PlayerSelection
                            playerdata={playersData}
                            type='readonly'
                            isPlayerShow={true}
                            side={'user'}
                        />
                        :
                        <CustomeMessageBox
                            title='Whoops! No Players Here'
                            describe=' It looks like there are no players at the moment.'
                        />
                }
            </Box>
        </Box>
    )
}

export default UserPlayers