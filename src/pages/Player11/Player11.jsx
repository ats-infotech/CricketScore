'use client'
import SvgIcon from "@/assets/icons/SvgIcon";
import { scrollTopDiv } from "@/components/common/commomFunction";
import Banner from "@/components/common/commonUi/Banner/Banner";
import CustomeButton from "@/components/common/commonUi/CustomeButton";
import ImageAvatar from "@/components/common/commonUi/ImageAvatar/ImageAvatar";
import MessageModal from "@/components/common/commonUi/Modal/MessageModal";
import CommonBack from "@/components/common/commonUi/commonBack";
import { matchesState, ReplaceMatchSchedule } from "@/redux/slices/matchSlice";
import { playersState } from "@/redux/slices/playersSlice";
import { Close } from "@mui/icons-material";
import { Box, Button, Modal, Typography } from "@mui/material";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CaptainImage from '../../assets/img/playing11/captain.png';
import WicketKeeperImage from '../../assets/img/playing11/wk.png';
import './player11.css';
import { teamsState } from "@/redux/slices/teamSlice";

const CommonButton = ({ title, onClick, isActive, activeTab }) => {
    return (
        <Box className='player11_common_button_section'>
            <Box className={`ecplise_box ${activeTab === 1 ? 'left' : 'right'}`} >
                <SvgIcon id={'eclipse'} height={51} width={182} />
            </Box>

            <Button className={`player11_common_button ${isActive && 'active'}`}
                onClick={onClick}
            >
                {title}
            </Button>

            <Box className={`player11_common_section_down_section ${isActive && 'active'}`} >
                <SvgIcon id={'down-arrow'} height={12} width={12} />
            </Box>
        </Box>
    )
}

// const CommonBox = ({ src, handleCheck, isCap, isWk }) => {
//     return (
//         <Box className={`player11_post_selection_section ${isWk ? 'isWk' : isCap ? 'isCap' : ''}`} onClick={handleCheck} >
//             <Box className='player11_post_selection_sub_section'>
//                 <Image style={{ filter: isCap ? 'grayscale(0)' : isWk ? 'grayscale(0)' : 'grayscale(1)' }} unoptimized src={src} alt="post" width={500} height={500} />
//             </Box>
//         </Box>
//     )
// }

// const CommonSection = ({ data, IsinCludes, handleCheck, Step, IsCap, IsWk, teams }) => {
//     return (
//         <Box className='player11_post_main_section'>
//             {
//                 data.length > 0 && data.map((item) => {
//                     let isSelect = IsinCludes(item)
//                     let isCap = IsCap(item)
//                     let isWk = IsWk(item)

//                     return (
//                         <Box className={`player11_common_main_section ${isSelect && Step === 1 ? 'active' : ''}`} key={item?.id} onClick={Step === 1 ? (e) => handleCheck(e, item) : undefined}>
//                             <Box>
//                                 {item?.playerImage === '' ?
//                                     <Box className='player11_Text_circle_section'>
//                                         <Box className='player11_Text_circle' sx={{ backgroundColor: item?.playerColor }}>
//                                             <Typography variant="body2">{item?.letter}</Typography>
//                                         </Box>
//                                     </Box>
//                                     :
//                                     <Box className='player11_common_section'>
//                                         <Image src={`/${item?.playerImage}`} alt='profile pic' width={150} height={150} />
//                                     </Box>
//                                 }
//                             </Box>
//                             <Box>
//                                 <Typography variant="body2">{item?.playerName}</Typography>
//                                 <Box className='player11_common_sub_section'>
//                                     {Step === 1 && <Box className={isSelect ? 'player11_active_checkbox_section' : 'player11_checkbox_section'}>
//                                         {isSelect && Step === 1 && <SvgIcon id={'checked'} height={14} width={14} style={{ color: 'var(--text-white)' }} />}
//                                     </Box>}
//                                     {
//                                         Step === 2 &&
//                                         <Box className='player11_post_section'>
//                                             <CommonBox isCap={isCap} handleCheck={(e) => handleCheck(e, item, 'cap')} src={require('../../assets/img/playing11/captain.png')} />
//                                             <CommonBox isWk={isWk} handleCheck={(e) => handleCheck(e, item, 'wk')} src={require('../../assets/img/playing11/wk.png')} />
//                                         </Box>
//                                     }
//                                 </Box>
//                             </Box>
//                         </Box>
//                     )
//                 })
//             }
//         </Box>
//     )
// }

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '95%',
    maxWidth: '420px',
    bgcolor: 'var(--text-white)',
    boxShadow: 24,
    p: 3,
    outline: 'none',
    borderRadius: '15px'
};

const Player11 = () => {
    const params = useParams()
    const [matchObj, setMatchObj] = useState({})
    const [matchId, setMatchId] = useState('')
    const [selectedTeamPlayers, setSlectedTeamPlayers] = useState([])
    const [activeTab, setActiveTab] = useState(1)
    const [selectedPlayer, setSelectedPlayer] = useState({
        team1: [],
        team2: []
    })
    const [err, setErr] = useState('')
    const [playererr, setPlayererr] = useState(false)
    const [team1, setTeam1] = useState([])
    const [team2, setTeam2] = useState([])
    // const [CurrentStep, setCurrentStep] = useState(1)
    const [Captain, setCaptain] = useState({
        team1: '',
        team2: ''
    })
    const [WicketKeeper, setWicketKeeper] = useState({
        team1: '',
        team2: ''
    })
    const [selectCwk, setSelectCwk] = useState({
        team1: { captain: '', wicketKeeper: '' },
        team2: { captain: '', wicketKeeper: '' }
    })
    const [perTeamPlayers, setPerTeamPlayers] = useState()
    const [open, setOpen] = useState(false);
    const [playeravailableerror, setPlayerAvailableError] = useState({
        team1playererror: true,
        team2playererror: true,
        bothteamerror: true
    })
    const [teamConfirmed, setTeamConfirmed] = useState({
        team1: false,
        team2: false
    })
    const [alertModal, setAlertModal] = useState({
        success: false,
        open: false,
        message: ''
    })
    const [processing, setProcessing] = useState(false)
    const [deletedId, setDeleteId] = useState('')
    const match_data = useSelector(matchesState)
    const player_data = useSelector(playersState)
    const team_data = useSelector(teamsState)
    const router = useRouter()
    const dispatch = useDispatch()
    const [activeSelectedPlayers, setActiveSelectedPlayers] = useState({
        team1: [],
        team2: [],
    })
    const teamKey = activeTab === 1 ? 'team1' : 'team2';
    // const [allDone, setAllDone] = useState(false)
    // const [loading, setLoading] = useState(false)

    const handleMessageModalClose = () => {
        setAlertModal({
            success: false,
            open: false,
            message: ''
        })
    }

    const handleMessageModalOpen = (id) => {
        setDeleteId(id)
        setAlertModal({
            success: false,
            open: true,
            message: 'Are you sure want to remove this player ?'
        })
    }

    const handleOpen = () => {
        setErr('')
        setOpen(true)
        if (activeTab === 1) {
            // const getPlayer = player_data?.data.filter(item => item?.teamId === matchObj?.team1?.id)
            // setSlectedTeamPlayers(getPlayer)
        }
    };

    // const handleClose = () => {
    //     setOpen(false)
    //     if (activeTab === 1 && !teamConfirmed.team1) {
    //         setSelectedPlayer((prev) => ({
    //             ...prev,
    //             team1: [],
    //         }))
    //         setCaptain((prev) => ({
    //             ...prev,
    //             team1: ''
    //         }))
    //         setWicketKeeper((prev) => ({
    //             ...prev,
    //             team1: ''
    //         }))
    //     } else if (activeTab === 2 && !teamConfirmed.team2) {
    //         setSelectedPlayer((prev) => ({
    //             ...prev,
    //             team2: [],
    //         }))
    //         setCaptain((prev) => ({
    //             ...prev,
    //             team2: ''
    //         }))
    //         setWicketKeeper((prev) => ({
    //             ...prev,
    //             team2: ''
    //         }))
    //     }
    // };

    const handleClose = () => {
        setOpen(false)
        setSelectedPlayer((prev) => ({
            ...prev,
            [teamKey] : activeSelectedPlayers[teamKey]
        }))
        setSelectCwk((prev) => ({
            ...prev,
            [teamKey] : { captain: Captain[teamKey], wicketKeeper: WicketKeeper[teamKey]}
        }))
        if (!teamConfirmed[teamKey]) {
            setSelectedPlayer((prev) => ({
                ...prev,
                [teamKey]: [],
            }))
            setCaptain((prev) => ({
                ...prev,
                [teamKey]: ''
            }))
            setWicketKeeper((prev) => ({
                ...prev,
                [teamKey]: ''
            }))
            setSelectCwk(prev => ({
                ...prev[teamKey],
                [teamKey]: { captain: '', wicketKeeper: '' }
            }))
        }
    };

    useEffect(() => {
        // setLoading(true)
        setMatchId(params.matchId)
        let match = match_data.data.find(item => item?.id === params.matchId)
        setMatchObj(match);
        const getPlayer = player_data?.data.filter(item => item?.teamId === match?.team1?.id)
        setSlectedTeamPlayers(getPlayer)
        let AllSelectedPlayers = match?.selectedPlayer
        if (AllSelectedPlayers) {
            setSelectedPlayer(match?.selectedPlayer)
        }
        // setLoading(false)
    }, [params]);

    useEffect(() => {
        setActiveSelectedPlayers(prev => ({
            ...prev,
            [teamKey]: selectedPlayer?.[teamKey]
        }))
    }, [activeTab]);

    useEffect(() => {
        // const team1 = matchObj?.team1
        // const team2 = matchObj?.team2
        let team1 = team_data?.data?.find((items) => items?.id === matchObj?.team1?.id)
        let team2 = team_data?.data?.find((items) => items?.id === matchObj?.team2?.id)
        const playersallowed = parseInt(matchObj?.perteamplayers)
        setPerTeamPlayers(playersallowed)
        setTeam1(team1)
        setTeam2(team2)
    }, [matchObj, team_data])

    useEffect(() => {
        if (selectedTeamPlayers.length >= perTeamPlayers) {
            setPlayererr(false)
        } else if (selectedTeamPlayers.length < perTeamPlayers) {
            setPlayererr(true)
        }
    }, [selectedTeamPlayers, perTeamPlayers])

    const handleTeamsAction = (val) => {
        setErr('')
        setActiveTab(val)
        scrollTopDiv('player11_max_height_section')
        const teamId = val === 1 ? matchObj?.team1?.id : matchObj?.team2?.id;
        const getPlayer = player_data?.data.filter(item => item?.teamId === teamId)
        setSlectedTeamPlayers(getPlayer)
    }

    const handlePostCheck = (event, item, type) => {
        let playerId = item?.id
        setErr('');
        setSelectCwk(prev => ({
            ...prev,
            [teamKey]: {
                ...prev[teamKey],
                [type === 'wk' ? 'wicketKeeper' : 'captain']: playerId
            }
        }));
        // if (type === 'wk') {
        //     setWicketKeeper(prev => ({
        //         ...prev,
        //         [teamKey]: playerId
        //     }));
        // } else if (type === 'cap') {
        //     setCaptain(prev => ({
        //         ...prev,
        //         [teamKey]: playerId
        //     }));
        // }
    }

    const handleCheckboxChange = (event, item) => {
        const playerId = item?.id;

        if (selectedPlayer[teamKey]?.includes(playerId)) {
            setSelectedPlayer(prevState => ({
                ...prevState,
                [teamKey]: prevState[teamKey].filter(id => id !== playerId)
            }));
        } else if (selectedPlayer[teamKey]?.length < perTeamPlayers) {
            setSelectedPlayer(prevState => ({
                ...prevState,
                [teamKey]: [...prevState[teamKey], playerId]
            }));
        } else {
            setErr(`${teamKey === "team1" ? 'Team 1' :'Team 2'} already reached the maximum players (${perTeamPlayers})`);
        }
    }

    useEffect(() => {
        if (selectedPlayer[teamKey]?.length === perTeamPlayers) {
            setErr('')
        }
    }, [selectedPlayer[teamKey]])

    const IsWk = (item) => {
        // if (activeTab === 1) {
        //     return WicketKeeper?.team1?.includes(item?.id)
        // } else {
        //     return WicketKeeper?.team2?.includes(item?.id)
        // }
        return selectCwk[teamKey]?.wicketKeeper === item?.id
        // if (selectCwk[teamKey].wicketKeeper) {
        // } else {
        //     return WicketKeeper?.[teamKey] === item?.id;
        // }
    }

    const IsCap = (item) => {
        // if (activeTab === 1) {
        //     return Captain?.team1?.includes(item?.id)
        // } else {
        //     return Captain?.team2?.includes(item?.id)
        // }
        return selectCwk[teamKey]?.captain === item?.id
        // if (selectCwk[teamKey].captain) {
        // } else {
        //     return Captain?.[teamKey] === item?.id;
        // }
    }

    const IsinCludes = (item) => {
        // const teamKey = activeTab === 1 ? 'team1' : 'team2';
        return selectedPlayer?.[teamKey]?.includes(item?.id);
    };

    // const handleConfirm = () => {
    //     const teamKey = activeTab === 1 ? 'team1' : 'team2';
    //     if (selectedPlayer[teamKey]?.length < perTeamPlayers) {
    //         setErr(`Please select minimum ${perTeamPlayers}`)
    //     } else if (Captain[teamKey] === '') {
    //         setErr(`Please select captain`)
    //     } else if (WicketKeeper[teamKey] === '') {
    //         setErr(`Please select wicketkeeper`)
    //     } else {
    //         setOpen(false)
    //         if (activeTab === 1) {
    //             setTeamConfirmed((prev) => ({
    //                 ...prev,
    //                 team1: true
    //             }))
    //         }
    //         if (activeTab === 2) {
    //             setTeamConfirmed((prev) => ({
    //                 ...prev,
    //                 team2: true
    //             }))
    //         }
    //     }
    // }
    const handleConfirm = () => {
        const teamKey = activeTab === 1 ? 'team1' : 'team2';
        const selectedPlayers = selectedPlayer?.[teamKey] || [];
        const selectedCaptain = selectCwk?.[teamKey].captain || "";
        const selectedWicketKeeper = selectCwk?.[teamKey].wicketKeeper || "";

        if (!Array.isArray(selectedPlayers) || selectedPlayers.length < perTeamPlayers) {
            setErr(`Please select at least ${perTeamPlayers} players for ${teamKey}`);
            return;
        }

        if (!selectedCaptain) {
            setErr(`Please select a captain for ${teamKey}`);
            return;
        }

        if (!selectedWicketKeeper) {
            setErr(`Please select a wicketkeeper for ${teamKey}`);
            return;
        }
        setErr("");
        setOpen(false);

        setActiveSelectedPlayers((prev) => ({
            ...prev,
            [teamKey]: selectedPlayer?.[teamKey]
        }))
        setCaptain((prev) => ({
            ...prev,
            [teamKey]: selectCwk?.[teamKey]?.captain
        }))
        setWicketKeeper((prev) => ({
            ...prev,
            [teamKey]: selectCwk?.[teamKey]?.wicketKeeper
        }))
        setTeamConfirmed((prev) => ({
            ...prev,
            [teamKey]: true
        }));
    }

    useEffect(() => {
        if (Captain.team1 !== '' && WicketKeeper.team1 !== '' && selectedPlayer.team1?.length === perTeamPlayers) {
            setPlayerAvailableError((prev) => ({
                ...prev,
                team1playererror: false
            }))
        } else {
            setPlayerAvailableError((prev) => ({
                ...prev,
                team1playererror: true,
                bothteamerror: true
            }))
        }
        if (Captain.team2 !== '' && WicketKeeper.team2 !== '' && selectedPlayer.team2?.length === perTeamPlayers) {
            setPlayerAvailableError((prev) => ({
                ...prev,
                team2playererror: false
            }))
        } else {
            setPlayerAvailableError((prev) => ({
                ...prev,
                team2playererror: true,
                bothteamerror: true
            }))
        }
        if (Captain.team1 !== '' && WicketKeeper.team1 !== '' && selectedPlayer.team1?.length === perTeamPlayers && Captain.team2 !== '' && WicketKeeper.team2 !== '' && selectedPlayer.team2?.length === perTeamPlayers) {
            setPlayerAvailableError((prev) => ({
                ...prev,
                bothteamerror: false
            }))
        }
    }, [selectedPlayer.team1, selectedPlayer.team2, Captain.team1, Captain.team2, WicketKeeper.team1, WicketKeeper.team2])

    // const handleNext = async () => {
    //     scrollTopDiv('player11_max_height_section')
    //     setErr('')
    //     if (activeTab === 1 && selectedPlayer?.team1?.length === perTeamPlayers && selectedPlayer?.team2?.length < perTeamPlayers) {
    //         setActiveTab(2)
    //         const teamId = activeTab === 1 ? matchObj?.team2?.id : matchObj?.team1?.id;
    //         const getPlayer = player_data?.data.filter(item => item?.teamId === teamId)
    //         setSlectedTeamPlayers(getPlayer)
    //         setSelectedPlayer((prev) => ({
    //             ...prev,
    //             team2: activeTab === 1 && []
    //         }))
    //     } else if (activeTab === 2 && selectedPlayer?.team2?.length === perTeamPlayers && selectedPlayer?.team1?.length < perTeamPlayers) {
    //         setActiveTab(1)
    //         const teamId = activeTab === 1 ? matchObj?.team2?.id : matchObj?.team1?.id;
    //         const getPlayer = player_data?.data.filter(item => item?.teamId === teamId)
    //         setSlectedTeamPlayers(getPlayer)
    //         IsinCludes(selectedPlayer.team1)
    //         setSelectedPlayer((prev) => ({
    //             ...prev,
    //             team1: activeTab === 2 && [],
    //         }))
    //     } else {
    //         const payload = {
    //             id: matchObj?.id,
    //             selectedPlayer
    //         }
    //         const res = await dispatch(ReplaceMatchSchedule(payload));
    //         if (res) {
    //             setCurrentStep(2)
    //             setActiveTab(1)
    //             const getPlayer = player_data?.data.filter((item) => selectedPlayer?.team1?.includes(item?.id));
    //             setSlectedTeamPlayers(getPlayer)
    //         }
    //     }
    // }

    // const handleSubmit = async () => {
    //     const teamKey = activeTab === 1 ? 'team1' : 'team2'
    //     const isEmty = WicketKeeper[teamKey] && Captain[teamKey]
    //     const isKey = teamKey === 'team1' ? 'team2' : 'team1'
    //     const team2forselect = WicketKeeper[isKey] && Captain[isKey]
    //     if (!isEmty || !team2forselect) {
    //         setActiveTab(activeTab === 1 && isEmty ? 2 : 1)
    //         const teamId = activeTab === 1 ? matchObj?.team2?.id : matchObj?.team1?.id;
    //         const getPlayer = player_data?.data.filter(item => item?.teamId === teamId)
    //         if (!isEmty && !team2forselect) {
    //             setAllDone(true)
    //         }
    //         setSlectedTeamPlayers(getPlayer)
    //     } else {
    //         const object = {
    //             team1Captain: Captain.team1,
    //             team2Captain: Captain.team2,
    //             team1WicketKeeper: WicketKeeper.team1,
    //             team2WicketKeeper: WicketKeeper.team2
    //         }
    //         const payload = {
    //             id: matchObj?.id,
    //             post: object
    //         };
    //         const res = await dispatch(ReplaceMatchSchedule(payload));
    //         if (res) {
    //             router.push(`/playerboard/${matchId}`)
    //         }
    //     }
    // }

    // const handleBack = () => {
    //     if (CurrentStep === 2) {
    //         const getPlayer = player_data?.data.filter(item => item?.teamId === matchObj?.team1?.id)
    //         setSlectedTeamPlayers(getPlayer)
    //         setCurrentStep(1)
    //     } else {
    //         router.push(`/mytournament/${matchObj?.tournamentId}/match`)
    //     }
    // }

    // if (!loading && (!matchObj || !matchObj?.toss)) return <Custom404 />

    const handleBack = () => {
        router.push(`/mytournament/${matchObj?.tournamentId}/match`)
    }

    const handleAddPlayer = () => {
        const teamId = activeTab === 1 ? matchObj?.team1?.id : matchObj?.team2?.id;
        router.push(`/players/${teamId}`);
    }

    const handleSubmit = async () => {
        if (activeTab === 1 && playeravailableerror.team2playererror) {
            setActiveTab(2)
            const teamId = matchObj?.team2?.id;
            const getPlayer = player_data?.data.filter(item => item?.teamId === teamId)
            setSlectedTeamPlayers(getPlayer)
        } else if (activeTab === 2 && playeravailableerror.team1playererror) {
            setActiveTab(1)
            const teamId = matchObj?.team1?.id;
            const getPlayer = player_data?.data.filter(item => item?.teamId === teamId)
            setSlectedTeamPlayers(getPlayer)
        } else if (!playeravailableerror.bothteamerror) {
            const payload = {
                id: matchObj?.id,
                selectedPlayer: activeSelectedPlayers
            }
            const res = await dispatch(ReplaceMatchSchedule(payload));
            if (res) {
                const object = {
                    team1Captain: Captain.team1,
                    team2Captain: Captain.team2,
                    team1WicketKeeper: WicketKeeper.team1,
                    team2WicketKeeper: WicketKeeper.team2
                }
                const payload = {
                    id: matchObj?.id,
                    post: object
                };
                const response = await dispatch(ReplaceMatchSchedule(payload));
                if (response) {
                    router.push(`/playerboard/${matchId}`)
                }
            }
        }
    }

    // const handleRemovePlayer = () => {
    //     let id = deletedId
    //     setProcessing(true)
    //     const filterPlayer = selectedPlayer[teamKey]?.filter((items) => items !== id)
    //     if (activeTab === 1) {
    //         setSelectedPlayer((prev) => ({
    //             ...prev,
    //             team1: filterPlayer
    //         }))
    //         if (Captain.team1 === id) {
    //             setCaptain((prev) => ({
    //                 ...prev,
    //                 team1: ''
    //             }))
    //         }
    //         if (WicketKeeper.team1 === id) {
    //             setWicketKeeper((prev) => ({
    //                 ...prev,
    //                 team1: ''
    //             }))
    //         }
    //     } else if (activeTab === 2) {
    //         setSelectedPlayer((prev) => ({
    //             ...prev,
    //             team2: filterPlayer
    //         }))
    //         if (Captain.team2 === id) {
    //             setCaptain((prev) => ({
    //                 ...prev,
    //                 team2: ''
    //             }))
    //         }
    //         if (WicketKeeper.team2 === id) {
    //             setWicketKeeper((prev) => ({
    //                 ...prev,
    //                 team2: ''
    //             }))
    //         }
    //     }
    //     let timer = setTimeout(() => {
    //         setProcessing(false)
    //         setAlertModal({
    //             success: true,
    //             open: true,
    //             message: 'Player removed successfully'
    //         })
    //         return () => clearTimeout(timer)
    //     }, 1000);
    // }
    const handleRemovePlayer = () => {
        if (!deletedId || !teamKey) return;

        setProcessing(true);
        const id = deletedId;

        const filteredPlayers = selectedPlayer?.[teamKey]?.filter((item) => item !== id) || [];

        setSelectedPlayer((prev) => ({
            ...prev,
            [teamKey]: filteredPlayers
        }));
        setActiveSelectedPlayers((prev) => ({
            ...prev,
            [teamKey]: filteredPlayers
        }))
        if (Captain?.[teamKey] === id) {
            setCaptain((prev) => ({
                ...prev,
                [teamKey]: ''
            }));
        }

        if (WicketKeeper?.[teamKey] === id) {
            setWicketKeeper((prev) => ({
                ...prev,
                [teamKey]: ''
            }));
        }

        setSelectCwk((prev) => ({
            ...prev,
            [teamKey]: {
                ...prev[teamKey],
                captain: prev[teamKey]?.captain === id ? '' : prev[teamKey]?.captain,
                wicketKeeper: prev[teamKey]?.wicketKeeper === id ? '' : prev[teamKey]?.wicketKeeper
            }
        }));


        setTimeout(() => {
            setProcessing(false);
            setAlertModal({
                success: true,
                open: true,
                message: 'Player removed successfully'
            });
        }, 1000);
    };

    return (
        <Box sx={{ position: 'relative' }}>
            <Banner
                status={matchObj?.status ? matchObj?.status : ''}
                tossWinner={matchObj?.toss ? `${matchObj?.toss?.tossWinner === team1?.id ? team1?.team_name : team2?.team_name} wins the toss and decided to ${matchObj?.toss?.selectSide}` : ''}
                image1={team1?.team_logo ? `/${team1?.team_logo}` : null}
                image2={team2?.team_logo ? `/${team2?.team_logo}` : null}
                type={'scoring'}
                team1name={team1?.team_name}
                team1letter={team1?.letter}
                team1color={team1?.team_color}
                team2name={team2?.team_name}
                team2letter={team2?.letter}
                team2color={team2?.team_color}
            />
            <CommonBack onClick={handleBack} />
            <Box className={`player11_main_section`} >
                <CommonButton title={team1?.team_name} isActive={activeTab === 1 ? true : false} activeTab={activeTab} onClick={() => handleTeamsAction(1)} />
                <CommonButton title={team2?.team_name} isActive={activeTab === 2 ? true : false} activeTab={activeTab} onClick={() => handleTeamsAction(2)} />
            </Box>
            {<Box className='player11_playerselection_section'>
                <Typography variant="body2">Choose Your Team Player</Typography>
                <Box className='player11-gradient-line'></Box>
                <Box className='player11_playerselection_main_section'>
                    {playererr && <Box sx={{ display: 'flex', justifyContent: 'center' }}><Typography variant="p" className="player11_player_error_title">
                        {`${selectedTeamPlayers.length === 0 ? 'No' : `You have ${selectedTeamPlayers.length}`} ${selectedTeamPlayers.length === 0 ? 'players available' : selectedTeamPlayers.length === 1 ? 'player' : 'players'}. Please add ${perTeamPlayers - selectedTeamPlayers.length} more ${perTeamPlayers - selectedTeamPlayers.length === 1 ? 'player' : ' players'} before continue the selection.`}
                    </Typography></Box>}
                    {playererr &&
                        <Box className='player11_player_error_section'>
                            <CustomeButton
                                title={"Add Player"}
                                width={'100%'}
                                height={'54px'}
                                hover={'none'}
                                onClick={handleAddPlayer}
                            />
                        </Box>
                    }
                    <Box className={`player11_playerselection_sub_section ${activeSelectedPlayers[teamKey].length > 1 && 'active'}`}>
                        {!playererr && <Box className='player11_player_add_button' onClick={handleOpen}>
                            <Box className={`add_player_in_playing11`}>
                                <Box className='team_group_box'>
                                    <Box className='svgBox'>
                                        <SvgIcon id={'plus'} />
                                    </Box>
                                </Box>
                                <Typography variant="body2">Add</Typography>
                            </Box>
                        </Box>}
                        {
                            !playererr && activeSelectedPlayers[teamKey].length > 0 &&
                            [...activeSelectedPlayers[teamKey]]
                                .sort((a, b) => {
                                    const playerA = player_data?.data?.find((item) => item?.id === a);
                                    const playerB = player_data?.data?.find((item) => item?.id === b);
                                    const captain = selectCwk?.[teamKey].captain
                                    const wicketKeeper = selectCwk?.[teamKey].wicketKeeper
                                    const isCaptainA = captain === playerA?.id;
                                    const isCaptainB = captain === playerB?.id;
                                    const isWicketKeeperA = wicketKeeper === playerA?.id;
                                    const isWicketKeeperB = wicketKeeper === playerB?.id;
                                    if (isCaptainA && !isCaptainB) return -1;
                                    if (!isCaptainA && isCaptainB) return 1;
                                    if (isWicketKeeperA && !isWicketKeeperB) return -1;
                                    if (!isWicketKeeperA && isWicketKeeperB) return 1;

                                    return 0;
                                })
                                .map((items, i) => {
                                    const captain = selectCwk?.[teamKey].captain
                                    const wicketKeeper = selectCwk?.[teamKey].wicketKeeper
                                    const player = player_data?.data?.find((item) => item?.id === items);
                                    const isCaptain = captain === player?.id;
                                    const isWicketKeeper = wicketKeeper === player?.id;

                                    return (
                                        <Box key={i} className='player11_selected_players_section'>
                                            <Box className='player11_selected_players_image_section'>
                                                <Box className='player11_player_remove_main_section' onClick={() => handleMessageModalOpen(player?.id)}>
                                                    <Box className='player11_player_remove_section'>
                                                        <SvgIcon id={'minus'} />
                                                    </Box>
                                                </Box>
                                                <Box sx={{ cursor: 'pointer', height: '100%', width: '100%' }} onClick={handleOpen}>
                                                    {player?.playerImage && <Image style={{ borderRadius: '10px', overflow: 'hidden', zIndex: '-1' }} unoptimized src={`/${player?.playerImage}`} alt="playerimage" height={500} width={500} />}
                                                    {!player?.playerImage && <ImageAvatar bgColor={player?.playerColor} text={player?.letter} borderRadius={'10px'} />}
                                                </Box>
                                                <Box className='player11_selected_post_player_section'>
                                                    {isCaptain &&
                                                        <Box className='player11_selected_post_player'>
                                                            <Image unoptimized src={CaptainImage} alt="captain" height={500} width={500} />
                                                        </Box>
                                                    }
                                                    {isWicketKeeper &&
                                                        <Box className='player11_selected_post_player'>
                                                            <Image unoptimized src={WicketKeeperImage} alt="captain" height={500} width={500} />
                                                        </Box>
                                                    }
                                                </Box>
                                            </Box>
                                            <Typography variant="body2">{player?.playerName}</Typography>
                                        </Box>
                                    );
                                })
                        }
                    </Box>
                </Box>
            </Box>}
            <Box sx={{ marginTop: '10px' }}>
                <CustomeButton onClick={handleSubmit} title={playeravailableerror.team1playererror || playeravailableerror.team2playererror ? 'Next' : 'Submit'} width={'80%'} height={'50px'}
                    disabled={activeTab === 1 && !playeravailableerror.team1playererror ? false
                        : activeTab === 2 && !playeravailableerror.team2playererror ? false
                            : !playeravailableerror.bothteamerror ? false : true} />
            </Box>
            <Modal
                open={open}
                onClose={() => { }}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Box className='player11_close_button'>
                        <Close sx={{ color: 'var(--primary-color)', cursor: 'pointer' }} onClick={handleClose} />
                    </Box>
                    {err && <Typography sx={{ textAlign: 'center' }} className="errorText">{err}</Typography>}
                    <Box className='player11_players_section'>
                        {
                            selectedTeamPlayers.length > 0 && selectedTeamPlayers.map((items, i) => {
                                let isSelect = IsinCludes(items)
                                let isCap = IsCap(items)
                                let isWk = IsWk(items)

                                return (
                                    <Box key={i} className='player11_players_sub_section'>
                                        <Box className='player11_image_section'>
                                            {items?.playerImage && <Image unoptimized alt="playerimage" height={500} width={500} src={`/${items?.playerImage}`} />}
                                            {!items?.playerImage && <ImageAvatar bgColor={items?.playerColor} text={items?.letter} width={'100%'} height={'100%'} />}
                                        </Box>
                                        <Box className='player11_player_section'>
                                            <Box className='player11_player_name_section' onClick={(e) => handleCheckboxChange(e, items)}>
                                                <Typography variant="body2">{items?.playerName}</Typography>
                                                <Box className='player11_checkbox'>
                                                    {isSelect && <SvgIcon id={'trueIcon'} />}
                                                </Box>
                                            </Box>
                                            <Box className={`player11_post ${isSelect && 'active'}`}>
                                                <Box className={`player11_sub_post ${isCap && 'active'}`} onClick={(e) => handlePostCheck(e, items, 'cap')}>
                                                    <Box className={`player11_post_image ${isCap && 'active'}`}>
                                                        <Image unoptimized src={CaptainImage} alt="captain" height={500} width={500} />
                                                    </Box>
                                                    <Typography variant="body2">Captain</Typography>
                                                </Box>
                                                <Box className={`player11_sub_post ${isWk && 'active'}`} onClick={(e) => handlePostCheck(e, items, 'wk')}>
                                                    <Box className={`player11_post_image ${isWk && 'active'}`}>
                                                        <Image unoptimized src={WicketKeeperImage} alt="wk" height={1500} width={1500} />
                                                    </Box>
                                                    <Typography variant="body2">Wicket Keeper</Typography>
                                                </Box>
                                            </Box>
                                        </Box>
                                    </Box>
                                )
                            })
                        }
                    </Box>
                    <Box className='player11_confirm_button'>
                        <CustomeButton title={'Confirm'} width={'100%'} height={'50px'} onClick={handleConfirm} />
                    </Box>
                </Box>
            </Modal>
            <MessageModal
                open={alertModal?.open}
                handleClose={handleMessageModalClose}
                success={alertModal?.success}
                message={alertModal?.message}
                handleSubmit={handleRemovePlayer}
                processing={processing}
            />

            {/* <Box className='player11_title'>
                <Typography variant="body2">{CurrentStep === 1 ? `Select ${perTeamPlayers} Players of your Team` : 'Select Captain and Wicketkeeper'}</Typography>
            </Box>
            {playererr && <Box className='player11_player_error_section'>
                <CustomeButton
                    title={"Add Player"}
                    width={'100%'}
                    height={'54px'}
                    hover={'none'}
                    onClick={handleAddPlayer}
                />
            </Box>}
            {playererr && <Typography variant="body2" className="player11_player_error_title">Please Add More Players to Continue</Typography>}
            <Box className={`player11_max_height_section ${playererr ? 'erroractive' : (activeSelectedPalyers === perTeamPlayers) && CurrentStep === 1 ||
                CurrentStep === 2 && (activeTab === 1 ? WicketKeeper.team1 !== '' && Captain.team1 !== '' : WicketKeeper.team2 !== '' && Captain.team2 !== '')
                ? 'active' : ''}`}>
                {err && <Typography variant="body2" className="player11_player_error_title">{err}</Typography>}
                {CurrentStep === 1 && <CommonSection IsCap={IsCap} IsWk={IsWk} data={selectedTeamPlayers} IsinCludes={IsinCludes} teams={selectedPlayer} handleCheck={handleCheckboxChange} Step={CurrentStep} />}
                {CurrentStep === 2 && <CommonSection IsCap={IsCap} IsWk={IsWk} data={activeTab === 1 ? player_data?.data?.filter(player => selectedPlayer.team1.includes(player.id)) : player_data?.data?.filter(player => selectedPlayer.team2.includes(player.id))} IsinCludes={IsinCludes} Step={CurrentStep} handleCheck={handlePostCheck} />}
            </Box>
            {
                activeSelectedPalyers === perTeamPlayers && CurrentStep === 1 &&
                <Box className='player11_button_section'>
                    <CustomeButton
                        title={'Next'}
                        onClick={handleNext}
                        width={'100%'}
                    />
                </Box>
            }
            {
                // CurrentStep === 2 && ((WicketKeeper.team1 !== '' && Captain.team1 !== '' && activeTab === 1) || (WicketKeeper.team2 !== '' && Captain.team2 !== '' && activeTab === 2)) 
                CurrentStep === 2 && (activeTab === 1 ? WicketKeeper.team1 !== '' && Captain.team1 !== '' : WicketKeeper.team2 !== '' && Captain.team2 !== '')
                &&
                <Box className='player11_button_section'>
                    <CustomeButton
                        title={allDone ? 'Done' : 'Next'}
                        onClick={handleSubmit}
                        width={'100%'}
                    />
                </Box>
            } */}
        </Box>
    )
}

export default Player11;