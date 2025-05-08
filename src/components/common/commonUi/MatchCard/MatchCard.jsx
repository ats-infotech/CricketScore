'use client'
import { teamsState } from '@/redux/slices/teamSlice';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Box, IconButton, Menu, MenuItem, Typography } from "@mui/material";
import Image from "next/image";
import { useRouter } from 'next/navigation';
import React from "react";
import { useSelector } from 'react-redux';
import vsLogo from '../../../../assets/img/Vs1.png';
import { breakType, TestBreakType } from "../../json/commonJson";
import CustomeButton from '../CustomeButton';
import ImageAvatar from '../ImageAvatar/ImageAvatar';
import './MatchCard.css';

const TeamScoreBox = React.memo(({ teamLogo, teamName, runs, wicket, overs, superover, soruns, sowicket, soovers, letter, color, scorehidden, Innings1Declare, Innings2Declare, teamWon }) => {
    return (
        <Box className='TeamScoreBox'>
            <Box className='teamLogo'>
                {teamLogo && <Image src={`/${teamLogo}`} alt='logo' width={90} height={90} unoptimized />}
                {!teamLogo && <ImageAvatar text={letter} bgColor={color} borderRadius={'10px'} height={'100%'} width={'100%'} />}
            </Box>
            <Box className='team_details'>
                <Typography variant='body2' className={`team_name ${teamWon && 'winningTeam'}`}>{teamName}</Typography>
                <Typography variant='body2' className={`team_score ${teamWon && 'winningTeam'}`}>
                    <span className='runs'>{runs} / {wicket} {Innings1Declare && '- d'}</span>
                    <span className='overs'>({overs} Ov)</span>
                </Typography>
                {superover && !scorehidden &&
                    <Typography variant='body2' className={`team_score ${teamWon && 'winningTeam'}`}>
                        <span className='runs'>{soruns} / {sowicket} {Innings2Declare && '- d'}</span>
                        <span className='overs'>({soovers} Ov)</span>
                    </Typography>
                }
            </Box>
        </Box>
    )
})

const MatchCard = (props) => {
    const {
        matches,
        isPastTournament,
        tournamentData,
        activeTab,
        anchorEl,
        handleClosed,
        handleStartMatch,
        handleMenuItemClick,
        handleMenuClick,
        isAdmin
    } = props

    const team_data = useSelector(teamsState)
    const router = useRouter()
    const isTestMatch = tournamentData?.match_type === "Test Match" ? true : false

    const getMatchButtonTitle = () => {
        let obj = {
            0: 'Resume Match',
            1: 'Start Match',
            2: 'Show Stats',
        }
        return obj[activeTab]
    }

    const formatDate = (date) => {
        return new Date(date).toLocaleString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        });
    };

    const getWinnerMessage = (item) => {
        let winner;
        const winningTeam = team_data?.data?.find((items) => items?.id === item?.matchWinner)?.team_name || item?.matchWinner === item?.team1?.id ? item?.team1?.team_name : item?.team2?.team_name
        const terminatedTeam = team_data?.data?.find((items) => items?.id === item?.terminate?.teamdisqualify)?.team_name || item?.terminate?.teamdisqualify === item?.team1?.id ? item?.team1?.team_name : item?.team2?.team_name
        if (item?.terminate) {
            if (item?.terminate?.mainreason === "rain") {
                winner = (`Match abandoned due to ${item?.terminate?.mainreason}`)
            } else {
                winner = (`Match abandoned as ${terminatedTeam} was disqualified`)
            }
        } else if (item?.matchWinner === undefined && isTestMatch) {
            winner = ("Match Draw")
        } else if (!item?.matchWinner && !isTestMatch) {
            winner = ('Match Tied')
        } else if (item?.winSituation) {
            winner = (`${winningTeam} ${item?.winSituation}`)
        }
        return winner;
    };

    const handleRouteClick = (item) => {
        if (!isAdmin) {
            const route =
                item?.status === 4
                    ? `/match/${item?.id}/summary`
                    : item?.status !== 1 && item?.status !== 2
                        ? `/match/${item?.id}/live`
                        : null;
            if (route) router.push(route);
        }
    }

    return (
        matches.length > 0 &&
        <Box className={`all_matched ${isPastTournament ? 'isPastTournament' : ''}`}>
            {
                matches
                    .sort((a, b) => new Date(b?.datetime || b?.match_start_time) - new Date(a?.datetime || a?.match_start_time))
                    .map((item, i) => {
                        const formattedDate = formatDate(item?.datetime || item?.match_start_time);
                        const winner = getWinnerMessage(item);
                        let team1Winner = !item?.matchWinner ? false : item?.matchWinner === item?.team1?.id ? true : false
                        let team2Winner = !item?.matchWinner ? false : item?.matchWinner !== item?.team1?.id ? true : false
                        let team1 = team_data?.data?.find((items) => items?.id === item?.team1?.id) || []
                        let team2 = team_data?.data?.find((items) => items?.id === item?.team2?.id) || []
                        let team1_logo = team1.team_logo ? team1.team_logo : item?.team1?.team_logo;
                        let team1_name = team1.team_name ? team1.team_name : item?.team1?.team_name;
                        let team1_letter = team1.letter ? team1.letter : item?.team1?.letter;
                        let team1_color = team1.team_color ? team1.team_color : item?.team1.team_color;
                        let team2_logo = team2.team_logo ? team2.team_logo : item?.team2.team_logo;
                        let team2_name = team2.team_name ? team2.team_name : item?.team2.team_name;
                        let team2_letter = team2.letter ? team2.letter : item?.team2.letter;
                        let team2_color = team2.team_color ? team2.team_color : item?.team2.team_color;
                        let tossWinner = item?.toss?.tossWinner === team1.id ? team1_name : item?.toss?.tossWinner === team2.id ? team2_name : ''
                        let firstInnings = item?.firstInnings?.Currentover[0];
                        let secondInnings = item?.status !== 4 ? item?.secondInnings?.Currentover[0] : item?.secondInnings?.Completedovers?.slice(-1)[0];
                        let superover = item?.currentInnings === 3 || item?.currentInnings === 4;
                        let thirdInnings = isTestMatch ? item?.superOverFirstInnings?.Completedovers?.slice(-1)[0] : item?.superOverFirstInnings?.Currentover[0];
                        let fourthInnings = isTestMatch ? item?.superOverSecondInnings?.Completedovers?.slice(-1)[0] : item?.superOverSecondInnings?.Currentover[0];
                        let firstInningsCompletedOver = item?.firstInnings?.Completedovers?.length;
                        let secondInningsCompletedOver = item?.secondInnings?.Completedovers?.length;
                        let thirdInningsCompletedOver = item?.superOverFirstInnings?.Completedovers?.length;
                        let fourthInningsCompletedOver = item?.superOverSecondInnings?.Completedovers?.length;
                        
                        let FirstInningsbatting = (item?.toss?.tossWinner === team1.id && item?.toss?.selectSide === "Bat") || (item?.toss?.tossWinner !== team1.id && item?.toss?.selectSide !== "Bat");
                        let secondInningsBattingSide = (item?.toss?.tossWinner !== team1.id && item?.toss?.selectSide === "Bat") || (item?.toss?.tossWinner === team1.id && item?.toss?.selectSide !== "Bat");
                        let thirdInningsBattingSide = item?.superOverFirstInnings?.battingside === item?.team1?.team_name;
                        let fourthInningsBattingSide = item?.superOverSecondInnings?.battingside === item?.team1?.team_name;
                        let matchwon = item?.matchWinner;
                        let Innings1Declare = item?.firstInnings?.declare === "yes" ? true : false
                        let Innings2Declare = item?.secondInnings?.declare === "yes" ? true : false
                        let Innings3Declare = item?.superOverFirstInnings?.declare === "yes" ? true : false

                        let getInningsStats = (innings, battingSide, completedOvers, isSuperOver = false, currentInnings) => {
                            if (!innings) return { runs: 0, wicket: 0, ball: 0, over: 0 };

                            let currentPlayingInnings = item?.currentInnings === currentInnings;
                            let runs = innings?.runs || 0;
                            let wicket = innings?.wicket || 0;
                            let ball = innings?.legalBall === 6 ? 0 : innings?.legalBall || 0;
                            let overno = isTestMatch && (matchwon || item?.status === 4) && innings?.legalBall === 6 ? completedOvers
                                : isTestMatch && innings?.legalBall !== 6 && (matchwon || item?.status === 4) ? completedOvers - 1
                                    : (currentInnings === 2 || currentInnings === 1) && (matchwon || item?.status === 4) && innings?.legalBall === 6 ? completedOvers
                                        : (currentInnings === 2 || currentInnings === 1) && innings?.legalBall !== 6 && (matchwon || item?.status === 4) ? completedOvers - 1
                                            : (completedOvers > 0 || !completedOvers) && innings?.legalBall === 6 && currentPlayingInnings ? completedOvers + 1 || 1
                                                : completedOvers > 0 && innings?.legalBall !== 6 && currentPlayingInnings ? completedOvers : completedOvers ? completedOvers
                                                    : 0;
                            let over = isSuperOver && innings?.legalBall === 6 && !isTestMatch ? `1.0` : `${overno}.${ball}`;

                            return { runs, wicket, ball, over };
                        };

                        let team1Stats = item?.status <= 2 ? getInningsStats(0)
                            : FirstInningsbatting ? getInningsStats(firstInnings, FirstInningsbatting, firstInningsCompletedOver, false, 1)
                                : secondInningsBattingSide && getInningsStats(secondInnings, secondInningsBattingSide, secondInningsCompletedOver, false, 2);

                        let team2Stats = item?.status <= 2 ? getInningsStats(0)
                            : !FirstInningsbatting ? getInningsStats(firstInnings, !FirstInningsbatting, firstInningsCompletedOver, false, 1)
                                : !secondInningsBattingSide && getInningsStats(secondInnings, !secondInningsBattingSide, secondInningsCompletedOver, false, 2);

                        let team1_soStats = !fourthInningsBattingSide && !thirdInningsBattingSide ? getInningsStats(0)
                            : thirdInningsBattingSide && !isTestMatch ? getInningsStats(thirdInnings, thirdInningsBattingSide, 0, true, 3)
                                : thirdInningsBattingSide && isTestMatch ? getInningsStats(thirdInnings, thirdInningsBattingSide, thirdInningsCompletedOver, true, 3)
                                    : fourthInningsBattingSide && isTestMatch ? getInningsStats(fourthInnings, fourthInningsBattingSide, fourthInningsCompletedOver, true, 4)
                                        : fourthInningsBattingSide && getInningsStats(fourthInnings, fourthInningsBattingSide, 0, true, 4);

                        let team2_soStats = !thirdInningsBattingSide && !isTestMatch ? getInningsStats(thirdInnings, !thirdInningsBattingSide, 0, true, 3)
                            : !thirdInningsBattingSide && isTestMatch ? getInningsStats(thirdInnings, !thirdInningsBattingSide, thirdInningsCompletedOver, true, 3)
                                : !fourthInningsBattingSide && isTestMatch ? getInningsStats(fourthInnings, !fourthInningsBattingSide, fourthInningsCompletedOver, true, 4)
                                    : !fourthInningsBattingSide && getInningsStats(fourthInnings, !fourthInningsBattingSide, 0, true, 4);

                        let overs = item?.totalovers || item?.numberOfOvers || '';
                        let matchLocation = `${tournamentData?.ground}, ${tournamentData?.city} ${tournamentData?.match_type === "Test Match" ? '' : `| ${overs ?? 0} Ov.`}`
                        let matchType = `${tournamentData?.tournament_format} Matches`
                        let isButtonShow = (activeTab === 2 && isPastTournament && item.status !== 4) || (activeTab === 2 && item.status !== 4);
                        let isStumps = item?.stumps !== undefined && item?.stumps === 0 ? true : false
                        let typeData = isTestMatch ? TestBreakType : breakType
                        let isBreakStart = item?.status !== 4 && typeData?.find(type => type?.key_name === item?.breaktype)?.title || ''
                        let isUser = item?.status !== 1 && item?.status !== 2 && !isAdmin

                        return (
                            <React.Fragment key={i}>
                                {item?.tournamentId === tournamentData?.id && <Box className='match_card' onClick={() => handleRouteClick(item)}>
                                    {item?.status <= 3 && isAdmin && <Box sx={{ position: 'absolute', right: '10px', }}>
                                        <IconButton onClick={(e) => handleMenuClick(e, item)} aria-controls="simple-menu" aria-haspopup="true" className='match-menu-icon-box' sx={{ padding: '0px !important' }}>
                                            <MoreVertIcon />
                                        </IconButton>
                                        <Menu
                                            anchorEl={anchorEl}
                                            open={Boolean(anchorEl)}
                                            onClose={handleClosed}
                                            className='list-menu'
                                        >
                                            {
                                                <div>
                                                    {
                                                        !isPastTournament &&
                                                        <MenuItem onClick={() => handleMenuItemClick('edit')}>
                                                            <Box className='AddPlayerTag' >
                                                                <EditIcon />
                                                                <Typography variant='body2'>Edit</Typography>
                                                            </Box>
                                                        </MenuItem>
                                                    }
                                                    <MenuItem onClick={() => handleMenuItemClick('delete')}>
                                                        <Box className='AddPlayerTag delete' >
                                                            <DeleteIcon color='error' />
                                                            <Typography variant='body2'>Delete</Typography>
                                                        </Box>
                                                    </MenuItem>
                                                </div>
                                            }
                                        </Menu>
                                    </Box>}
                                    <Typography variant='body2' className='match_location'>{matchType}</Typography>
                                    <Typography variant='body2' className='match_location'>{formattedDate}</Typography>
                                    <Typography variant='body2' className='match_location'>{matchLocation}</Typography>
                                    {item?.status > 2 && <Typography variant='body2' className='match_location'>{`${tossWinner} won the toss and decided to ${item?.toss?.selectSide}`}</Typography>}
                                    {isStumps && <Typography variant='body2' className='match_location stumps'>Stumps</Typography>}
                                    {item?.status === 4 && <Typography variant='body2' className={`match_type ${item?.terminate ? 'terminate' : 'winner'}`}>{`${winner}`}</Typography>}
                                    {isBreakStart && <Typography variant='body2' className='match_location break'>{isBreakStart}</Typography>}
                                    <Box className='row'>
                                        <TeamScoreBox
                                            teamWon={team1Winner}
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
                                            scorehidden={item?.currentInnings === 4 || !isTestMatch ? false : thirdInningsBattingSide ? false : true}
                                            Innings1Declare={!isTestMatch ? false : item?.firstInnings?.battingside === item?.team1?.team_name ? Innings1Declare : Innings2Declare}
                                            Innings2Declare={!isTestMatch ? false : item?.currentInnings === 4 && item?.superOverSecondInnings?.battingside !== item?.team1?.team_name ? Innings3Declare : false}
                                        />
                                        <Box className='teamVsLogo'>
                                            <Image src={vsLogo} alt='logo' width={90} height={90} unoptimized />
                                        </Box>
                                        <TeamScoreBox
                                            teamWon={team2Winner}
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
                                            scorehidden={item?.currentInnings === 4 || !isTestMatch ? false : thirdInningsBattingSide ? true : false}
                                            Innings1Declare={!isTestMatch ? false : item?.firstInnings?.battingside === item?.team2?.team_name ? Innings1Declare : Innings2Declare}
                                            Innings2Declare={!isTestMatch ? false : item?.currentInnings === 4 && item?.superOverSecondInnings?.battingside === item?.team1?.team_name ? Innings3Declare : false}
                                        />
                                    </Box>
                                    {/* {!isButtonShow && <Box className='linear-gradiant'></Box>} */}
                                    <Box className={`${isButtonShow ? 'd-none' : 'start_match_box'}`}>
                                        {
                                            isUser ?
                                                <CustomeButton
                                                    title={"Show Match"}
                                                    bgColor={'var(--theme-primary)'}
                                                    color={'var(--color-white)'}
                                                    width={'188px'}
                                                    height={'44px'}
                                                />
                                                : isAdmin ?
                                                    <CustomeButton
                                                        bgColor={'var(--theme-primary) !important'}
                                                        title={getMatchButtonTitle()}
                                                        width={'180px'}
                                                        height={'44px'}
                                                        onClick={() => handleStartMatch(item?.id)}
                                                    /> : ''
                                        }
                                    </Box>
                                </Box>}
                            </React.Fragment>
                        )
                    })
            }
        </Box>
    )
}

export default MatchCard