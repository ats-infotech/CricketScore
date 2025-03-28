'use client'
import ScoreBoard from "@/pages/ScoreBoard/ScoreBoard"
import TestScoreBoard from "@/pages/ScoreBoard/TestScoreBoard"
import { matchesState } from "@/redux/slices/matchSlice"
import { tournamentState } from "@/redux/slices/tournamentSlice"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"

const ScoreBoardRoute = () => {
    const [tournamentData, setTournamentData] = useState([])
    const tournament_data = useSelector(tournamentState)
    const match_data = useSelector(matchesState)
    const params = useParams()

    useEffect(() => {
        const filterCurrentMatch = match_data?.data?.filter((items) => items?.id === params?.matchId)?.[0]
        const filterCurrentTournament = tournament_data?.data?.filter((items) => items?.id === filterCurrentMatch?.tournamentId)?.[0]
        setTournamentData(filterCurrentTournament)
    },[tournament_data, match_data])

    return (
        tournamentData?.match_type === "Test Match" ? <TestScoreBoard /> : <ScoreBoard />
    )
}

export default ScoreBoardRoute
