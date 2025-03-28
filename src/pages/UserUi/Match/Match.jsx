'use client'
import CustomeButton from '@/components/common/commonUi/CustomeButton';
import CustomeMessageBox from '@/components/common/commonUi/CustomeMessageBox';
import MatchCard from '@/components/common/commonUi/MatchCard/MatchCard';
import { breakType } from '@/components/common/json/commonJson';
import { Box, Typography } from '@mui/material';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import vsLogo from '../../../assets/img/Vs1.png';
import './Match.css';

// const TeamScoreBox = ({ teamLogo, teamName, runs, wicket, overs, superover, soruns, sowicket, soovers, letter, color }) => {
//     return (
//         <Box className='TeamScoreBox'>
//             <Box className='teamLogo'>
//                 {teamLogo && <Image src={`/${teamLogo}`} alt='logo' width={90} height={90} unoptimized />}
//                 {!teamLogo && <ImageAvatar text={letter} bgColor={color} borderRadius={'10px'} height={'100%'} width={'100%'} />}
//             </Box>
//             <Box className='team_details'>
//                 <Typography variant='body2' className='team_name'>{teamName}</Typography>
//                 <Typography variant='body2' className='team_score'>
//                     <span className='runs'>{runs} / {wicket}</span>
//                     <span className='overs'>({overs} Ov)</span>
//                 </Typography>
//                 {superover &&
//                     <Typography variant='body2' className='team_score'>
//                         <span className='runs'>{soruns} / {sowicket}</span>
//                         <span className='overs'>({soovers} Ov)</span>
//                     </Typography>
//                 }
//             </Box>
//         </Box>
//     )
// }

const tabKeys = [
    { id: 0, label: 'Live', key_name: 'live' },
    { id: 1, label: 'Upcoming', key_name: 'upcoming' },
    { id: 2, label: 'Past', key_name: 'past' },
]

const MatchPage = ({ teamData, tournamentData, matchData, tournamenId }) => {

    const [activeTab, setActiveTab] = useState(0);
    const [matches, setMatches] = useState([])
    const [animation, setAnimation] = useState(false)
    const [addMargin, setAddMargin] = useState(false)

    // const router = useRouter()

    useEffect(() => {
        if (activeTab === 0) {
            let matchesFilter = matchData.filter((item) => item?.status === 3);
            setMatches(matchesFilter || [])
        }
    }, [matchData]);

    useEffect(() => {
        const tabElement = document.getElementById("tab-list");
        const pageTabElement = document.getElementById("user-sub-tab");

        if (!tabElement || !pageTabElement) return;

        const handleScroll = () => {
            const tabTop = tabElement.getBoundingClientRect().top;

            if (tabTop <= 0) {
                if (tabElement.classList.contains("sticky-tab-list")) {
                    setAddMargin(tabTop <= 0)
                    pageTabElement.classList.add("userSubTab");
                    pageTabElement.style.top = tabElement.offsetHeight + 'px'
                }
            } else {
                setAddMargin(tabTop <= 0)
                pageTabElement.classList.remove("userSubTab");
                pageTabElement.style = ''
            }
        };

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    const handleTabClick = (val) => {
        setAnimation(true)
        let matchesFilter;
        switch (val) {
            case 0:
                matchesFilter = matchData.filter((item) => item?.status === 3);
                break;
            case 1:
                matchesFilter = matchData.filter((item) => item?.status === 1 || item?.status === 2);
                break;
            case 2:
                matchesFilter = matchData.filter((item) => item?.status === 4);
                break;

            default:
                break;
        }
        setMatches(matchesFilter || [])
        setActiveTab(val)
        let timer = setTimeout(() => setAnimation(false), 500);
        return clearTimeout(timer)
    }

    // const formatDate = (date) => {
    //     return new Date(date).toLocaleString("en-US", {
    //         weekday: "long",
    //         year: "numeric",
    //         month: "long",
    //         day: "numeric",
    //         hour: "2-digit",
    //         minute: "2-digit",
    //         hour12: true,
    //     });
    // };

    // const getWinnerMessage = (item) => {
    //     let winner;
    //     if (item?.matchWinner === item?.superOverSecondInnings?.battingside && item?.currentInnings === 4) {
    //         const balls = item?.superOverSecondInnings?.Currentover?.[0].legalBall || 0;
    //         const winningballs = 6 - balls;
    //         winner = `${item?.matchWinner} won superover (${winningballs} balls left)`;
    //     } else if (item?.matchWinner !== item?.superOverSecondInnings?.battingside && item?.currentInnings === 4) {
    //         const winningruns = item?.superOverFirstInnings?.Currentover?.[0]?.runs - item?.superOverSecondInnings?.Currentover?.[0]?.runs;
    //         winner = `${item?.matchWinner} won superover by ${winningruns} runs`;
    //     } else if (item?.matchWinner === item?.secondInnings?.battingside && item?.currentInnings === 2) {
    //         const balls = item?.secondInnings?.Currentover?.[0].legalBall === 6 ? 0 : item?.secondInnings?.Currentover?.[0].legalBall || 0;
    //         const overs = item?.secondInnings?.Currentover?.[0].legalBall === 6 ? item?.secondInnings?.Completedovers?.length : item?.secondInnings?.Completedovers?.length - 1;
    //         const totalovers = parseInt(item?.totalovers) - overs;
    //         const winningballs = totalovers === 0 ? 0 : (totalovers * 6) - balls;
    //         const totalWickets = parseInt(item?.perteamplayers) - item?.secondInnings?.Currentover?.[0]?.wicket;
    //         winner = `${item?.matchWinner} won by ${totalWickets} wickets (${winningballs} balls left)`;
    //     } else if (item?.matchWinner !== item?.secondInnings?.battingside && item?.currentInnings === 2) {
    //         const winningruns = item?.firstInnings?.Currentover?.[0]?.runs - item?.secondInnings?.Currentover?.[0]?.runs;
    //         winner = `${item?.matchWinner} won by ${winningruns} runs`;
    //     } else {
    //         winner = 'Match Tied';
    //     }
    //     return winner;
    // };

    return (
        <Box className='activeAnimation'>
            <Box className='matchOption' id='user-sub-tab'>
                {
                    tabKeys.map((field, index) => (
                        <Box
                            key={index}
                            className={`Details ${activeTab === field.id ? 'active' : ' '}`}
                            onClick={() => handleTabClick(field.id)}
                        >
                            <h2 className='matchText'>{field.label}</h2>
                        </Box>
                    ))
                }
            </Box>

            <Box className='match_list_main_section' sx={{ marginTop: addMargin ? '14px' : '0' }}>
                    <MatchCard
                        matches={matches}
                        animation={animation}
                        tournamentData={tournamentData}
                        activeTab={activeTab}
                        isAdmin={false}
                    />
                    {
                        matches.length <= 0 &&
                        <Box className='user_message_box'>
                            <CustomeMessageBox icon='batsman2' title='Match Guide'
                                describe='Quickly start or schedule matches with ease. Get personalized suggestions based on your preferences'
                            />
                        </Box>
                    }
                {/* <Box className='match_list_sub_section'>
                    {
                        matches.length > 0 && matches.sort((a, b) => new Date(b?.datetime || b?.match_start_time) - new Date(a?.datetime || a?.match_start_time))
                            .map((item, i) => {
                                const formattedDate = formatDate(item?.datetime || item?.match_start_time);
                                const winner = getWinnerMessage(item);
                                let team1_logo = item?.team1?.team_logo;
                                let team1_name = item?.team1?.team_name;
                                let team1_letter = item?.team1?.letter;
                                let team1_color = item?.team1?.team_color;
                                let team2_logo = item?.team2?.team_logo;
                                let team2_name = item?.team2?.team_name;
                                let team2_letter = item?.team2?.letter;
                                let team2_color = item?.team2?.team_color;
                                let tossWinner = item?.toss?.tossWinner === item?.team1?.id ? team1_name : item?.toss?.tossWinner === item?.team2?.id ? team2_name : ''
                                let firstInnings = item?.firstInnings?.Currentover[0];
                                let secondInnings = item?.status !== 4 ? item?.secondInnings?.Currentover[0] : item?.secondInnings?.Completedovers?.slice(-1)[0];
                                let superover = item?.currentInnings === 3 || item?.currentInnings === 4;
                                let thirdInnings = item?.superOverFirstInnings?.Currentover[0];
                                let fourthInnings = item?.superOverSecondInnings?.Currentover[0];
                                let firstInningsCompletedOver = item?.firstInnings?.Completedovers?.length;
                                let secondInningsCompletedOver = item?.secondInnings?.Completedovers?.length;
                                let team1 = item?.team1, team2 = item?.team2;
                                let FirstInningsbatting = item?.firstInnings?.battingside === team1?.team_name;
                                let secondInningsBattingSide = item?.secondInnings?.battingside === team1?.team_name;
                                let thirdInningsBattingSide = item?.superOverFirstInnings?.battingside === team1?.team_name;
                                let fourthInningsBattingSide = item?.superOverSecondInnings?.battingside === team1?.team_name;
                                let matchwon = item?.matchWinner

                                let getInningsStats = (innings, battingSide, completedOvers, isSuperOver = false, currentInnings) => {
                                    if (!innings) return { runs: 0, wicket: 0, ball: 0, over: 0 };

                                    let currentPlayingInnings = item?.currentInnings === currentInnings
                                    let runs = innings?.runs || 0;
                                    let wicket = innings?.wicket || 0;
                                    let ball = innings?.legalBall === 6 ? 0 : innings?.legalBall || 0;
                                    let overno = (currentInnings === 2 || currentInnings === 1) && (matchwon || item?.status === 4) && innings?.legalBall === 6 ? completedOvers
                                        : (currentInnings === 2 || currentInnings === 1) && innings?.legalBall !== 6 && (matchwon || item?.status === 4) ? completedOvers - 1
                                            : (completedOvers > 0 || !completedOvers) && innings?.legalBall === 6 && currentPlayingInnings ? completedOvers + 1 || 1
                                                : completedOvers > 0 && innings?.legalBall !== 6 && currentPlayingInnings ? completedOvers : completedOvers ? completedOvers
                                                    : 0;
                                    let over = isSuperOver && innings?.legalBall === 6 ? `1.0` : `${overno}.${ball}`;

                                    return { runs, wicket, ball, over };
                                };

                                let team1Stats = item?.status <= 2 ? getInningsStats(0)
                                    : FirstInningsbatting ? getInningsStats(firstInnings, FirstInningsbatting, firstInningsCompletedOver, false, 1)
                                        : secondInningsBattingSide && getInningsStats(secondInnings, secondInningsBattingSide, secondInningsCompletedOver, false, 2);

                                let team2Stats = item?.status <= 2 ? getInningsStats(0)
                                    : !FirstInningsbatting ? getInningsStats(firstInnings, !FirstInningsbatting, firstInningsCompletedOver, false, 1)
                                        : !secondInningsBattingSide && getInningsStats(secondInnings, !secondInningsBattingSide, secondInningsCompletedOver, false, 2);

                                let team1_soStats = !fourthInningsBattingSide && !thirdInningsBattingSide ? getInningsStats(0)
                                    : thirdInningsBattingSide ? getInningsStats(thirdInnings, thirdInningsBattingSide, 0, true, 3)
                                        : fourthInningsBattingSide && getInningsStats(fourthInnings, fourthInningsBattingSide, 0, true, 4);

                                let team2_soStats = !thirdInningsBattingSide ? getInningsStats(thirdInnings, !thirdInningsBattingSide, 0, true, 3)
                                    : !fourthInningsBattingSide && getInningsStats(fourthInnings, !fourthInningsBattingSide, 0, true, 4);

                                let overs = item?.totalovers || item?.numberOfOvers || '';
                                let matchLocation = `${tournamentData?.ground}, ${tournamentData?.city} ${tournamentData?.match_type === "Test Match" ? '' : `| ${overs ?? 0} Ov.`}`
                                let matchType = `${tournamentData?.tournament_format} Matches`
                                let isStumps = item?.stumps !== undefined && item?.stumps === 0 ? true : false
                                let isBreakStart = breakType?.find(type => type?.key_name === item?.breaktype)?.title || ''
                                return (
                                    <Box className={`user_match_card ${animation ? 'activeAnimation' : ''}`} key={i} onClick={
                                        item?.status === 4 ? () => router.push(`/match/${item?.id}/summary`) : item?.status !== 1 && item?.status !== 2 ? () => router.push(`/match/${item?.id}/live`) : undefined}>
                                        <Box className='match_info_section'>
                                            <Typography variant='h6'>{matchType}</Typography>
                                            <Typography sx={{ marginBlock: '5px' }} variant='body2' >{formattedDate}</Typography>
                                            <Typography variant='body2' >{matchLocation}</Typography>
                                            {item?.status > 2 && <Typography variant='body2' sx={{ marginBlock: '5px' }}>{`${tossWinner} won the toss and decided to ${item?.toss?.selectSide}`}</Typography>}
                                            {isStumps && <Typography variant='body2'>Stumps</Typography>}
                                            {item?.status === 4 && <Typography variant='body2' sx={{ marginBlock: '5px' }} className={`${item?.matchWinner ? 'winner' : 'tied'}`}>{item?.matchWinner ? `${winner}` : 'Match Tied'}</Typography>}
                                            {isBreakStart && <Typography variant='body2' className='break'>{isBreakStart}</Typography>}
                                        </Box>
                                        <Box className='match_team_info_section'>
                                            <TeamScoreBox
                                                teamLogo={team1_logo}
                                                teamName={team1_name}
                                                runs={team1Stats.runs ?? 0}
                                                wicket={team1Stats.wicket ?? 0}
                                                overs={team1Stats.over ?? 0}
                                                superover={superover}
                                                soruns={team1_soStats.runs ?? 0}
                                                sowicket={team1_soStats.wicket ?? 0}
                                                soovers={team1_soStats.over ?? 0}
                                                letter={team1_letter}
                                                color={team1_color}
                                            />
                                            <Box className='teamVsLogo'>
                                                <Image src={vsLogo} alt='logo' width={90} height={90} unoptimized />
                                            </Box>
                                            <TeamScoreBox
                                                teamLogo={team2_logo}
                                                teamName={team2_name}
                                                runs={team2Stats.runs ?? 0}
                                                wicket={team2Stats.wicket ?? 0}
                                                overs={team2Stats.over ?? 0}
                                                superover={superover}
                                                soruns={team2_soStats.runs ?? 0}
                                                sowicket={team2_soStats.wicket ?? 0}
                                                soovers={team2_soStats.over ?? 0}
                                                letter={team2_letter}
                                                color={team2_color}
                                            />
                                        </Box>
                                        {item?.status !== 1 && item?.status !== 2 && <Box className='match_button'>
                                            <CustomeButton
                                                title={"Show Match"}
                                                bgColor={'var(--primary-color)'}
                                                color={'var(--text-white)'}
                                                width={'188px'}
                                                height={'44px'}
                                            />
                                        </Box>}
                                    </Box>
                                )
                            })
                    }
                </Box> */}
            </Box>

        </Box>
    )

}

export default MatchPage