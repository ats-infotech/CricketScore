'use client'
import { CheckTournamentIsRunning } from '@/components/common/commomFunction';
import CustomeButton from '@/components/common/commonUi/CustomeButton';
import CustomeMessageBox from '@/components/common/commonUi/CustomeMessageBox';
import CustomeModal from '@/components/common/commonUi/CustomeModal';
import Loader from '@/components/common/commonUi/Loader';
import MatchCard from '@/components/common/commonUi/MatchCard/MatchCard';
import MessageModal from '@/components/common/commonUi/Modal/MessageModal';
import { ChangeStatus, deleteMatchSchedule, MatchBreakSchedule, matchesState, ReplaceMatchSchedule } from '@/redux/slices/matchSlice';
import { tournamentState } from '@/redux/slices/tournamentSlice';
import { Box, Button, Typography } from '@mui/material';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CustomeTabs from '../../../components/common/commonUi/CustomeTabs';
import './Matches.css';

// const TeamScoreBox = React.memo(({ teamLogo, teamName, runs, wicket, overs, superover, soruns, sowicket, soovers, letter, color }) => {
//   return (
//     <Box className='TeamScoreBox'>
//       <Box className='teamLogo'>
//         {teamLogo && <Image src={`/${teamLogo}`} alt='logo' width={90} height={90} unoptimized />}
//         {!teamLogo && <ImageAvatar text={letter} bgColor={color} borderRadius={'10px'} height={'100%'} width={'100%'} />}
//       </Box>
//       <Box className='team_details'>
//         <Typography variant='body2' className='team_name'>{teamName}</Typography>
//         <Typography variant='body2' className='team_score'>
//           <span className='runs'>{runs} / {wicket}</span>
//           <span className='overs'>({overs} Ov)</span>
//         </Typography>
//         {superover &&
//           <Typography variant='body2' className='team_score'>
//             <span className='runs'>{soruns} / {sowicket}</span>
//             <span className='overs'>({soovers} Ov)</span>
//           </Typography>
//         }
//       </Box>
//     </Box>
//   )
// })

const tabKeys = [
  { label: 'Live', key_name: 'live' },
  { label: 'Upcoming', key_name: 'upcoming' },
  { label: 'Past', key_name: 'past' },
]

const RoundsName = [
  { title: 'League Match', key_name: 'league_match' },
  { title: 'Semi Final', key_name: 'semi_final' },
  { title: 'Final', key_name: 'final' },
]

const SelectScheduleType = [
  { title: 'Group Match', key_name: 'group_match' },
  { title: 'Manual Match', key_name: 'manual_match' },
]
const Matches = () => {
  const router = useRouter()
  const dispatch = useDispatch()
  const scheduleRef = useRef()
  const params = useParams()
  const match_data = useSelector(matchesState)
  const tournament_data = useSelector(tournamentState)

  const [matches, setMatches] = useState([])
  const [animation, setAnimation] = useState(false)
  const [openModal, setOpenModal] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [autoSelect, setAutoSelect] = useState(false)
  const [selectedRound, setSelectedRound] = useState('')
  const [scheduleType, setScheduleType] = useState('')
  const [anchorEl, setAnchorEl] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [matchId, setMatchId] = useState('')
  const [alertModal, setAlertModal] = useState({
    success: false,
    open: false,
    message: ''
  })
  const [processing, setProcessing] = useState(false)
  const [TournamentData, setTournamentData] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [activeModalTab, setActiveModalTab] = useState(0)
  const [shownModalData, setShownModalData] = useState([])
  const isPastTournament = CheckTournamentIsRunning(TournamentData?.tournament_start_date, TournamentData?.tournament_end_date) === 'completed'

  useEffect(() => {
    const filterTournament = tournament_data?.data?.find((items) => items?.id === params?.id)
    setTournamentData(filterTournament)
  }, [tournament_data])

  useEffect(() => {
    setShownModalData(activeModalTab === 0 ? RoundsName : SelectScheduleType)
  }, [activeModalTab]);
  const handleOpen = () => {
    setOpenModal(true)
    setAutoSelect(false)
  }
  const handleClose = () => {
    setOpenModal(false)
    setSelectedRound('')
    setError('')
    setSelectedRound('')
    setScheduleType('')
    sessionStorage.removeItem(selectedRound)
    sessionStorage.removeItem(scheduleType)
    setActiveModalTab(0)
  }

  const handleClick = (event, item) => {
    setAnchorEl(event.currentTarget);
    setSelectedItem(item)
  };

  const handleClosed = () => {
    setAnchorEl(null);
    setSelectedItem(null)
  };

  const handleModalClose = () => {
    setAlertModal({
      open: false,
      message: '',
      success: false,
    })
    setMatchId('')
  }

  const handleDeleteMatchInfo = (data) => {
    setMatchId(data?.id)
    setAlertModal({
      success: false,
      open: true,
      message: 'Are you sure want to Delete This Match ?'
    })
  }

  const handleDeleteMatch = async () => {
    setProcessing(true)
    if (matchId) {
      let res = await dispatch(deleteMatchSchedule({ matchId }));
      if (res) {
        let timer = setTimeout(() => {
          setProcessing(false)
          setAlertModal({
            success: true,
            open: true,
            message: 'Match Deleted SuccessFully'
          })
          return () => clearTimeout(timer)
        }, 2000);
      }
    }
  };

  const handleEvent = (item, action) => {
    switch (action) {
      case 'edit':
        router.push(`/edit-match/${item?.id}`)
        break;
      case 'delete':
        handleDeleteMatchInfo(item)
        break;
      default:
        break;
    }
  }

  const handleMenuItemClick = (action) => {
    if (selectedItem) {
      handleEvent(selectedItem, action)
    }
    handleClosed();
  };

  useEffect(() => {
    setLoading(true)
    if (isPastTournament) {
      setActiveTab(2)
    }
    let statusFilter = activeTab === 0 ? [3] : [1, 2]
    let currentTournamentMatches = match_data?.data?.filter((items) => items?.tournamentId === TournamentData?.id)
    let matchesFilter = currentTournamentMatches?.filter((item) => statusFilter.includes(item?.status));
    let FinalResult = isPastTournament ? currentTournamentMatches : matchesFilter
    setMatches(FinalResult || [])
    let timer = setTimeout(() => {
      setLoading(false)
      return () => clearTimeout(timer)
    }, 1000);
  }, [match_data?.data, TournamentData]);


  useEffect(() => {
    const mainContainer = document.getElementById("mainContainer");
    if (!mainContainer) return
    const handleScroll = () => {
      const tabElement = document.getElementById("tab-list");
      const subTabsElement = document.getElementById("sub-tab-list");
      const scheduleButton = scheduleRef.current
      if (!tabElement || !subTabsElement || !scheduleButton) return;
      const tabTop = tabElement.getBoundingClientRect().top;
      if (tabTop <= 0) {
        if (tabElement.classList.contains("sticky-tab-list") && subTabsElement.classList.contains("stickySubTabList")) {
          scheduleButton.classList.add("schedulwButtonFixed");
          scheduleButton.style.top = (tabElement.offsetHeight + subTabsElement.offsetHeight) + 'px'
        }
      } else {
        scheduleButton.classList.remove("schedulwButtonFixed");
        scheduleButton.style = ''
      }
    }
    mainContainer.addEventListener("scroll", handleScroll);
    return () => mainContainer.removeEventListener("scroll", handleScroll);
  }, []);

  const handleTabClick = (val) => {
    setAnimation(true)
    let matchesFilter;
    let currentTournamentMatches = match_data?.data?.filter((items) => items?.tournamentId === TournamentData?.id)
    switch (val) {
      case 0:
        matchesFilter = currentTournamentMatches?.filter((item) => item?.status === 3);
        break;
      case 1:
        matchesFilter = currentTournamentMatches?.filter((item) => item?.status === 1 || item?.status === 2);
        break;
      case 2:
        matchesFilter = currentTournamentMatches?.filter((item) => item?.status === 4);
        break;
      default:
        break;
    }
    setMatches(matchesFilter || [])
    setActiveTab(val)
    let timer = setTimeout(() => setAnimation(false), 500);
    return () => clearTimeout(timer)
  }

  const handleModalTab = (val) => {
    if (selectedRound && activeModalTab === 0) {
      setActiveModalTab(1)
    } else if (scheduleType && activeModalTab === 1) {
      if (selectedRound) {
        sessionStorage.setItem('selectedRound', selectedRound)
        sessionStorage.setItem('scheduleType', scheduleType)
        if (scheduleType === 'group_match') {
          return `/matchgroup/${TournamentData?.id}`
        } else {
          return `/creatematch/${TournamentData?.id}`
        }
      }
    } else {
      setError(activeModalTab === 0 ? 'Select Match Type' : 'Select Match Schedule Type')
    }
  }

  const handleRedirect = (val) => {
    let navigation = null;
    localStorage.setItem('addTeamFromGroup', JSON.stringify(false))
    if (val === 'manual_schedule_match' || val === 'auto_match') {
      sessionStorage.setItem('matchMaking', val)
      setAutoSelect(true)
    } else {
      const matchmaking = sessionStorage.getItem('matchMaking')
      if (matchmaking === 'manual_schedule_match') {
        navigation = handleModalTab(val)
      } else {
        if (selectedRound) {
          sessionStorage.setItem('selectedRound', selectedRound)
          navigation = `/matchgroup/${TournamentData?.id}`
          // navigation = `/automatchschedule/${TournamentData?.id}`
        }
      }
    }
    if (navigation) {
      router.push(navigation)
    }
  }

  const handleStartMatch = async (matchId) => {
    let navigation = null;
    const matchStart = match_data?.data?.find((item, i) => item.id === matchId)
    if (matchStart?.stumps !== undefined && matchStart?.stumps === 0) {
      const createNewObj = {
        ...matchStart,
        stumps: 1
      }
      await dispatch(ReplaceMatchSchedule(createNewObj))
    }
    if (matchStart && !isPastTournament) {
      if (!matchStart?.toss || !matchStart?.toss?.selectSide) {
        navigation = `/toss/${matchId}`
        if (matchStart?.status === 1) {
          const createNewObj = {
            id: matchStart?.id,
            status: 2
          };
          await dispatch(ChangeStatus(createNewObj));
        }
      } else if (matchStart?.status === 4) {
        navigation = `/match/${matchId}/summary`
      } else if (matchStart?.selectedPlayer === undefined || matchStart?.post === undefined) {
        navigation = `/player11/${matchId}`
      } else if (matchStart?.status !== 4 && (matchStart?.playerselection === undefined || (matchStart?.playerselection?.striker === '' && matchStart?.playerselection?.nonStriker === '') || matchStart?.playerselection?.bowler === '')) {
        navigation = `/playerboard/${matchId}`
      } else if ((matchStart?.playerselection?.striker !== '' || matchStart?.playerselection?.nonStriker !== '' || matchStart?.playerselection?.bowler !== '') && matchStart?.status !== 4) {
        if (matchStart?.breaktype) {
          const payload = {
            id: matchId,
            breaktype: ''
          }
          let res = await dispatch(MatchBreakSchedule(payload))
          if (res) {
            navigation = `/scoreboard/${matchId}`
          }
        } else {
          navigation = `/scoreboard/${matchId}`
        }
      }

      if (navigation) {
        router.push(navigation)
      }
    }
  }

  const handleSelectRound = (val) => {
    if (activeModalTab === 0) {
      setSelectedRound(val)
    } else {
      setScheduleType(val)
    }
    setError('')
  }

  // const getMatchButtonTitle = () => {
  //   let obj = {
  //     0: 'Resume Match',
  //     1: 'Start Match',
  //     2: 'Show Stats',
  //   }
  //   return obj[activeTab]
  // }

  // const formatDate = (date) => {
  //   return new Date(date).toLocaleString("en-US", {
  //     weekday: "long",
  //     year: "numeric",
  //     month: "long",
  //     day: "numeric",
  //     hour: "2-digit",
  //     minute: "2-digit",
  //     hour12: true,
  //   });
  // };

  // const getWinnerMessage = (item) => {
  //   let winner;
  //   if (item?.matchWinner === item?.superOverSecondInnings?.battingside && item?.currentInnings === 4) {
  //     const balls = item?.superOverSecondInnings?.Currentover?.[0].legalBall || 0;
  //     const winningballs = 6 - balls;
  //     winner = `${item?.matchWinner} won superover (${winningballs} balls left)`;
  //   } else if (item?.matchWinner !== item?.superOverSecondInnings?.battingside && item?.currentInnings === 4) {
  //     const winningruns = item?.superOverFirstInnings?.Currentover?.[0]?.runs - item?.superOverSecondInnings?.Currentover?.[0]?.runs;
  //     winner = `${item?.matchWinner} won superover by ${winningruns} runs`;
  //   } else if (item?.matchWinner === item?.secondInnings?.battingside && item?.currentInnings === 2) {
  //     const balls = item?.secondInnings?.Currentover?.[0].legalBall === 6 ? 0 : item?.secondInnings?.Currentover?.[0].legalBall || 0;
  //     const overs = item?.secondInnings?.Currentover?.[0].legalBall === 6 ? item?.secondInnings?.Completedovers?.length : item?.secondInnings?.Completedovers?.length - 1;
  //     const totalovers = parseInt(item?.totalovers) - overs;
  //     const winningballs = totalovers === 0 ? 0 : (totalovers * 6) - balls;
  //     const totalWickets = parseInt(item?.perteamplayers) - item?.secondInnings?.Currentover?.[0]?.wicket;
  //     winner = `${item?.matchWinner} won by ${totalWickets} wickets (${winningballs} balls left)`;
  //   } else if (item?.matchWinner !== item?.secondInnings?.battingside && item?.currentInnings === 2) {
  //     const winningruns = item?.firstInnings?.Currentover?.[0]?.runs - item?.secondInnings?.Currentover?.[0]?.runs;
  //     winner = `${item?.matchWinner} won by ${winningruns} runs`;
  //   } else {
  //     winner = 'Match Tied';
  //   }
  //   return winner;
  // };

  if (loading && !processing) return <Loader />

  return (
    <Box className='matches_main activeAnimation'>
      {
        !isPastTournament &&
        <CustomeTabs data={tabKeys || []} onClick={handleTabClick} activeTab={activeTab} />
      }
      <Box className={`message_box_section ${matches.length === 0 ? 'activeHeight' : ''}`}>
        <Box className={`message_box_main`}>
          {!loading && matches.length === 0 && <CustomeMessageBox icon='batsman2' title='Match Guide'
            describe='Quickly start or schedule matches with ease. Get personalized suggestions based on your preferences'
          >
            <CustomeButton width={'100%'} height={'45px'} bgColor={'var(--primary-color) !important'} hover='none' title='Schedule Match' onClick={handleOpen} />
          </CustomeMessageBox>
          }
          {
            !isPastTournament && matches.length > 0 &&
            <Box className='schedule_button' id='schedule-button' ref={scheduleRef}>
              <CustomeButton width={'80%'} height={'45px'} bgColor={'var(--primary-color) !important'} hover='none' title='Schedule Match' onClick={handleOpen} />
            </Box>
          }
        </Box>
      </Box>
      <MatchCard
        matches={matches}
        isPastTournament={isPastTournament}
        animation={animation}
        tournamentData={TournamentData}
        isAdmin={true}
        activeTab={activeTab}
        anchorEl={anchorEl}
        handleClosed={handleClosed}
        handleStartMatch={handleStartMatch}
        handleMenuItemClick={handleMenuItemClick}
        handleMenuClick={handleClick}
      />
      {/* {
        matches.length > 0 &&
        <Box className={`all_matched ${animation ? 'activeAnimation' : ''} ${isPastTournament ? 'isPastTournament' : ''}`}>
          {
            matches
              .sort((a, b) => new Date(b?.datetime || b?.match_start_time) - new Date(a?.datetime || a?.match_start_time))
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
                let matchwon = item?.matchWinner;

                let getInningsStats = (innings, battingSide, completedOvers, isSuperOver = false, currentInnings) => {
                  if (!innings) return { runs: 0, wicket: 0, ball: 0, over: 0 };

                  let currentPlayingInnings = item?.currentInnings === currentInnings;
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
                let matchLocation = `${TournamentData?.ground}, ${TournamentData?.city} ${TournamentData?.match_type === "Test Match" ? '' : `| ${overs ?? 0} Ov.`}`
                let matchType = `${TournamentData?.tournament_format} Matches`
                let isButtonShow = (activeTab === 2 && isPastTournament && item.status !== 4) || (activeTab === 2 && item.status !== 4);
                let isStumps = item?.stumps !== undefined && item?.stumps === 0 ? true : false
                let isBreakStart = breakType?.find(type => type?.key_name === item?.breaktype)?.title || ''

                return (
                  <React.Fragment key={i}>
                    {item?.tournamentId === TournamentData?.id && <Box className='match_card' >
                      {item?.status < 3 && <Box sx={{ position: 'absolute', right: '10px', }}>
                        <IconButton onClick={(e) => handleClick(e, item)} aria-controls="simple-menu" aria-haspopup="true" className='match-menu-icon-box' sx={{ padding: '0px !important' }}>
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
                      {isStumps && <Typography variant='body2' className='match_location'>Stumps</Typography>}
                      {item?.status === 4 && <Typography variant='body2' className={`match_type ${item?.matchWinner ? 'winner' : 'tied'}`}>{item?.matchWinner ? `${winner}` : 'Match Tied'}</Typography>}
                      {isBreakStart && <Typography variant='body2' className='match_location break'>{isBreakStart}</Typography>}
                      <Box className='row'>
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
                      {/* {!isButtonShow && <Box className='linear-gradiant'></Box>} 
                      <Box className={`${isButtonShow ? 'd-none' : 'start_match_box'}`}>
                        <CustomeButton bgColor={'var(--primary-color) !important'} title={getMatchButtonTitle()} width={'180px'} height={'44px'} onClick={() => handleStartMatch(item?.id)} />
                      </Box>
                    </Box>}
                  </React.Fragment>
                )
              })
          }
        </Box>
      } */}

      <MessageModal
        open={alertModal?.open}
        handleClose={handleModalClose}
        success={alertModal?.success}
        message={alertModal?.message}
        handleSubmit={handleDeleteMatch}
        processing={processing}
      />

      <CustomeModal open={openModal} onClose={handleClose} >
        {
          autoSelect ?
            <>
              <Box className='RoundSelectionBox'>
                <Typography variant='body2' className='errorText' sx={{ textAlign: 'center' }}>{error}</Typography>
                {
                  shownModalData.length > 0 && shownModalData.map((item) => {
                    return (
                      <Button variant='outlined' className={`SelectionButton ${(activeModalTab === 0 ? selectedRound : scheduleType) === item?.key_name ? 'active' : ''}`} key={item?.key_name} onClick={() => handleSelectRound(item?.key_name)}>{item?.title}</Button>
                    )
                  })
                }
                <CustomeButton width={'100%'} height={'45px'} bgColor={'var(--text-white)'} hoverbg={'var(--text-white)'} hovertext={'var(--primary-color)'} color={'var(--primary-color)'} title='Next' onClick={() => handleRedirect('next_auto_match')} />
              </Box>
            </>
            :
            <Box className='showButtonBox'>
              <CustomeButton width={'100%'} height={'45px'} bgColor={'var(--secondary-color)'} title='Schedule Match' onClick={() => handleRedirect('manual_schedule_match')} />
              <CustomeButton width={'100%'} height={'45px'} bgColor={'var(--text-white)'} color={'var(--primary-color)'} title='Auto Schedule Match' onClick={() => handleRedirect('auto_match')} />
            </Box>
        }
      </CustomeModal>
    </Box>
  )
}

export default Matches