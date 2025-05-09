'use client'
import { calculateMVPPoints } from "@/components/common/commomFunction";
import SummaryPage from "@/pages/Summary/Summary";
import { teamsState } from "@/redux/slices/teamSlice";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Matchstats from "../Matchstats/Matchstats";

const Mvp = ({ matchData, playerData, type, teamData, tournamentData }) => {
    const router = useRouter()
    const [winnerTeam, setWinnerTeam] = useState([])
    const [team1, setTeam1] = useState([])
    const [team2, setTeam2] = useState([])
    const [team1Score, setTeam1Score] = useState({
        run: 0,
        wicket: 0,
        over: 0,
        ball: 0,
    })
    const [team2Score, setTeam2Score] = useState({
        run: 0,
        wicket: 0,
        over: 0,
        ball: 0
    })
    const [matchPlayers, setMatchPlayers] = useState([])
    const [mvpPoints, setMvpPoints] = useState([])
    const team_data = useSelector(teamsState)

    useEffect(() => {
        let team1 = team_data?.data?.find((items) => items?.id === matchData?.team1?.id)
        let team2 = team_data?.data?.find((items) => items?.id === matchData?.team2?.id)
        setTeam1(team1)
        setTeam2(team2)
        if (matchData?.team1?.id === matchData?.matchWinner) {
            setWinnerTeam(team1)
        } else if (matchData?.team2?.id === matchData?.matchWinner) {
            setWinnerTeam(team2)
        }
    }, [matchData, team_data])

    useEffect(() => {
        let team1player = playerData?.filter(item => item?.teamId === team1?.id);
        let team1XIplayer = matchData?.selectedPlayer?.team1;
        let commonPlayerTeam1 = team1player.filter(item => team1XIplayer?.includes(item?.id));
        let team2player = playerData?.filter(item => item?.teamId === team2?.id);
        let team2XIplayer = matchData?.selectedPlayer?.team2;
        let commonPlayerTeam2 = team2player.filter(item => team2XIplayer?.includes(item?.id));
        const matchPlayers = [...commonPlayerTeam1, ...commonPlayerTeam2];
        setMatchPlayers(matchPlayers);
    }, [playerData, team1, team2])

    useEffect(() => {
        const firstInningscompletedOver = matchData?.firstInnings?.Completedovers?.[matchData?.firstInnings?.Completedovers.length - 1];
        const secondInningscompletedOver = matchData?.secondInnings?.Completedovers?.[matchData?.secondInnings?.Completedovers.length - 1];
        const teamOneBattingFirst = (matchData?.toss?.tossWinner === team1?.id && matchData?.toss?.selectSide === "Bat") || (matchData?.toss?.tossWinner !== team1?.id && matchData?.toss?.selectSide !== "Bat")
        const teamTwoBattingFirst = (matchData?.toss?.tossWinner === team2?.id && matchData?.toss?.selectSide === "Bat") || (matchData?.toss?.tossWinner !== team2?.id && matchData?.toss?.selectSide !== "Bat")

        if (teamOneBattingFirst) {
            setTeam1Score({
                run: firstInningscompletedOver?.runs,
                wicket: firstInningscompletedOver?.wicket,
                over: firstInningscompletedOver?.legalBall === 6 ? matchData?.firstInnings?.Completedovers?.length : matchData?.firstInnings?.Completedovers?.length - 1,
                ball: firstInningscompletedOver?.legalBall === 6 ? 0 : firstInningscompletedOver?.legalBall
            })
        } else if (teamTwoBattingFirst) {
            setTeam2Score({
                run: firstInningscompletedOver?.runs,
                wicket: firstInningscompletedOver?.wicket,
                over: firstInningscompletedOver?.legalBall === 6 ? matchData?.firstInnings?.Completedovers?.length : matchData?.firstInnings?.Completedovers?.length - 1,
                ball: firstInningscompletedOver?.legalBall === 6 ? 0 : firstInningscompletedOver?.legalBall
            })
        }

        if (!teamOneBattingFirst) {
            setTeam1Score({
                run: secondInningscompletedOver?.runs,
                wicket: secondInningscompletedOver?.wicket,
                over: secondInningscompletedOver?.legalBall === 6 ? matchData?.secondInnings?.Completedovers?.length : matchData?.secondInnings?.Completedovers?.length - 1,
                ball: secondInningscompletedOver?.legalBall === 6 ? 0 : secondInningscompletedOver?.legalBall
            })
        } else if (!teamTwoBattingFirst) {
            setTeam2Score({
                run: secondInningscompletedOver?.runs,
                wicket: secondInningscompletedOver?.wicket,
                over: secondInningscompletedOver?.legalBall === 6 ? matchData?.secondInnings?.Completedovers?.length : matchData?.secondInnings?.Completedovers?.length - 1,
                ball: secondInningscompletedOver?.legalBall === 6 ? 0 : secondInningscompletedOver?.legalBall
            })
        }

    }, [matchData?.firstInnings, matchData?.secondInnings, team1, team2])

    useEffect(() => {
        history.pushState(null, '', router.asPath);
        window.addEventListener('popstate', function (event) {
            history.pushState(null, '', router.push('/'));
        });
    }, [])

    useEffect(() => {
        const allWickets = [
            ...(matchData?.firstInnings?.Wickets ?? []),
            ...(matchData?.secondInnings?.Wickets ?? [])
        ];

        const TestWickets = [
            ...(matchData?.firstInnings?.Wickets ?? []),
            ...(matchData?.secondInnings?.Wickets ?? []),
            ...(matchData?.superOverFirstInnings?.Wickets ?? []),
            ...(matchData?.superOverSecondInnings?.Wickets ?? []),
        ]

        const Economy = [
            ...(matchData?.firstInnings?.Completedovers ?? []),
            ...(matchData?.secondInnings?.Completedovers ?? [])
        ]

        const TestEconomy = [
            ...(matchData?.superOverFirstInnings?.Completedovers ?? []),
            ...(matchData?.superOverSecondInnings?.Completedovers ?? []),
        ]

        let winnerTeamIs = '';
        if (matchData?.matchWinner) {
            winnerTeamIs = teamData.find(item => item?.team_name === matchData?.matchWinner)
        }

        const playersWithPoints = matchPlayers.map(player => {
            const playerMVP = tournamentData?.match_type === "Test Match" ? calculateMVPPoints(player, TestWickets, TestEconomy, team1, team2, winnerTeamIs, Economy) : calculateMVPPoints(player, allWickets, Economy, team1, team2, winnerTeamIs);
            return playerMVP;
        });

        setMvpPoints(playersWithPoints);
    }, [matchPlayers, matchData]);

    return (
        type === 'mvp' ?
            <Matchstats
                currentMatch={matchData}
                mvpPoints={mvpPoints}
            />
            :
            <SummaryPage
                currentMatch={matchData}
                team1={team1}
                team1Score={team1Score}
                team2={team2}
                team2Score={team2Score}
                mvpPoints={mvpPoints}
                type={'user'}
            />
    )

}

export default Mvp