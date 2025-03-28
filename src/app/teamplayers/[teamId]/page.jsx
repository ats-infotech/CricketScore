'use client'
import UserPlayers from "@/pages/UserUi/Players/UserPlayers"
import { playersState } from "@/redux/slices/playersSlice"
import { teamsState } from "@/redux/slices/teamSlice"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"

const Teamplayers = () => {
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

    return(
        <UserPlayers teamdata={teamdata} playersData={playersData} />
    )
}

export default Teamplayers