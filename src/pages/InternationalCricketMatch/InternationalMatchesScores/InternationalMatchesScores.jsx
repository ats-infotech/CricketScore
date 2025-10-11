'use client'

import { Box, Typography } from '@mui/material'
import './InternationalMatchesScores.css'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { getRecentMatches, getUpcomingMatches, getLiveMatches } from '@/redux/internationalMatchesSlices/matchesSlice.js'
import CustomeTabs from '@/components/common/commonUi/CustomeTabs.jsx'
import Image from 'next/image'
import vsLogo from '../../../assets/img/Vs1.png';
import Loader from '@/components/common/commonUi/Loader'
import CustomeButton from '@/components/common/commonUi/CustomeButton'
import { useRouter } from 'next/navigation'
import AlertToast from '@/components/common/commonUi/alertToast/AlertToast'

const matchTabs = [
    { label: 'Live', value: 0 },
    { label: 'Upcoming', value: 1 },
    { label: 'Past', value: 2 }
]

const ScoresMatchCard = ({ isTwoInnings, image, name, runs, overs, isWinner, activeTab, inningsOneRuns, inningsTwoRuns, inningsOneOvers, inningsTwoOvers }) => {
    return (
        <Box className='scores-card-team-section'>
            <Box className='scores-card-team-logo'>
                <Image unoptimized src={image} width={500} height={500} alt='logo' />
            </Box>
            <Box className={`scores-team-details ${isWinner ? 'winner' : ''}`}>
                <Typography variant='body2'>{name}</Typography>
                {activeTab !== 1 && <Typography className='scores-team-scores' variant='body2'>
                    <span className='scores-team-runs'>{isTwoInnings ? inningsOneRuns : runs || 'yet to bat'}</span>
                    {(overs || inningsOneOvers) && <span className='scores-team-over'>({isTwoInnings ? inningsOneOvers : overs})</span>}
                </Typography>}
                {activeTab !== 1 && isTwoInnings && <Typography className='scores-team-scores' variant='body2'>
                    <span className='scores-team-runs'>{inningsTwoRuns}</span>
                    <span className='scores-team-over'>({inningsTwoOvers})</span>
                </Typography>}
            </Box>
        </Box>
    )
}

const InternationalMatchesScores = () => {
    const dispatch = useDispatch()
    const { upcomingMatches, recentMatches, liveMatches } = useSelector(state => state.matchData)
    const [activeTab, setActiveTab] = useState(1)
    const [data, setDate] = useState(upcomingMatches?.data || [])
    const [loading, setLoading] = useState(false)
    const [alert, setAlert] = useState({
        open: false,
        success: false,
        message: ''
    })
    const router = useRouter()

    useEffect(() => {
        const handleApiCall = async () => {
            let liveResponse = await dispatch(getLiveMatches())
            if (liveResponse?.payload?.error) {
                setAlert({
                    open: true,
                    success: false,
                    message: liveResponse?.payload?.error
                })
            }
            let upcomingResponse = await dispatch(getUpcomingMatches())
            if (upcomingResponse?.payload?.error) {
                setAlert({
                    open: true,
                    success: false,
                    message: upcomingResponse?.payload?.error
                })
            }
            let recentResponse = await dispatch(getRecentMatches())
            if (recentResponse?.payload?.error) {
                setAlert({
                    open: true,
                    success: false,
                    message: recentResponse?.payload?.error
                })
            }
        }
        handleApiCall()
    }, [])

    useEffect(() => {
        setLoading(true)
        const liveData = Array.isArray(liveMatches?.response?.items) ? liveMatches.response?.items : [];
        const recentData = Array.isArray(recentMatches?.response?.items) ? recentMatches?.response?.items : [];
        const liveIds = liveData.map(match => match.match_id);
        const pastIds = recentData.map(match => match.match_id);
        const allIds = new Set([...liveIds, ...pastIds]);
        const tabData = Array.isArray(upcomingMatches?.response?.items) ? upcomingMatches?.response?.items?.filter(match => !allIds.has(match.match_id)) : [];
        setDate(tabData)
        if (tabData?.length > 0 && data?.length === 0) {
            setTimeout(() => {
                setLoading(false)
            }, 300);
        } else {
            setLoading(false)
        }
    }, [liveMatches, upcomingMatches, recentMatches])

    const handleTabClick = async (val) => {
        await setLoading(true)
        let tabData = []
        switch (val) {
            case 0:
                tabData = liveMatches?.response?.items
                break;
            case 1:
                const liveData = Array.isArray(liveMatches?.response?.items) ? liveMatches?.response?.items : [];
                const recentData = Array.isArray(recentMatches?.response?.items) ? recentMatches?.response?.items : [];
                const liveIds = liveData.map(match => match.match_id);
                const pastIds = recentData.map(match => match.match_id);
                const allIds = new Set([...liveIds, ...pastIds]);
                tabData = Array.isArray(upcomingMatches?.response?.items) ? upcomingMatches?.response?.items?.filter(match => !allIds.has(match.match_id)) : [];
                break;
            case 2:
                tabData = recentMatches?.response?.items
                break;
            default:
                break;
        }
        await setActiveTab(val)
        await setDate(tabData)

        setTimeout(() => {
            setLoading(false)
        }, 300);
    }

    const handleShowScoreboard = (matchDetails) => {
        router.push(`/internationalmatch/${matchDetails?.match_id}/scorecard`)
    }

    const handleAlertClose = () => {
        setAlert({
            open: false,
            success: false,
            message: ''
        })
    }

    return (
        loading ? <Loader /> : <Box className='international-matches-main-section'>
            <Box className='international-matches-tab-section'>
                <CustomeTabs data={matchTabs} onClick={handleTabClick} activeTab={activeTab} />
            </Box>
            <Box className='scores-card-main-section'>
                <Box className='scores-card-section'>
                    {
                        Array.isArray(data) && data.length > 0 && data.map((item, i) => {

                            // --- DATE ---
                            const startDateStr = item.date_start_ist || item.date_start || '';
                            const parsedDate = new Date(startDateStr);
                            const formattedDate = new Intl.DateTimeFormat('en-US', {
                                weekday: 'long',
                                month: 'long',
                                day: '2-digit',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                            }).format(parsedDate);

                            // --- TEAMS ---
                            const teamA = item.teama || {};
                            const teamB = item.teamb || {};

                            // --- TEAM A - SCORES & OVERS ---
                            const teamAScoresSplit = (teamA.scores || '').split(' & ');
                            const teamAOversSplit = (teamA.overs || '').split(' & ');
                            const teamAFirstInningsRuns = teamAScoresSplit[0] || '';
                            const teamASecondInningsRuns = teamAScoresSplit[1] || '';
                            const teamAFirstInningsOvers = teamAOversSplit[0] || '';
                            const teamASecondInningsOvers = teamAOversSplit[1] || '';
                            const teamAIsTwoInnings = teamAScoresSplit.length === 2;

                            // --- TEAM B - SCORES & OVERS ---
                            const teamBScoresSplit = (teamB.scores || '').split(' & ');
                            const teamBOversSplit = (teamB.overs || '').split(' & ');
                            const teamBFirstInningsRuns = teamBScoresSplit[0] || '';
                            const teamBSecondInningsRuns = teamBScoresSplit[1] || '';
                            const teamBFirstInningsOvers = teamBOversSplit[0] || '';
                            const teamBSecondInningsOvers = teamBOversSplit[1] || '';
                            const teamBIsTwoInnings = teamBScoresSplit.length === 2;

                            // --- WINNER LOGIC ---
                            const isTeamAWinner = Number(item.winning_team_id) === Number(teamA.team_id);
                            const isTeamBWinner = Number(item.winning_team_id) === Number(teamB.team_id);

                            // --- RESULT / STATUS ---
                            const matchResult = item.status_note || item.result || item.status_str || '';
                            const isMatchTerminated = item.status_str?.toLowerCase() === 'cancelled' || item.status_note?.toLowerCase()?.includes('abandoned');

                            // --- VENUE ---
                            const venue = item.venue?.name && item.venue?.location
                                ? `${item.venue.name}, ${item.venue.location}`
                                : '';

                            return (
                                <Box className="scores-card" key={i}>
                                    {/* MATCH RESULT OR STATUS */}
                                    {activeTab === 2 && (
                                        <Typography variant="body2" className={`scores-match-result ${isMatchTerminated ? 'terminated' : ''}`}>
                                            {matchResult}
                                        </Typography>
                                    )}

                                    {activeTab === 0 && (
                                        <Typography variant="body2" className="scores-match-result live">
                                            {item.live}
                                        </Typography>
                                    )}

                                    {/* MATCH DETAILS */}
                                    <Typography variant="body2">{item.competition?.title || 'Series'} ({item.subtitle || item.match_number || 'Match'})</Typography>
                                    <Typography variant="body2">{formattedDate}</Typography>
                                    <Typography variant="body2">{venue} | {item.format_str || 'Format'}</Typography>

                                    {/* TOSS */}
                                    {item.toss?.text && (
                                        <Typography variant="body2">{item.toss.text}</Typography>
                                    )}

                                    {/* SCOREBOARD: TEAM A vs TEAM B */}
                                    <Box className="scores-card-logo-section">
                                        <ScoresMatchCard
                                            isTwoInnings={teamAIsTwoInnings}
                                            inningsOneOvers={teamAFirstInningsOvers}
                                            inningsTwoOvers={teamASecondInningsOvers}
                                            inningsOneRuns={teamAFirstInningsRuns}
                                            inningsTwoRuns={teamASecondInningsRuns}
                                            image={teamA.logo_url}
                                            name={teamA.short_name}
                                            activeTab={activeTab}
                                            runs={teamA.scores}
                                            overs={teamA.overs}
                                            isWinner={isTeamAWinner}
                                        />

                                        <Box className="scores-vs-logo">
                                            <Image src={vsLogo} alt="vs" width={90} height={90} unoptimized />
                                        </Box>

                                        <ScoresMatchCard
                                            isTwoInnings={teamBIsTwoInnings}
                                            inningsOneOvers={teamBFirstInningsOvers}
                                            inningsTwoOvers={teamBSecondInningsOvers}
                                            inningsOneRuns={teamBFirstInningsRuns}
                                            inningsTwoRuns={teamBSecondInningsRuns}
                                            image={teamB.logo_url}
                                            name={teamB.short_name}
                                            activeTab={activeTab}
                                            runs={teamB.scores}
                                            overs={teamB.overs}
                                            isWinner={isTeamBWinner}
                                        />
                                    </Box>

                                    {/* MATCH SCOREBOARD BUTTON */}
                                    {activeTab !== 1 && (
                                        <Box sx={{ marginTop: '20px' }}>
                                            <CustomeButton
                                                title="Match Scoreboard"
                                                bgColor="var(--theme-primary)"
                                                color="var(--color-white)"
                                                width="188px"
                                                height="44px"
                                                onClick={() => handleShowScoreboard(item)}
                                            />
                                        </Box>
                                    )}
                                </Box>
                            );
                        }) || (
                            <Box>
                                <Typography sx={{ textAlign: 'center' }}>
                                    {activeTab === 0 && liveMatches?.msg === 'No Data Found.'
                                        ? 'There are no live matches at the moment. Please check back later for updates.'
                                        : activeTab === 0
                                            ? 'Live match'
                                            : activeTab === 1
                                                ? 'Upcoming match'
                                                : 'Past match'}{' '}
                                    {activeTab === 0 && liveMatches?.msg === 'No Data Found.' ? '' : 'server is temporarily down. Please try again in a little while.'}
                                </Typography>
                            </Box>
                        )
                    }
                </Box>
            </Box>
            {alert?.open && <AlertToast open={alert?.open} handleClose={handleAlertClose} message={alert?.message} success={alert?.success} />}
        </Box>
    )
}

export default InternationalMatchesScores