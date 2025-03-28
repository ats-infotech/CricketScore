'use client'
import Loader from "@/components/common/commonUi/Loader"
import CreateMatchPage from "@/pages/Match/CreateMatch"
import { teamsState } from "@/redux/slices/teamSlice"
import { tournamentState } from "@/redux/slices/tournamentSlice"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"

const CreateMatch = () => {
    const params = useParams()
    const [teams, setTeams] = useState([])
    const [tournament, setTournament] = useState({})
    const [loading, setLoading] = useState(false)

    const tournament_data = useSelector(tournamentState)
    const team_data = useSelector(teamsState)

    useEffect(() => {
        setLoading(true)
        const tournament_ = tournament_data.data.find(item => item.id === params['slug'])
        setTournament(tournament_)
        if (tournament_) {
            const filterteams = team_data?.data.filter((items) => items.tournamentId === tournament_?.id)
            setTeams(filterteams);
        }
        setTimeout(() => {
            setLoading(false)
        }, 1000);
    }, [tournament_data, params, team_data])

    if (loading || !tournament) return <Loader />;

    return (
        <CreateMatchPage tournament={tournament} teams={teams} />
    )
}

export default CreateMatch