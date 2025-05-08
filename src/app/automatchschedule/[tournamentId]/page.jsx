'use client'
import AutoMatchSchedulePage from "@/pages/Match/AutoMatchSchedule/AutoMatchSchedule.jsx"
import { matchesState } from "@/redux/slices/matchSlice"
import { teamsState } from "@/redux/slices/teamSlice"
import { tournamentState } from "@/redux/slices/tournamentSlice"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"

const AutoMatchSchedule = () => {
    const [teams, setTeams] = useState([])
    const [tournament, setTournament] = useState({})
    const params = useParams()
    const tornamentdata = useSelector(tournamentState)
    const teamdata = useSelector(teamsState)
    const matchdata = useSelector(matchesState)

    useEffect(() => {
        let filterTournament = tornamentdata?.data.find((item) => item?.id === params?.tournamentId)
        let filterMatches = teamdata?.data.filter((item) => item?.tournamentId === params?.tournamentId)
        setTeams(filterMatches)
        setTournament(filterTournament)
    }, [params]);

    return (
        <AutoMatchSchedulePage
            teamData={teams}
            tournamentId={params?.tournamentId}
            tournament={tournament}
        />
    )
}

export default AutoMatchSchedule