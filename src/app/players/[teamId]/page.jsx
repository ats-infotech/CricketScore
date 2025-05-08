'use client'
import PlayersPage from "@/pages/Players/Players"
import { playersState } from "@/redux/slices/playersSlice"
import { teamsState } from "@/redux/slices/teamSlice"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"

const Players = () => {
    const [teamdata, setTeamdata] = useState()
    const [playersData, setPlayersData] = useState([])
    const params = useParams()
    const teams_data = useSelector(teamsState)
    const players_data = useSelector(playersState)

    useEffect(() => {
        let team_data = teams_data.data.find(item => item?.id === params.teamId)
        setTeamdata(team_data)
    }, [params])

    useEffect(() => {
        let players_data_result = players_data.data.filter(item => item?.teamId === params.teamId)
        setPlayersData(players_data_result)
    }, [players_data])

    return (
        teamdata && playersData &&
        <PlayersPage
            teamdata={teamdata}
            playersData={playersData}
        />
    )
}

export default Players