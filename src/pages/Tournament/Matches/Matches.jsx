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

  if (loading && !processing) return <Loader />

  return (
    <Box className='matches_main'>
      {
        !isPastTournament &&
        <CustomeTabs data={tabKeys || []} onClick={handleTabClick} activeTab={activeTab} />
      }
      <Box className={`message_box_section ${matches.length === 0 ? 'activeHeight' : ''}`}>
        <Box className={`message_box_main`}>
          {!loading && matches.length === 0 && <CustomeMessageBox icon='batsman2' title='Match Guide'
            describe='Quickly start or schedule matches with ease. Get personalized suggestions based on your preferences'
          >
            <CustomeButton width={'100%'} height={'45px'} bgColor={'var(--theme-primary) !important'} hover='none' title='Schedule Match' onClick={handleOpen} />
          </CustomeMessageBox>
          }
          {
            !isPastTournament && matches.length > 0 &&
            <Box className='schedule_button' id='schedule-button' ref={scheduleRef}>
              <CustomeButton width={'80%'} height={'45px'} bgColor={'var(--theme-primary) !important'} hover='none' title='Schedule Match' onClick={handleOpen} />
            </Box>
          }
        </Box>
      </Box>
      <MatchCard
        matches={matches}
        isPastTournament={isPastTournament}
        tournamentData={TournamentData}
        isAdmin={true}
        activeTab={activeTab}
        anchorEl={anchorEl}
        handleClosed={handleClosed}
        handleStartMatch={handleStartMatch}
        handleMenuItemClick={handleMenuItemClick}
        handleMenuClick={handleClick}
      />

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
                <CustomeButton width={'100%'} height={'45px'} bgColor={'var(--color-white)'} hoverbg={'var(--color-white)'} hovertext={'var(--theme-primary)'} color={'var(--theme-primary)'} title='Next' onClick={() => handleRedirect('next_auto_match')} />
              </Box>
            </>
            :
            <Box className='showButtonBox'>
              <CustomeButton width={'100%'} height={'45px'} bgColor={'var(--theme-secondary)'} title='Schedule Match' onClick={() => handleRedirect('manual_schedule_match')} />
              <CustomeButton width={'100%'} height={'45px'} bgColor={'var(--color-white)'} color={'var(--theme-primary)'} title='Auto Schedule Match' onClick={() => handleRedirect('auto_match')} />
            </Box>
        }
      </CustomeModal>
    </Box>
  )
}

export default Matches