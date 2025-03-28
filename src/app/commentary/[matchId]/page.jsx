'use client'
import CommentaryPage from "@/pages/Commentary/Commentary"
import { matchesState } from "@/redux/slices/matchSlice"
import { playersState } from "@/redux/slices/playersSlice"
import { teamsState } from "@/redux/slices/teamSlice"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"

const Commentary = () => {

    const [currentMatch, setCurrentMatch] = useState([])
    const [team1, setTeam1] = useState([])
    const [team2, setTeam2] = useState([])
    const [matchPlayers, setMatchPlayers] = useState([])
    const [Commentary, setCommentary] = useState([])
    const [tossWinner, setTossWinner] = useState({
        tossWinner: '',
        battingSide: '',
        bowlingSide: ''
    })
    const [innings, setInnings] = useState()
    const params = useParams()

    //Redux Data
    const match_data = useSelector(matchesState)
    const team_data = useSelector(teamsState)
    const player_data = useSelector(playersState)

    useEffect(() => {
        let startedMatch = match_data.data?.find((item) => item?.id === params.matchId)
        setCurrentMatch(startedMatch)
    }, [params, match_data, team_data]);

    useEffect(() => {
        setTeam1(currentMatch?.team1)
        setTeam2(currentMatch?.team2)
    }, [currentMatch])

    useEffect(() => {
        let team1player = player_data?.data?.filter(item => item?.teamId === team1?.id);
        let team1XIplayer = currentMatch?.selectedPlayer?.team1;
        let commonPlayerTeam1 = team1player.filter(item => team1XIplayer?.includes(item?.id));
        let team2player = player_data?.data?.filter(item => item?.teamId === team2?.id);
        let team2XIplayer = currentMatch?.selectedPlayer?.team2;
        let commonPlayerTeam2 = team2player.filter(item => team2XIplayer?.includes(item?.id));
        const matchPlayers = [...commonPlayerTeam1, ...commonPlayerTeam2];
        setMatchPlayers(matchPlayers);
    }, [player_data, team1, team2])

    useEffect(() => {
        setInnings(currentMatch?.currentInnings)
    }, [currentMatch, currentMatch?.currentInnings])

    useEffect(() => {
        setCommentary(currentMatch?.Commentary)
    }, [currentMatch?.Commentary, currentMatch])

    useEffect(() => {
        const winnerSide = currentMatch?.toss?.selectSide;
        const tossWinner = currentMatch?.toss?.tossWinner;
        let teams = [team1, team2]
        if (tossWinner && winnerSide) {
            let battingTeam, bowlingTeam;
            if (winnerSide === 'Bat') {
                battingTeam = teams.find((team) => team.id === tossWinner) || team1;
                bowlingTeam = teams.find((team) => team.id !== tossWinner) || team2;
            } else {
                bowlingTeam = teams.find((team) => team.id === tossWinner) || team1;
                battingTeam = teams.find((team) => team.id !== tossWinner) || team2;
            }

            setTossWinner({
                tossWinner: tossWinner,
                battingSide: battingTeam?.team_name,
                bowlingSide: bowlingTeam?.team_name,
            });
        }
    }, [team1, team2, currentMatch, currentMatch?.toss]);

    return (
        <>
            <CommentaryPage
                Commentary={Commentary}
                Players={matchPlayers}
                Innings={innings}
                tossWinner={tossWinner}
                team1={team1}
                team2={team2}
            />
        </>
    )
}

export default Commentary