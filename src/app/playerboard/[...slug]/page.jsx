'use client'
// import Custom404 from "@/app/not-found";
import PlayerBoard from "@/pages/PlayerBoard/PlayerBoard";
import { matchesState, ReplaceMatchSchedule } from "@/redux/slices/matchSlice";
import { playersState } from "@/redux/slices/playersSlice";
import { teamsState } from "@/redux/slices/teamSlice";
import { tournamentState } from "@/redux/slices/tournamentSlice";
import { Box } from "@mui/material";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const PlayerBoards = () => {
    const router = useRouter()
    const params = useParams()
    const dispatch = useDispatch()
    // redux states
    const match_data = useSelector(matchesState)
    const team_data = useSelector(teamsState)
    const player_data = useSelector(playersState)
    const tournament_data = useSelector(tournamentState)

    const [selectedMatch, setSelectdMatch] = useState(null)
    const [tournamentData, setTournamentData] = useState([])
    const [teamplay, setTeamPlay] = useState({
        bowling: null,
        batting: null
    })
    const [players, setPlayers] = useState({
        striker: "",
        nonStriker: "",
        bowler: ""
    });

    const [disabledOn, setDisabledOn] = useState({
        bowlerSelect: false,
        batsManSlect: false,
        scoreSelect: false
    })
    const [team1, setTeam1] = useState([])
    const [team2, setTeam2] = useState([])
    // const [loading, setLoading] = useState(false)

    useEffect(() => {
        let team1 = team_data?.data?.find((items) => items?.id === selectedMatch?.team1?.id)
        let team2 = team_data?.data?.find((items) => items?.id === selectedMatch?.team2?.id)
        setTeam1(team1)
        setTeam2(team2)
    },[team_data, selectedMatch])

    useEffect(() => {
        // setLoading(true)
        let startedMatch = match_data.data?.find((item) => item?.id === params['slug'][0])
        let filterCurrentTournament = tournament_data?.data?.find((items) => items?.id === startedMatch?.tournamentId)
        setTournamentData(filterCurrentTournament)
        let teams = [team1, team2]
        
        setSelectdMatch(startedMatch)
        if (startedMatch) {
            const tossWinnerId = startedMatch?.toss?.tossWinner;
            const selectedSide = startedMatch?.toss?.selectSide;

            if (tossWinnerId && selectedSide) {
                let battingTeam, bowlingTeam;
                if (selectedSide === 'Bat') {
                    battingTeam = teams?.find((team) => team?.id === tossWinnerId) || team1;
                    bowlingTeam = teams?.find((team) => team?.id !== tossWinnerId) || team2;
                } else {
                    bowlingTeam = teams?.find((team) => team?.id === tossWinnerId) || team1;
                    battingTeam = teams?.find((team) => team?.id !== tossWinnerId) || team2;
                }
                setTeamPlay({
                    batting: battingTeam,
                    bowling: bowlingTeam,
                });
            }
        }
        // setLoading(false)
    }, [params, match_data, team_data, tournament_data, team1, team2]);


    useEffect(() => {
        if ((disabledOn?.batsManSlect && disabledOn?.bowlerSelect) || !disabledOn?.batsManSlect || !disabledOn?.bowlerSelect) {
            setDisabledOn(prev => ({
                ...prev,
                scoreSelect: true
            }))
        } else {
            setDisabledOn(prev => ({
                ...prev,
                scoreSelect: false
            }))
        }
    }, []);

    const handleOnPlayerChange = (value, key) => {
        setPlayers(prevPlayers =>
            Object.keys(prevPlayers).reduce((acc, playerKey) => ({
                ...acc,
                [playerKey]: playerKey === key ? value : prevPlayers[playerKey],
            }), {})
        );
    }

    const handleMatchPlayerData = () => {
        const createNewObj = {
            ...selectedMatch,
            playerselection: {
                striker: players.striker,
                nonStriker: players.nonStriker,
                bowler: players.bowler
            }
        }
        dispatch(ReplaceMatchSchedule(createNewObj))
        router.push(`/scoreboard/${selectedMatch?.id}`)
    }
    
    return (
        <Box>
            <PlayerBoard
                teamplay={teamplay}
                players={player_data?.data}
                striker={players?.striker}
                nonStriker={players?.nonStriker}
                bowler={players?.bowler}
                disabled={disabledOn}
                selectePlayer={players}
                handleOnPlayerChange={handleOnPlayerChange}
                startmatch={handleMatchPlayerData}
                currentmatch={selectedMatch}
                tournamentData={tournamentData}
            />
        </Box>
    )
}

export default PlayerBoards