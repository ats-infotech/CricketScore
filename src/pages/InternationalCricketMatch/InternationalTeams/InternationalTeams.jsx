import CustomeMessageBox from '@/components/common/commonUi/CustomeMessageBox'
import SwitchSelect from '@/components/common/commonUi/SwitchSelect/SwitchSelect'
import PlayerSelection from '@/pages/PlayerSelection/StrikePlayerSection'
import { Box } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import './InternationalTeams.css'

const InternationalTeams = () => {
  const { liveMatchScoreboard } = useSelector(state => state.matchData)
  const teams = [liveMatchScoreboard?.response?.teama?.short_name, liveMatchScoreboard?.response?.teamb?.short_name]
  const [currentTeam, setCurrentTeam] = useState(0)
  const [playersData, setPlayersData] = useState([]);
  const squadPlayer = liveMatchScoreboard.response.squads.teama?.squads

  const handleSwitchTeam = (val) => {
    setCurrentTeam(val);
  };

  // Update player data whenever currentTeam or liveMatchScoreboard changes
  useEffect(() => {
    if (!liveMatchScoreboard?.response?.squads || !liveMatchScoreboard?.response?.players) return;

    const playerdata = liveMatchScoreboard?.response?.players?.filter((player, idx) =>
      squadPlayer.filter((team) => player.pid === team.player_id)
    )

    setPlayersData(playerdata)

  }, [currentTeam, liveMatchScoreboard]);

  const mapPlayerData = (playersData) => {
    return playersData.map(player => ({
      id: player.pid ?? '',
      playerName: player.title ?? '',
      playerImage: player.profile_image ?? '',
      playerColor: '#1976d2', 
      letter: player.title?.charAt(0) || '',
      playerRole: player.playing_role,
      nationality: player.nationality,
      countryFlag: player.country_flag,
      fantasyRating: player.fantasy_player_rating
    }))
  }

  return (
    <Box className='international-matches-teams-main-section'>

      <Box className='international-matches-teams-sub-section'>
        <Box className='international-matches-teams-tab'>
          <SwitchSelect options={teams} defaultSelected={currentTeam} onChange={(val) => handleSwitchTeam(val)} />
        </Box>

        <Box className='player_box_main'>
          {
            playersData && playersData.length > 0 ?
              <PlayerSelection
                playerdata={mapPlayerData(playersData)}
                type='readonly'
                isPlayerShow={true}
                side={'user'}
                isImageWithHttp={true}
              />
              :
              <CustomeMessageBox
                title='Whoops! No Players Here'
                describe=' It looks like there are no players at the moment.'
              />
          }
        </Box>
      </Box>
    </Box>
  )
}

export default InternationalTeams
