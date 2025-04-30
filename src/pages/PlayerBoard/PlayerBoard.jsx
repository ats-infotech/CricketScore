'use client'
import SvgIcon from "@/assets/icons/SvgIcon";
import { CommonText } from "@/components/common/commonText";
import Banner from "@/components/common/commonUi/Banner/Banner";
import CommonBack from "@/components/common/commonUi/commonBack";
import CustomeButton from "@/components/common/commonUi/CustomeButton";
import { TeamSelection } from "@/components/common/commonUi/CustomeSelectionSquareBox";
import { Box, Typography, useMediaQuery } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ball from '../../assets/img/cricket/ball.png';
import bat from '../../assets/img/cricket/batball.png';
import bowlerpic from '../../assets/img/cricket/bowler.png';
import nonstrikerpic from '../../assets/img/cricket/nonstriker.png';
import strikerpic from '../../assets/img/cricket/striker.png';
import PlayerSelection from "../PlayerSelection/StrikePlayerSection";
import './PlayerBoard.css';
import { useSelector } from "react-redux";
import { teamsState } from "@/redux/slices/teamSlice";

const ImageHeading = ({ src, title }) => {
    return (
        <Box className='playerboard_heading_section'>
            <Box className='playerboard_heading_image_section'>
                <Image unoptimized src={src} alt='kit' width={22} height={22} />
            </Box>
            <Typography variant="body2">:</Typography>
            <Typography className="playerboard_heading_section_title" variant="body2">{title}</Typography>
        </Box>
    )
}

const PlayerBoard = ({ teamplay, players, handleOnPlayerChange, selectePlayer, striker, nonStriker, bowler, disabled, startmatch, currentmatch, tournamentData }) => {
    const [battingPlayers, setBattingPlayers] = useState([]);
    const [bowlingPlayers, setBowlingPlayers] = useState([]);
    const [onActive, setOnActive] = useState('');
    const [activeData, setActiveData] = useState([])
    const team_data = useSelector(teamsState)
    const router = useRouter()

    const sm = useMediaQuery('(max-width: 350px)')
    const md = useMediaQuery('(max-width: 380px)')
    const lg = useMediaQuery('(max-width: 410px)')
    let team1 = team_data?.data?.find((items) => items?.id === currentmatch?.team1?.id)
    let team2 = team_data?.data?.find((items) => items?.id === currentmatch?.team2?.id)
    let selectedPlyrs = currentmatch?.selectedPlayer
    let selectedTeam1 = selectedPlyrs?.team1
    let selectedTeam2 = selectedPlyrs?.team2
    let Allplayer = selectedPlyrs?.team1.concat(selectedPlyrs?.team2)
    let START_SCORING = Boolean(striker && nonStriker && bowler)
    let ismatchTest = tournamentData?.match_type === "Test Match" ? true : false
    let isFollowOn = currentmatch?.followOn === "Follow On" ? true : false

    let Team1Name = team1?.team_name
    let Team1Letter = team1?.letter
    let Team1Color = team1?.team_color
    let Team1Logo = team1?.team_logo
    let Team2Name = team2?.team_name
    let Team2Letter = team2?.letter
    let Team2Color = team2?.team_color
    let Team2Logo = team2?.team_logo
    let superOverCountEven = currentmatch?.superOverCount % 2 === 0

    let BattingTeamName = ismatchTest && !isFollowOn && currentmatch?.currentInnings === 3 ? teamplay?.batting?.team_name
        : ismatchTest && isFollowOn && currentmatch?.currentInnings === 3 ? teamplay?.bowling?.team_name
            : ismatchTest && isFollowOn && currentmatch?.currentInnings === 4 ? teamplay?.batting?.team_name
                : ismatchTest && !isFollowOn && currentmatch?.currentInnings === 4 ? teamplay?.bowling?.team_name
                    : superOverCountEven && currentmatch?.currentInnings === 3 ? teamplay?.batting?.team_name
                        : superOverCountEven && currentmatch?.currentInnings !== 3 ? teamplay?.bowling?.team_name
                            : currentmatch?.currentInnings === 2 || currentmatch?.currentInnings === 3 ? teamplay?.bowling?.team_name
                                : teamplay?.batting?.team_name

    let BowlingTeamName = ismatchTest && !isFollowOn && currentmatch?.currentInnings === 3 ? teamplay?.bowling?.team_name
        : ismatchTest && isFollowOn && currentmatch?.currentInnings === 3 ? teamplay?.batting?.team_name
            : ismatchTest && isFollowOn && currentmatch?.currentInnings === 4 ? teamplay?.bowling?.team_name
                : ismatchTest && !isFollowOn && currentmatch?.currentInnings === 4 ? teamplay?.batting?.team_name
                    : superOverCountEven && currentmatch?.currentInnings === 3 ? teamplay?.bowling?.team_name
                        : superOverCountEven && currentmatch?.currentInnings !== 3 ? teamplay?.batting?.team_name
                            : currentmatch?.currentInnings === 2 || currentmatch?.currentInnings === 3 ? teamplay?.batting?.team_name
                                : teamplay?.bowling?.team_name

    let strikerName = battingPlayers.find(item => item?.id === striker)?.playerName || 'Striker'
    let nonStrikerName = battingPlayers.find(item => item?.id === nonStriker)?.playerName || 'Non-Striker'
    let bowlerName = bowlingPlayers.find(item => item?.id === bowler)?.playerName || 'Bowler'

    useEffect(() => {
        if (!teamplay || !players) return;

        const battingTeamId = teamplay?.batting?.id;
        const bowlingTeamId = teamplay?.bowling?.id;

        const filteredBattingPlayers = players.filter((player) => player?.teamId === battingTeamId);
        const PickedFilterBattingPlayer = filteredBattingPlayers.filter((items) => Allplayer?.includes(items.id))
        const filteredBowlingPlayers = players.filter((player) => (player?.teamId === bowlingTeamId));
        const PickedBowlingPlayer = filteredBowlingPlayers.filter((items) => Allplayer?.includes(items.id))

        if (ismatchTest && currentmatch?.currentInnings === 4 ? !isFollowOn
            : ismatchTest && currentmatch?.currentInnings === 3 ? isFollowOn
                : currentmatch?.superOverCount && currentmatch?.currentInnings === 3 ? !superOverCountEven
                    : currentmatch?.superOverCount && currentmatch?.currentInnings !== 3 ? superOverCountEven
                        : (currentmatch?.currentInnings === 2 || currentmatch?.currentInnings === 3)) {
            setBowlingPlayers(PickedFilterBattingPlayer);
            setBattingPlayers(PickedBowlingPlayer);
        } else if (currentmatch?.superOverCount && currentmatch?.currentInnings === 3 ? superOverCountEven
            : currentmatch?.superOverCount && currentmatch?.currentInnings !== 3 ? !superOverCountEven
                : (teamplay || currentmatch?.currentInnings === 4)) {
            setBowlingPlayers(PickedBowlingPlayer);
            setBattingPlayers(PickedFilterBattingPlayer);
        }
    }, [teamplay, players, currentmatch, selectedTeam1, selectedTeam2]);

    let playerNotShow = (selectePlayer)

    const handleSelection = (val) => {
        setOnActive(val)
        if (val === 'striker' || val === 'nonStriker') {
            let result = battingPlayers.filter(item => item.id !== playerNotShow?.[val === 'striker' ? 'nonStriker' : 'striker'])
            setActiveData(result)
        } else {
            setActiveData(bowlingPlayers)
        }
    }

    const handleCheck = (event, item) => {
        handleOnPlayerChange(item?.id, onActive)
    }

    const PlayerSelected = () => {
        setOnActive('')
    }

    const handleBack = () => {
        handleOnPlayerChange('', onActive);
        setOnActive('');
    }

    return (
        <>
            {
                !onActive ?
                    <Box sx={{ position: 'relative' }}>
                        <Banner
                            status={currentmatch?.status ? currentmatch?.status : ''}
                            tossWinner={currentmatch?.toss && (currentmatch?.currentInnings !== 3 || currentmatch?.currentInnings !== 4) ? `${currentmatch?.toss?.tossWinner === currentmatch?.team1?.id ? team1?.team_name : team2?.team_name} won the toss and decided to ${currentmatch?.toss?.selectSide}` : 'Superover'}
                            image1={Team1Logo ? `/${Team1Logo}` : null}
                            team1letter={Team1Letter}
                            team1color={Team1Color}
                            team1name={Team1Name}
                            image2={Team2Logo ? `/${Team2Logo}` : null}
                            team2name={Team2Name}
                            team2letter={Team2Letter}
                            team2color={Team2Color}
                        />
                        <CommonBack onClick={() => router.push(`/mytournament/${currentmatch?.tournamentId}/match`)} />
                        <Box className={`playerboard_main_section ${START_SCORING && 'active'}`}>
                            <ImageHeading src={bat} title={BattingTeamName} />
                            <Box className='playerboard_batting_team_section'>
                                <TeamSelection name={strikerName} height={sm ? 110 : md ? 130 : lg ? 140 : 150} width={sm ? 110 : md ? 130 : lg ? 140 : 150} imgheight={sm ? 75 : md ? 85 : 100} imgwidth={sm ? 75 : md ? 85 : 100} isActive={selectePlayer?.striker !== '' ? true : false} src={strikerpic} title={CommonText.SelectStriker} onClick={() => handleSelection('striker')} />
                                <TeamSelection name={nonStrikerName} height={sm ? 110 : md ? 130 : lg ? 140 : 150} width={sm ? 110 : md ? 130 : lg ? 140 : 150} imgheight={sm ? 75 : md ? 85 : 100} imgwidth={sm ? 75 : md ? 85 : 100} isActive={selectePlayer?.nonStriker !== '' ? true : false} src={nonstrikerpic} title={CommonText.NonStriker} onClick={() => handleSelection('nonStriker')} />
                            </Box>
                            <ImageHeading src={ball} title={BowlingTeamName} />
                            <Box className='playerboard_bowling_team_section'>
                                <TeamSelection name={bowlerName} height={sm ? 110 : md ? 130 : lg ? 140 : 150} width={sm ? 110 : md ? 130 : lg ? 140 : 150} imgheight={sm ? 75 : md ? 85 : 100} imgwidth={sm ? 75 : md ? 85 : 100} isActive={selectePlayer?.bowler !== '' ? true : false} src={bowlerpic} title={CommonText.SelectBowler} onClick={() => handleSelection('bowler')} />
                            </Box>
                        </Box>
                        {
                            START_SCORING &&
                            <Box className='playerboard_buttons'>
                                <CustomeButton border={'1px solid var(--primary-color)'} title={CommonText.StartScoring}
                                    width={'100%'} bgColor={'var(--text-white)'} color={'var(--primary-color)'}
                                    onClick={startmatch} hover={'none'}
                                />
                            </Box>
                        }
                    </Box>
                    :
                    <>
                        <Box className='playerboard_player_selection_section'>
                            <SvgIcon id={'down-arrow'} onClick={handleBack} />
                            <Typography variant="body2">{onActive === 'striker' ? `${CommonText.SelectStriker}` : onActive === 'nonStriker' ? `${CommonText.SelectNonStriker}` : `${CommonText.SelectBowler}`}</Typography>
                        </Box>
                        <Box className={`player_selection_section ${selectePlayer[onActive] && 'active'}`}>
                            <PlayerSelection playerdata={activeData} onCheck={handleCheck} isPlayer={selectePlayer[onActive]} />
                        </Box>
                        {selectePlayer[onActive] && <Box className='playerboard_buttons'>
                            <CustomeButton
                                onClick={PlayerSelected}
                                title={'Next'}
                                width={'100%'}
                                height={'45px'}
                            />
                        </Box>}
                    </>
            }
        </>
    )
}

export default PlayerBoard