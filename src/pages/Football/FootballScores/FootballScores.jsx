'use client'
import CustomeTabs from '@/components/common/commonUi/CustomeTabs'
import { getLiveFootballMatches, getPastFootballMatches, getUpcomingFootballMatches } from '@/redux/footballMatchesSlices/footballSlice'
import { Box, Button, Typography } from '@mui/material'
import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import './FootballScores.css'
import SvgIcon from '@/assets/icons/SvgIcon'
import Image from 'next/image'
import vsLogo from '../../../assets/img/Vsshadow.png';
import dummyTeamLogo from '../../../assets/img/dummyTeam.png';
import { useRouter } from 'next/navigation'

const matchTabs = [
    { label: 'Live', value: 0 },
    { label: 'Upcoming', value: 1 },
    { label: 'Past', value: 2 }
]

function convertToLocalTime(utcTime) {
    const matchDate = new Date(utcTime);
    return new Intl.DateTimeFormat('en-US', {
        // weekday: 'long',
        // year: 'numeric',
        // month: 'long',   
        // day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        // second: '2-digit',
        hour12: true,
    }).format(matchDate);
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
            <Image src={imgSrc} width={100} height={100} alt='logo' onError={() => setImgSrc(dummyTeamLogo.src)} />
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

const FootballScores = () => {
    const { upcomingFootballMatches, pastFootballMatches, liveFootballMatches } = useSelector(state => state.footballData)
    const [activeTab, setActiveTab] = useState(1)
    const keys = activeTab === 2 ? Object.keys(pastFootballMatches) : Object.keys(upcomingFootballMatches);
    const [selectedIndex, setSelectedIndex] = useState(keys.indexOf(keys[0]));
    const [openFilter, setOpenFilter] = useState(false)
    const [selectedLeague, setSelectedLeague] = useState('')
    const [data, setData] = useState(upcomingFootballMatches || [])
    const selectedDate = keys[selectedIndex];
    const dispatch = useDispatch()
    const router = useRouter()
    const imageBaseUrl = process.env.NEXT_PUBLIC_FOOTBALL_IMAGE_BASE_URL
    const rawMatches = activeTab === 0 ? data : Array.isArray(data[selectedDate]) ? data[selectedDate] : [];
    const groupedByLeague = Array.isArray(rawMatches)
        ? rawMatches.reduce((acc, match) => {
            const league = match?.league_name;

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
        dispatch(getUpcomingFootballMatches())
        dispatch(getPastFootballMatches())
        dispatch(getLiveFootballMatches())
    }, [])

    const handleTabClick = (val) => {
        setActiveTab(val)
        let currentMatches = []
        switch (val) {
            case 0:
                currentMatches = liveFootballMatches
                break;
            case 1:
                currentMatches = upcomingFootballMatches
                break;
            case 2:
                currentMatches = pastFootballMatches
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
        router.push(`/footballmatch/${data?.id}/summary`)
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
                {activeTab !== 0 && <Box className={`football-date-svg ${selectedDate === keys?.[6] ? 'disable' : ''}`} onClick={handleRightClick}>
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
            <Box className='football-filter-clear'>
                <Typography variant='body2' onClick={() => setSelectedLeague('')} >Clear</Typography>
            </Box>
            <Box className='international-matches-tab-section'>
                <CustomeTabs data={matchTabs} onClick={handleTabClick} activeTab={activeTab} />
            </Box>
            <Box>
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
                                                const isVisible = match?.league_name?.toString() === selectedLeague.toString() || selectedLeague === '';
                                                const isLastVisibleItem =
                                                    items
                                                        .filter(m => m?.league_name?.toString() === selectedLeague.toString() || selectedLeague === '')
                                                        .length - 1 ===
                                                    items
                                                        .filter(m => m?.league_name?.toString() === selectedLeague.toString() || selectedLeague === '')
                                                        .findIndex((m, index) => items[index] === match);
                                                const homeTeamWin = activeTab === 1 ? false : match?.home_team_score?.display > match?.away_team_score?.display
                                                const awayTeamWin = activeTab === 1 ? false : match?.home_team_score?.display < match?.away_team_score?.display

                                                return (
                                                    isVisible && (
                                                        <Box key={i} className='football-match-card'>
                                                            <Box className='football-match-time'>
                                                                <Typography variant='body2'>
                                                                    {match?.arena_name ? `${match?.arena_name} | ` : ''}
                                                                    {convertToLocalTime(match?.start_time)}
                                                                </Typography>
                                                            </Box>

                                                            <Box className='football-match-team-main-section'>
                                                                <TeamSection name={match?.home_team_name} image={`${imageBaseUrl}${match?.home_team_hash_image}.png`} />
                                                                <Box className={activeTab === 1 ? `football-match-card-vs-section` : 'football-match-card-scores-section'}>
                                                                    {activeTab === 1 && <Image src={vsLogo} height={100} width={100} alt='vs' />}
                                                                    {activeTab !== 1 && <Typography variant='body2'>
                                                                        <span className={awayTeamWin ? 'teamLose' : ''}>{match?.home_team_score?.display} </span>-
                                                                        <span className={homeTeamWin ? 'teamLose' : ''}> {match?.away_team_score?.display}</span>
                                                                        {/* {`${match?.home_team_score?.display} - ${match?.away_team_score?.display}`} */}
                                                                    </Typography>}
                                                                </Box>
                                                                <TeamSection type='away' name={match?.away_team_name} image={`${imageBaseUrl}${match?.away_team_hash_image}.png`} />
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