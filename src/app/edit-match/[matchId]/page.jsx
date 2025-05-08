'use client'
import CreateMatchPage from "@/pages/Match/CreateMatch"
import { matchesState } from "@/redux/slices/matchSlice"
import { teamsState } from "@/redux/slices/teamSlice"
import { tournamentState } from "@/redux/slices/tournamentSlice"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"

const EditMatch = () => {
    const params = useParams()
    const [matchData, setMatchData] = useState(null)
    const [teams, setTeams] = useState([])
    const [tournament, setTournament] = useState({})

    const match_data = useSelector(matchesState)
    const tournament_data = useSelector(tournamentState)
    const team_data = useSelector(teamsState)

    useEffect(() => {
        if (params?.matchId) {
            let match = match_data.data.find(item => item?.id === params?.matchId);
            const tournament_ = tournament_data.data.find(item => item.id === match?.tournamentId)
            const filterteams = team_data?.data.filter((items) => items.tournamentId === match?.tournamentId)
            setTournament(tournament_)
            setMatchData(match);
            setTeams(filterteams)
        }
    }, [tournament_data, params, team_data, matchData]);

    return (
        <CreateMatchPage
            tournament={tournament}
            teams={teams}
            type={"edit"}
            matchData={matchData}
        />
    )

}

export default EditMatch