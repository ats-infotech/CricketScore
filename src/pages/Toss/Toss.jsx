'use client'
import SvgIcon from "@/assets/icons/SvgIcon"
import CustomeBack from "@/components/common/commonUi/CustomeBack"
import CustomeButton from "@/components/common/commonUi/CustomeButton"
import { SwipeUpDrawer } from "@/components/common/commonUi/CustomeCommon"
import { ImageBox, TeamSelection } from "@/components/common/commonUi/CustomeSelectionSquareBox"
import Loader from "@/components/common/commonUi/Loader"
import { matchesState, ReplaceMatchSchedule } from "@/redux/slices/matchSlice"
import { Box, Typography, useMediaQuery } from "@mui/material"
import Image from "next/image"
import { useParams, useRouter } from "next/navigation"
import { useCallback, useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import batting from '../../assets/img/toss/batting.png'
import bowling from '../../assets/img/toss/bowling.png'
import flipgif from '../../assets/img/toss/flipcoin.gif'
import flipcoin from '../../assets/img/toss/flipcoin.png'
import headgif from '../../assets/img/toss/Head.gif'
import headcoin from '../../assets/img/toss/Head.png'
import leftfireworkgif from '../../assets/img/toss/leftfirework.gif'
import fireworkgif from '../../assets/img/toss/rightfirework.gif'
import tailgif from '../../assets/img/toss/Tail.gif'
import tailcoin from '../../assets/img/toss/Tail.png'
import './Toss.css'
import { teamsState } from "@/redux/slices/teamSlice"

const Toss = () => {
    const params = useParams()
    const [match, setMatch] = useState([])
    const [teams, setTeams] = useState([])
    const [tossStep, setTossStep] = useState(0)
    const [tossTeams, setTossTeams] = useState({
        team1: '',
        team2: ''
    })
    const [tossSelectionTeam, setTossSelectionTeam] = useState({});
    const [batBallSelection, setBatBallSelection] = useState(null);
    const [tossWinner, setTossWinner] = useState('')
    const [selectedToss, setSelectedToss] = useState('')
    const [openModal, setOpenModal] = useState(false)
    const [gif, setGif] = useState({
        toss: false,
        result: false,
        firework: false
    })
    const [side, setSide] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)
    const hasRunRef = useRef(false);
    const team_data = useSelector(teamsState)
    const match_data = useSelector(matchesState)
    const dispatch = useDispatch()
    const router = useRouter()
    const sm = useMediaQuery('(max-width: 350px)')
    const md = useMediaQuery('(max-width: 380px)')
    const lg = useMediaQuery('(max-width: 410px)')

    const tossTimerRef = useRef(null);
    const resultTimerRef = useRef(null);
    const fireworkTimerRef = useRef(null);

    useEffect(() => {
        return () => {
            clearTimeout(tossTimerRef.current);
            clearTimeout(resultTimerRef.current);
            clearTimeout(fireworkTimerRef.current);
        };
    }, []);

    useEffect(() => {
        if (!match_data?.data) return;
        // setLoading(true);
        const matchById = match_data.data.find(item => item.id === params.matchId);
        let team1 = team_data?.data?.find((items) => items?.id === matchById?.team1?.id)
        let team2 = team_data?.data?.find((items) => items?.id === matchById?.team2?.id)
        if (matchById) {
            setTeams([team1, team2]);
            setMatch(matchById);
        }
        // setLoading(false);
    }, [params.matchId, match_data]);

    const toggleDrawer = useCallback((newOpen) => {
        setOpenModal(newOpen);
        setTossStep(0);
        setTossWinner('');
        setTossSelectionTeam(prev => (Object.keys(prev).length ? {} : prev));
        setSelectedToss(prev => (prev ? '' : prev));
        setBatBallSelection(prev => (prev ? null : prev));
    }, []);

    const handleTeamTossSlection = (id, index) => {
        setTossSelectionTeam(prev => ({
            ...prev,
            teamId: id,
            teamIndex: index
        }))
        setOpenModal(true)
    }

    const handleBatBallSelection = (selection) => {
        setBatBallSelection(selection);
        // const updatedMatch = { ...match, toss: { ...match.toss, selectSide: selection } };
    };

    useEffect(() => {
        if (tossWinner && batBallSelection) {
            setTimeout(() => {
                const scrollToBottom = document.querySelector('.toss_main_section');
                if (scrollToBottom) {
                    scrollToBottom.scrollTo({
                        top: scrollToBottom.scrollHeight,
                        behavior: 'smooth',
                    });
                }
            }, 100);
        }
    }, [tossWinner, batBallSelection])

    useEffect(() => {
        setLoading(true)
        if (loading && !match?.id) {
            router.push('/custom404');
        } else if (match?.toss?.selectSide && match?.id) {
            router.push(`/player11/${match?.id}`);
        } else if (loading || match?.id) {
            setLoading(false)
        }
        hasRunRef.current = true

    }, [loading, match, router]);

    useEffect(() => {
        if (match?.toss?.tossWinner !== '' && match?.toss?.tossWinner && !match?.toss?.selectSide && tossStep === 0) {
            setTossStep(2)
            const winnerTeam = match?.team1?.id === match?.toss?.tossWinner ? teams[0] : match?.team2?.id === match?.toss?.tossWinner ? teams[1] : ''
            setTossWinner(winnerTeam)
            setGif((prev) => ({
                ...prev,
                firework: true
            }))
            const FireTimer = setTimeout(() => {
                setGif((prev) => ({
                    ...prev,
                    firework: false
                }))
            }, 2000);
            return () => {
                clearTimeout(FireTimer)
            }
        }
    }, [match?.toss?.tossWinner])

    // const handleTossSelection = (toss) => {
    //     let key = tossSelectionTeam?.teamIndex === 0 ? 'team1' : 'team2';
    //     setTossTeams(prev => ({
    //         ...prev,
    //         [key]: toss,
    //     }));
    //     const oppositeToss = toss === 'Head' ? 'Tail' : 'Head';
    //     const oppositeKey = key === 'team1' ? 'team2' : 'team1';
    //     setTossTeams(prev => ({
    //         ...prev,
    //         [oppositeKey]: oppositeToss,
    //     }));
    //     setSelectedToss(toss);
    // }

    const handleTossSelection = useCallback((toss) => {
        let key = tossSelectionTeam?.teamIndex === 0 ? 'team1' : 'team2';
        setTossTeams(prev => ({
            ...prev,
            [key]: toss,
        }));

        const oppositeToss = toss === 'Head' ? 'Tail' : 'Head';
        const oppositeKey = key === 'team1' ? 'team2' : 'team1';

        setTossTeams(prev => ({
            ...prev,
            [oppositeKey]: oppositeToss,
        }));

        setSelectedToss(toss);
    }, [tossSelectionTeam]);

    const handleStepZero = () => {
        setTossStep(1);
    };

    // const handleStepOne = () => {
    //     const coinFlip = Math.floor(Math.random() * 100000);
    //     const winningSide = coinFlip % 2 === 0 ? "Head" : "Tail";
    //     setSide(winningSide);
    //     if (tossTeams?.team1 === winningSide) {
    //         setTossWinner(teams[0]);
    //         const createNewObj = {
    //             ...match,
    //             toss: {
    //                 tossWinner: teams[0]?.id,
    //             }
    //         }
    //         dispatch(ReplaceMatchSchedule(createNewObj))
    //     } else if (tossTeams?.team2 === winningSide) {
    //         setTossWinner(teams[1]);
    //         const createNewObj = {
    //             ...match,
    //             toss: {
    //                 tossWinner: teams[1]?.id,
    //             }
    //         }
    //         dispatch(ReplaceMatchSchedule(createNewObj))
    //     }
    //     setGif((prev) => ({
    //         ...prev,
    //         toss: true
    //     }))
    //     const tossTimer = setTimeout(() => {
    //         setGif((prev) => ({
    //             ...prev,
    //             toss: false,
    //             result: true
    //         }))
    //         setOpenModal(false);
    //         setTossStep(2);
    //     }, 600);
    //     const resultTimer = setTimeout(() => {
    //         setGif((prev) => ({
    //             ...prev,
    //             result: false
    //         }))
    //         setOpenModal(true);
    //     }, 3000);
    //     return () => {
    //         clearTimeout(tossTimer);
    //         clearTimeout(resultTimer);
    //     };
    // };

    const handleStepOne = () => {
        const coinFlip = Math.floor(Math.random() * 100);
        const winningSide = coinFlip % 2 === 0 ? "Head" : "Tail";
        const winner = tossTeams.team1 === winningSide ? teams[0] : tossTeams.team2 === winningSide ? teams[1] : '';
        setSide(winningSide);
        setTossWinner(winner);
        dispatch(ReplaceMatchSchedule({ ...match, toss: { tossWinner: winner?.id } }));

        setGif(prev => ({ ...prev, toss: true }));
        tossTimerRef.current = setTimeout(() => {
            setGif(prev => ({ ...prev, toss: false, result: true }));
            setOpenModal(false);
            setTossStep(2);
        }, 600);

        resultTimerRef.current = setTimeout(() => {
            setGif(prev => ({ ...prev, result: false, firework: true }));
        }, 3000);
        fireworkTimerRef.current = setTimeout(() => {
            setGif(prev => ({ ...prev, firework: false }));
        }, 6000);
    };

    // const handleStepTwo = () => {
    //     setTossStep(3);
    //     setOpenModal(false);
    //     setGif((prev) => ({
    //         ...prev,
    //         firework: true
    //     }))
    //     const FireTimer = setTimeout(() => {
    //         setGif((prev) => ({
    //             ...prev,
    //             firework: false
    //         }))
    //     }, 2000);
    //     return () => {
    //         clearTimeout(FireTimer)
    //     }
    // };

    // const handleStepTwo = () => {
    //     setTossStep(3);
    //     setOpenModal(false);
    //     setGif(prev => ({ ...prev, firework: true }));
    //     fireworkTimerRef.current = setTimeout(() => {
    //         setGif(prev => ({ ...prev, firework: false }));
    //     }, 2000);
    // };


    const handleToss = () => {
        switch (tossStep) {
            case 0:
                selectedToss && handleStepZero();
                break;
            case 1:
                handleStepOne();
                break;
            // case 2:
            //     handleStepTwo();
            //     break;
            default:
                console.warn('Unexpected tossStep:', tossStep);
        }
    };

    const handleMatchTossData = () => {
        if (batBallSelection) {
            const createNewObj = {
                ...match,
                toss: {
                    tossWinner: tossWinner?.id,
                    selectSide: batBallSelection
                }
            }
            dispatch(ReplaceMatchSchedule(createNewObj))
            router.push(`/player11/${match?.id}`)
        } else {
            setError(true)
        }
    }

    const handleRetoss = () => {
        setTossStep(0)
        dispatch(ReplaceMatchSchedule({ ...match, toss: { tossWinner: '' } }));
        setTossWinner('')
        setTossSelectionTeam(prev => (Object.keys(prev).length ? {} : prev));
        setSelectedToss(prev => (prev ? '' : prev));
        setBatBallSelection(prev => (prev ? null : prev));
    }

    // if (!loading && !match?.id) return <Custom404 />
    // if (match?.toss?.selectSide) return router.push(`http://localhost:3000/player11/${match?.id}`)

    const renderCoinFlip = () => {
        if (!gif.result || side === '') return null;
        return (
            <Box className='coin_flip_main_section'>
                <Box className='coin_flip_section'>
                    <Box className='coin_flip'>
                        <Image unoptimized width={1000} height={1000} src={side === 'Head' ? headgif : tailgif} alt="gif" />
                    </Box>
                </Box>
            </Box>
        );
    };

    return (
        <>
            {loading ? <Loader /> : <Box className='toss_section'>
                {renderCoinFlip()}
                <Box sx={{ padding: '20px 20px 0px 20px' }}>
                    <CustomeBack title={tossStep < 2 && 'Choose one team for toss'} />
                </Box>
                <Box className='toss_main_section'>
                    <Box className='toss_team_section' sx={{ padding: !tossWinner ? '20px 0' : '0', height: !openModal && !tossWinner ? '100%' : openModal && tossWinner ? '50%' : 'auto', gap: !openModal ? '100px' : '50px' }}>
                        {!tossWinner &&
                            teams?.length > 0 && teams?.map((item, i) => {
                                const isWinner = tossWinner?.id === item?.id;
                                const isSelected = tossSelectionTeam?.teamId === item?.id;
                                return (
                                    <Box key={i}>
                                        <TeamSelection
                                            src={item?.team_logo ? `/${item?.team_logo}` : null}
                                            letter={item?.letter}
                                            color={item?.team_color}
                                            className={isSelected || isWinner ? 'select_active_side_card' : 'select_side_card'}
                                            name={item?.team_name}
                                            isActive={tossWinner ? isWinner : isSelected}
                                            onClick={() => handleTeamTossSlection(item?.id, i)}
                                        />
                                    </Box>
                                )
                            })
                        }
                        {gif.firework && !gif.result && !gif.toss &&
                            <Box sx={{ position: 'absolute', display: 'flex', top: 0 }}>
                                <Box>
                                    <Box sx={{ height: '150px', width: '250px' }}>
                                        <Image unoptimized src={leftfireworkgif} alt="gif" height={500} width={500} />
                                    </Box>
                                    <Box sx={{ height: '150px', width: '250px' }}>
                                        <Image unoptimized src={leftfireworkgif} alt="gif" height={500} width={500} />
                                    </Box>
                                </Box>
                                <Box>
                                    <Box sx={{ height: '150px', width: '250px' }}>
                                        <Image unoptimized src={fireworkgif} alt="gif" height={500} width={500} />
                                    </Box>
                                    <Box sx={{ height: '150px', width: '250px' }}>
                                        <Image unoptimized src={fireworkgif} alt="gif" height={500} width={500} />
                                    </Box>
                                </Box>
                            </Box>
                        }
                        {
                            tossWinner && !gif.result && !gif.toss &&
                            <Box className='toss_winner_team_section'>
                                {tossStep === 2 && <SvgIcon id={'winner'} height={34} width={34} />}
                                <TeamSelection height={tossStep !== 3 ? 130 : sm ? 160 : 178} width={tossStep !== 3 ? 130 : sm ? 160 : 178}
                                    imgheight={tossStep !== 3 ? 90 : sm ? 110 : 128} imgwidth={tossStep !== 3 ? 90 : sm ? 110 : 128}
                                    letter={tossWinner?.letter} color={tossWinner?.team_color} src={tossWinner?.team_logo ? `/${tossWinner?.team_logo}` : null}
                                    name={tossWinner?.team_name} isActive={true} className={'select_active_side_card'} />
                            </Box>
                        }
                    </Box>
                    {tossWinner && !gif.result && !gif.toss &&
                        <>
                            <Box className='select_side_section'>
                                <Typography variant="body2">{`${tossWinner?.team_name} wins the toss and elected to ${batBallSelection ? batBallSelection : '?'}`}</Typography>
                                {error && !batBallSelection && <Typography variant="p" className="errorText">Please select any one side</Typography>}
                                <Box className={`select_side_card_section ${error && !batBallSelection && 'error'}`}>
                                    <TeamSelection height={sm ? 110 : md ? 130 : lg ? 140 : 150} width={sm ? 110 : md ? 130 : lg ? 140 : 150} imgheight={sm ? 75 : md ? 85 : 100} imgwidth={sm ? 75 : md ? 85 : 100} className={batBallSelection === 'Bat' ? 'select_active_side_card' : 'select_side_card'} src={batting} name={'Bat'} onClick={() => handleBatBallSelection('Bat')} isActive={batBallSelection === 'Bat'} />
                                    <TeamSelection height={sm ? 110 : md ? 130 : lg ? 140 : 150} width={sm ? 110 : md ? 130 : lg ? 140 : 150} imgheight={sm ? 75 : md ? 85 : 100} imgwidth={sm ? 75 : md ? 85 : 100} src={bowling} className={batBallSelection === 'Bowl' ? 'select_active_side_card' : 'select_side_card'} name={'Bowl'} onClick={() => handleBatBallSelection('Bowl')} isActive={batBallSelection === 'Bowl'} />
                                </Box>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'center', padding: '0px 30px 20px 30px' }}>
                                <CustomeButton border={'1px solid var(--primary-color)'} title={'Retoss'}
                                    width={'100%'} bgColor={'var(--text-white)'} color={'var(--primary-color)'}
                                    hoverbg={'var(--primary-color)'} hovertext={'var(--text-white)'}
                                    onClick={handleRetoss}
                                />
                            </Box>
                            <Box sx={{ padding: '0px 30px 20px 30px' }}>
                                <CustomeButton title={`Let's Play`} width={'100%'} bgColor={'var(--blue-background)'} onClick={handleMatchTossData} />
                            </Box>
                        </>
                    }
                </Box>
                {
                    openModal &&
                    <SwipeUpDrawer
                        anchor="bottom"
                        open={openModal}
                        onClose={tossStep === 1 ? handleToss : () => toggleDrawer(false)}
                        // onOpen={() => toggleDrawer(false)}
                        closeIconShow={tossStep === 1}
                        backgroundColor={'var(--box-blue)'}
                        sx={{
                            '& .MuiDrawer-paper': {
                                borderRadius: '40px 40px 0 0',
                                padding: '40px 0 30px 0',
                            }
                        }}
                    >
                        <>
                            <Box className='side_selection_title'>
                                {/* <Typography variant="body2">{tossStep === 0 ? 'Choose Your Side' : tossStep === 1 ? 'Tap the Toss' : 'Tap the Continue'}</Typography> */}
                                <Typography variant="body2">{tossStep === 0 ? 'Choose Your Side' : tossStep === 1 ? '' : 'Tap the Continue'}</Typography>
                            </Box>
                            {tossStep === 0 ?
                                <Box className='side_selection_section'>
                                    <ImageBox src={headcoin} title={'Head'} onClick={() => handleTossSelection('Head')} isActive={selectedToss === 'Head'} />
                                    <ImageBox src={tailcoin} title={'Tail'} onClick={() => handleTossSelection('Tail')} isActive={selectedToss === 'Tail'} />
                                </Box>
                                :
                                <Box className='side_selection_section'>
                                    {gif.toss ? <ImageBox height={170} width={170} src={flipgif} /> : tossStep === 2 ? <ImageBox height={120} width={120} src={side === 'Head' ? headcoin : side === 'Tail' ? tailcoin : ''} /> : <ImageBox height={170} width={170} src={flipcoin} />}
                                </Box>
                            }
                            <Box className='side_selection_button_section'>
                                <CustomeButton
                                    onClick={handleToss}
                                    title={tossStep === 0 ? 'Next' : tossStep === 1 ? 'Toss' : 'Continue'}
                                    bgColor={'var(--primary-color)'}
                                    width={'180px'}
                                    height={'46px'}
                                    disabled={!selectedToss && tossStep === 0}
                                />
                            </Box>
                        </>
                    </SwipeUpDrawer>
                }
            </Box>}
        </>
    )
}

export default Toss