'use client'
import SvgIcon from '@/assets/icons/SvgIcon'
import CustomeTabs from '@/components/common/commonUi/CustomeTabs'
import { getEnglandAndFranceFootballleaguees, getEnglandAndFranceFootballLeagueLiveMatches, getEnglandAndFranceFootballLeaguePastMatches, getEnglandAndFranceFootballLeagueUpcomingMatches, getLiveFootballMatches, getPastFootballMatches, getPremiumFootballLeagueLiveMatches, getPremiumFootballLeaguePastMatches, getPremiumFootballleagues, getPremiumFootballLeagueUpcomingMatches, getUpcomingFootballMatches } from '@/redux/footballMatchesSlices/footballSlice'
import { Box, Button, Typography } from '@mui/material'
import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import vsLogo from '../../../assets/img/Vsshadow.png'
import dummyTeamLogo from '../../../assets/img/dummyTeam.png'
import FootballLeagueCard from '../FootballLeagueCard/FootballLeagueCard'
import './FootballScores.css'
import { removeSelectedFootballLeague, SelectedFootballLeague } from '@/redux/footballMatchesSlices/footballLocalSlice'

const matchTabs = [
    { label: 'Live', value: 0 },
    { label: 'Upcoming', value: 1 },
    { label: 'Past', value: 2 }
]

function convertToLocalTime(utcTime) {
    const matchDate = new Date(utcTime);
    return new Intl.DateTimeFormat('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    }).format(matchDate);
}

function convertTo12Hour(time24) {
    let [hour, minute] = time24.split(':').map(Number);
    const ampm = hour >= 12 ? 'PM' : 'AM';

    // Convert hour to 12-hour format
    hour = hour % 12;
    hour = hour === 0 ? 12 : hour;

    return `${hour}:${minute.toString().padStart(2, '0')} ${ampm}`;
}

const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date)) {
        return 'Invalid date';
    }
    const options = { weekday: 'long', month: 'short', day: 'numeric' };
    const formattedDate = new Intl.DateTimeFormat('en-US', options).format(date);
    return formattedDate;
};

const TeamSection = ({ name, image, type }) => {
    const [imgSrc, setImgSrc] = useState(image)
    return (
        <Box className={`football-match-team-details ${type}`}>
            <Typography variant='body2'>{name}</Typography>
            {imgSrc && <Image src={imgSrc} width={100} height={100} alt='logo' onError={() => setImgSrc(dummyTeamLogo.src)} />}
        </Box>
    )
}

const LeagueName = ({ name, selected, onClick }) => {
    const textRef = useRef(null);
    const [isOverflowing, setIsOverflowing] = useState(false);

    useEffect(() => {
        const el = textRef.current;
        if (!el) return;

        const checkOverflow = () => {
            setIsOverflowing(el.scrollWidth > el.clientWidth);
        };

        checkOverflow();

        const resizeObserver = new ResizeObserver(checkOverflow);
        resizeObserver.observe(el);

        return () => resizeObserver.disconnect();
    }, [name, selected]);

    return (
        <Box
            className={`football-league-names ${selected ? 'active' : ''}`}
            onClick={() => onClick(name)}
        >
            <Typography
                variant='body2'
                ref={textRef}
                className={isOverflowing ? 'overflow-fade' : ''}
            >
                {name}
            </Typography>
        </Box>
    );
};

function getScore(goals = []) {
    let homeGoals = 0;
    let awayGoals = 0;

    for (const goal of goals) {
        if (goal.info === 'home') {
            homeGoals += 1;
        } else if (goal.info === 'away') {
            awayGoals += 1;
        }
    }

    return { homeGoals, awayGoals };
}

const FootballScores = () => {
    const { upcomingFootballMatches, pastFootballMatches, liveFootballMatches, englandAndFranceUpcomingMatches, englandAndFrancePastMatches, englandAndFranceLiveMatches, premiumLeaguesData, premiumLeaguesUpcomingMatches, premiumLeaguesPastMatches } = useSelector(state => state.footballData)
    const params = useParams()
    const isExtraLeague = params?.id ? true : false
    const isPremiumLeague = premiumLeaguesData?.result?.some((items) => items?.league_key === parseInt(params?.id))
    const [activeTab, setActiveTab] = useState(1)
    const keys = isPremiumLeague && (activeTab === 1 || activeTab === 0) ? Object.keys(premiumLeaguesUpcomingMatches) : isPremiumLeague && activeTab === 2 ? Object.keys(premiumLeaguesPastMatches) : isExtraLeague && (activeTab === 1 || activeTab === 0) ? Object.keys(englandAndFranceUpcomingMatches) : isExtraLeague && activeTab === 2 ? Object.keys(englandAndFrancePastMatches) : activeTab === 2 ? Object.keys(pastFootballMatches) : Object.keys(upcomingFootballMatches);
    const [selectedIndex, setSelectedIndex] = useState(keys.indexOf(keys[0]));
    const [openFilter, setOpenFilter] = useState(false)
    const [selectedLeague, setSelectedLeague] = useState('')
    const [data, setData] = useState(upcomingFootballMatches || [])
    const selectedDate = keys[selectedIndex];
    const dispatch = useDispatch()
    const router = useRouter()

    useEffect(() => {
        if (isPremiumLeague && activeTab === 1) {
            setData(premiumLeaguesUpcomingMatches)
            setSelectedIndex(keys.indexOf(keys[0]))
        } else if (isExtraLeague && activeTab === 1) {
            setData(englandAndFranceUpcomingMatches)
            setSelectedIndex(keys.indexOf(keys[0]))
        } else {
            setData(upcomingFootballMatches)
            setSelectedIndex(keys.indexOf(keys[0]))
        }
    }, [englandAndFranceUpcomingMatches, premiumLeaguesUpcomingMatches, upcomingFootballMatches])

    const premiumLeagueRawMatches = activeTab === 0 ? data?.result : data[selectedDate] && activeTab === 1 ? data[selectedDate]?.result?.filter((items) => items?.event_status === 'Not Started' || items?.event_status === '') : data[selectedDate] && activeTab === 2 ? data[selectedDate]?.result?.filter((items) => items?.event_status === 'Finished') : [];
    const extraLeagueRawMatches = !isExtraLeague ? [] : activeTab === 0 ? data
        : data[selectedDate] && activeTab === 2 ? data[selectedDate]?.filter((items) => items?.match_status === 'Finished')
            : data[selectedDate] && activeTab === 1 ? data[selectedDate]?.filter((items) => items?.match_status !== 'Finished') : [];
    const rawMatches = isPremiumLeague ? premiumLeagueRawMatches : isExtraLeague ? extraLeagueRawMatches : activeTab === 0 ? data?.response : data[selectedDate] ? data[selectedDate]?.response : [];

    const groupedByLeague = Array.isArray(rawMatches)
        ? rawMatches.reduce((acc, match) => {
            const league = isExtraLeague ? match?.league_name : match?.league?.name;
            if (league) {
                if (!acc[league]) {
                    acc[league] = [];
                }
                acc[league].push(match);
            }
            return acc;
        }, {})
        : {};
    const leagueKeys = Object?.keys(groupedByLeague ? groupedByLeague : {})

    useEffect(() => {
        if (!isExtraLeague) {
            dispatch(getUpcomingFootballMatches())
            dispatch(getPastFootballMatches())
            dispatch(getLiveFootballMatches())
        }
        dispatch(getPremiumFootballleagues())
        dispatch(getEnglandAndFranceFootballleaguees())
    }, [])

    useEffect(() => {
        if (premiumLeaguesData) {
            if (params?.id && isPremiumLeague === false) {
                dispatch(getEnglandAndFranceFootballLeagueUpcomingMatches(params?.id));
                dispatch(getEnglandAndFranceFootballLeaguePastMatches(params?.id));
                dispatch(getEnglandAndFranceFootballLeagueLiveMatches(params?.id));
            } else if (params?.id && isPremiumLeague === true) {
                dispatch(getPremiumFootballLeagueUpcomingMatches(params?.id))
                dispatch(getPremiumFootballLeaguePastMatches(params?.id))
                dispatch(getPremiumFootballLeagueLiveMatches(params?.id))
            }
        }
    }, [premiumLeaguesData])

    const handleTabClick = (val) => {
        setActiveTab(val)
        let currentMatches = []
        switch (val) {
            case 0:
                currentMatches = isPremiumLeague ? premiumLeaguesUpcomingMatches : isExtraLeague ? englandAndFranceLiveMatches : liveFootballMatches
                break;
            case 1:
                currentMatches = isPremiumLeague ? premiumLeaguesUpcomingMatches : isExtraLeague ? englandAndFranceUpcomingMatches : upcomingFootballMatches
                break;
            case 2:
                currentMatches = isPremiumLeague ? premiumLeaguesPastMatches : isExtraLeague ? englandAndFrancePastMatches : pastFootballMatches
                break
            default:
                break;
        }
        setData(currentMatches)
        setSelectedLeague('')
        setSelectedIndex(keys.indexOf(keys[0]))
    }

    const handleLeftClick = () => {
        if (selectedIndex > 0) {
            setSelectedIndex(selectedIndex - 1);
        }
    };

    const handleRightClick = () => {
        if (selectedIndex < keys.length - 1) {
            setSelectedIndex(selectedIndex + 1);
        }
    };

    const handleSelectedLeague = (league) => {
        setSelectedLeague(league)
        setOpenFilter(false)
    }

    const handleNavigation = (data) => {
        dispatch(removeSelectedFootballLeague())
        if (isPremiumLeague) {
            dispatch(SelectedFootballLeague('PremiumLeague'))
            router.push(`/footballmatch/${data?.event_key}/summary`)
        } else if (isExtraLeague) {
            dispatch(SelectedFootballLeague('ExtraLeague'))
            router.push(`/footballmatch/${data?.match_id}/summary`)
        } else {
            router.push(`/footballmatch/${data?.fixture?.id}/summary`)
        }
    }

    return (
        <Box className='football-scores-main-section'>
            <Box className={`football-date-section ${openFilter ? 'open' : ''}`}>
                {activeTab !== 0 && <Box className={`football-date-svg ${selectedDate === keys?.[0] ? 'disable' : ''}`} onClick={handleLeftClick}>
                    <SvgIcon className='football-date-left' id={'down-arrow'} />
                </Box>}
                <Box className='football-selected-date'>
                    <Typography variant='body2'>{selectedDate ? formatDate(selectedDate) : ''}</Typography>
                </Box>
                {activeTab !== 0 && <Box className={`football-date-svg ${selectedDate === keys?.[activeTab === 2 && !isExtraLeague && !isPremiumLeague ? 1 : 6] ? 'disable' : ''}`} onClick={handleRightClick}>
                    <SvgIcon className='football-date-right' id={'down-arrow'} />
                </Box>}
            </Box>
            <Box className='football-match-filter'>
                {
                    leagueKeys?.length > 0 && leagueKeys?.map((items, i) => {
                        return (
                            <LeagueName
                                key={i}
                                name={items}
                                selected={selectedLeague === items}
                                onClick={handleSelectedLeague}
                            />
                        )
                    })
                }
            </Box>
            {!isExtraLeague && <FootballLeagueCard />}
            <Box className='football-filter-clear'>
                <Typography variant='body2' onClick={() => setSelectedLeague('')} >Clear</Typography>
            </Box>
            <Box className='international-matches-tab-section'>
                <CustomeTabs data={matchTabs} onClick={handleTabClick} activeTab={activeTab} />
            </Box>
            <Box>
                {Object.keys(groupedByLeague || {}).length === 0 && (
                    <Box sx={{ textAlign: 'center', padding: '20px' }}>
                        <Typography variant='body2'>No match available for {selectedDate ? formatDate(selectedDate) : 'this date'} at this moment</Typography>
                    </Box>
                )}
                {
                    groupedByLeague && Object.entries(groupedByLeague)?.map(([title, items]) => {
                        return (
                            <Box key={title}>
                                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                    {(selectedLeague === title || selectedLeague === '') && <Box className='football-league-title'>
                                        <Typography variant='body2'>{title}</Typography>
                                    </Box>}
                                </Box>
                                <Box className="matches-wrapper">
                                    {(selectedLeague === title || selectedLeague === '') && <Box className='football-matches-section'>
                                        {items?.length > 0 &&
                                            items?.map((match, i) => {
                                                const isVisible = isExtraLeague ? match?.league_name : match?.league?.name?.toString() === selectedLeague.toString() || selectedLeague === '';
                                                const isLastVisibleItem =
                                                    items
                                                        .filter(m => m?.league?.name?.toString() === selectedLeague.toString() || selectedLeague === '')
                                                        .length - 1 ===
                                                    items
                                                        .filter(m => m?.league?.name?.toString() === selectedLeague.toString() || selectedLeague === '')
                                                        .findIndex((m, index) => items[index] === match);
                                                const goalScoreForPremiumLeague = getScore(match?.goalscorers || [])
                                                const premiumLeagueHomeTeamWin = activeTab === 1 ? false : goalScoreForPremiumLeague?.homeGoals > goalScoreForPremiumLeague?.awayGoals
                                                const premiumLeagueAwayTeamWin = activeTab === 1 ? false : goalScoreForPremiumLeague?.homeGoals < goalScoreForPremiumLeague?.awayGoals
                                                const extraLeagueHomeTeamWin = activeTab === 1 ? false : match?.match_hometeam_score > match?.match_awayteam_score
                                                const extraLeagueAwayTeamWin = activeTab === 1 ? false : match?.match_hometeam_score < match?.match_awayteam_score
                                                const homeTeamWin = isPremiumLeague ? premiumLeagueHomeTeamWin : isExtraLeague ? extraLeagueHomeTeamWin : activeTab === 1 ? false : match?.goals
                                                    ?.home > match?.goals?.away
                                                const awayTeamWin = isPremiumLeague ? premiumLeagueAwayTeamWin : isExtraLeague ? extraLeagueAwayTeamWin : activeTab === 1 ? false : match?.goals
                                                    ?.home < match?.goals?.away

                                                return (
                                                    isVisible && (
                                                        <Box key={i} className='football-match-card'>
                                                            <Box className='football-match-time'>
                                                                <Typography variant='body2'>
                                                                    {isPremiumLeague && match?.event_stadium ? `${match?.event_stadium}, ${match?.country_name} | ` : isExtraLeague && match?.match_stadium ? `${match?.match_stadium}, ${match?.country_name} | ` : match?.fixture?.venue?.name ? `${match?.fixture?.venue?.name}, ${match?.fixture?.venue?.city} | ` : ''}
                                                                    {isPremiumLeague ? `${match?.event_date}, ${convertTo12Hour(match?.event_time)}` : isExtraLeague ? `${match?.match_date}, ${convertTo12Hour(match?.match_time)}` : convertToLocalTime(match?.fixture?.date)}
                                                                </Typography>
                                                            </Box>

                                                            <Box className='football-match-team-main-section'>
                                                                <TeamSection name={isPremiumLeague ? match?.event_home_team : isExtraLeague ? match?.match_hometeam_name : match?.teams?.home?.name} image={isPremiumLeague ? match?.home_team_logo : isExtraLeague ? match?.team_home_badge : match?.teams?.home?.logo} />
                                                                <Box className={activeTab === 1 ? `football-match-card-vs-section` : 'football-match-card-scores-section'}>
                                                                    {activeTab === 1 && vsLogo && <Image src={vsLogo} height={100} width={100} alt='vs' />}
                                                                    {activeTab !== 1 && <Typography variant='body2'>
                                                                        <span className={awayTeamWin ? 'teamLose' : ''}>{isPremiumLeague ? goalScoreForPremiumLeague?.homeGoals : isExtraLeague ? match?.match_hometeam_score || 0 : match?.goals?.home} </span>-
                                                                        <span className={homeTeamWin ? 'teamLose' : ''}> {isPremiumLeague ? goalScoreForPremiumLeague?.awayGoals : isExtraLeague ? match?.match_awayteam_score || 0 : match?.goals?.away}</span>
                                                                    </Typography>}
                                                                </Box>
                                                                <TeamSection type='away' name={isPremiumLeague ? match?.event_away_team : isExtraLeague ? match?.match_awayteam_name : match?.teams?.away?.name} image={isPremiumLeague ? match?.away_team_logo : isExtraLeague ? match?.team_away_badge : match?.teams?.away?.logo} />
                                                            </Box>
                                                            {activeTab !== 1 && <Box className='football-match-summary-button'>
                                                                <Button onClick={() => handleNavigation(match)} >Summary</Button>
                                                            </Box>}

                                                            {!isLastVisibleItem && <Box className='football-match-card-gradient-line'></Box>}
                                                        </Box>
                                                    )
                                                );
                                            })}

                                    </Box>}
                                    {(selectedLeague === title || selectedLeague === '') && <Box className="left-curved-edge"></Box>}
                                    {(selectedLeague === title || selectedLeague === '') && <Box className="right-curved-edge"></Box>}
                                </Box>
                            </Box>
                        )
                    })
                }
            </Box>
        </Box>
    )
}

export default FootballScores