'use client'
import { debounce, formatNumberShort } from "@/components/common/commomFunction"
import {
    addCurrentPlayer,
    addSoldPlayer,
    addUnsoldPlayer,
    handleReauctionUnsold,
    handleResetAuction
} from "@/redux/slices/auctionSlice"
import { playersState } from "@/redux/slices/playersSlice"
import { teamsState, updateAuctionTeamStats } from "@/redux/slices/teamSlice"
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import { Box, Button, Typography } from "@mui/material"
import dynamic from "next/dynamic"
import Image from "next/image"
import { useParams } from "next/navigation"
import React, { useCallback, useEffect, useMemo, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import './LiveAuctionPage.css'

// Dynamic imports for better code splitting
const SvgIcon = dynamic(() => import("@/assets/icons/SvgIcon"))
const CustomeBack = dynamic(() => import("@/components/common/commonUi/CustomeBack"))
const CustomeButton = dynamic(() => import("@/components/common/commonUi/CustomeButton"))
const CustomeInput = dynamic(() => import("@/components/common/commonUi/CustomeInput"))
const CustomeModal = dynamic(() => import("@/components/common/commonUi/CustomeModal"))
const SearchInput = dynamic(() => import("@/components/common/commonUi/SearchInput/SearchInput"))
const MessageModal = dynamic(() => import("@/components/common/commonUi/Modal/MessageModal"))

// Constants
const MODAL_TYPES = {
    PLAYER: 'player',
    BID: 'bid',
    ACTIONS: 'actions'
}

const BTN_GROUP = [
    { icon: 'random', name: 'Random', keyname: 'random' },
    { icon: 'bidding-up', name: 'Bid Up', keyname: 'bid-up' },
    { icon: 'bidding-down', name: 'Bid Down', keyname: 'bid-down' },
    { icon: 'manual', name: 'Manual', keyname: 'manual' },
    { icon: 'sold', name: 'Sold', keyname: 'sold' },
    { icon: 'unsold', name: 'Unsold', keyname: 'unsold' },
]

const AUCTION_ACTIONS = [
    {
        id: 'complete-auction',
        title: 'Auction Completed',
        description: 'If you click here then Auction is completed',
        icon: 'auction-thor',
    },
    {
        id: 'reauction-unsold',
        title: 'Unsold Players re-auction',
        description: 'Transfer Player unsold list to available list.',
        icon: 'auction-thor',
    },
    {
        id: 'reset-auction',
        title: 'Reset',
        description: 'Reset all data (cancel all player auctions after testing or reset)',
        icon: 'refresh',
    }
]

const LiveAuctionPage = () => {
    const { auctionId } = useParams()
    const dispatch = useDispatch()

    // Combined selector to reduce re-renders
    const rawAuctionState = useSelector(state => state.auction);
    const rawTeamState = useSelector(state => teamsState(state));
    const rawPlayerState = useSelector(state => playersState(state));
    const { auctionState, teamState, playerState } = useMemo(() => ({
        auctionState: rawAuctionState,
        teamState: rawTeamState,
        playerState: rawPlayerState
    }), [rawAuctionState, rawTeamState, rawPlayerState]);

    // Memoized data calculations
    const auctiondata = useMemo(() =>
        auctionState.data.find((item) => item?.id === auctionId),
        [auctionState.data, auctionId]
    )

    const teamsData = useMemo(() =>
        teamState.data.filter((item) => item?.tournamentId === auctiondata?.tournamentId),
        [teamState.data, auctiondata]
    )

    const playerData = useMemo(() =>
        playerState.data.filter((item) =>
            item?.tournamentId === auctiondata?.tournamentId
            && !auctiondata?.soldPlayers?.some(sold => sold?.soldPlayer === item?.id)
            && !auctiondata?.unsoldPlayers?.some(unsold => unsold?.unsoldPlayer === item?.id)
        ),
        [playerState.data, auctiondata]
    )

    const currentAuctionStatus = auctiondata?.currentPlayer || {}
    const teambidding = useMemo(() =>
        currentAuctionStatus ? teamsData.find((team) => team?.id === currentAuctionStatus?.teamId) : null,
        [currentAuctionStatus, teamsData]
    )
    const auctinablePlayer = useMemo(() =>
        currentAuctionStatus ? playerData.find((player) => player.id === currentAuctionStatus?.currentPlayer) || null : playerData[0],
        [currentAuctionStatus, playerData]
    )

    // State management
    const [currentTeamBidding, setCurrentTeamBidding] = useState(teambidding)
    const [currentBid, setCurrentBid] = useState(0)
    const [updateInputBid, setUpdateInputBid] = useState('')
    const [error, setError] = useState({})
    const [isWhatOpen, setWhatOpen] = useState('')
    const [searchResults, setSearchResults] = useState('')
    const [currentPlayer, setCurrentPlayer] = useState(auctinablePlayer || playerData[0])
    const [selectManualPlayer, setSelectManualPlayer] = useState(currentPlayer)
    const [maxBidHeighestAmount, setMaxBidHeighestAmount] = useState(0)
    const [isUpdated, setIsUpdated] = useState(false)
    const [alertModal, setAlertModal] = useState({ open: false, success: false, message: "" })
    const [isSold, setIsSold] = useState(false)
    const [isUnsold, setIsUnsold] = useState(false)
    const [open, setOpen] = useState(playerData?.length === 0 || false)
    const [openSettingModal, setOpenSettingModal] = useState(false)

    const auctionCompleted = openSettingModal || playerData?.length === 0

    // Memoized derived values
    const InfoOfAuction = useMemo(() => [
        { title: 'Sold', count: auctiondata?.soldPlayers?.length || 0 },
        { title: 'unsold', count: auctiondata?.unsoldPlayers?.length || 0 },
        { title: 'Available', count: playerData.length },
        { title: 'Team', count: teamsData.length }
    ], [auctiondata, playerData, teamsData])

    const showPlayerData = useMemo(() => {
        if (!searchResults.trim()) return playerData
        const searchQuery = searchResults.toLowerCase()
        return playerData.filter((item) => item?.playerName?.toLowerCase()?.includes(searchQuery))
    }, [searchResults, playerData])

    // Effects
    useEffect(() => {
        const teams = teamState.data
            .filter(item => item?.tournamentId === auctiondata?.tournamentId && !item?.wallet)
            .map(item => ({
                ...item,
                teamId: item.id,
                wallet: parseInt(auctiondata?.auction_team_balance_point) || 0,
                players: 0
            }))
        if (teams.length) {
            dispatch(updateAuctionTeamStats({ teams }))
        }
    }, [teamsData, auctiondata, dispatch])

    useEffect(() => {
        if (!auctiondata || !teamsData?.length) return

        const playersPerTeam = parseInt(auctiondata.player_per_team) || 0
        const minBid = parseInt(auctiondata.minimum_bid) || 0

        const teamWithHighestMaxBid = teamsData.reduce((maxTeam, currentTeam) => {
            const maxTeamRemaining = maxTeam.wallet - (minBid * (playersPerTeam - (maxTeam.players || 0)))
            const currentTeamRemaining = currentTeam.wallet - (minBid * (playersPerTeam - (currentTeam.players || 0)))

            return currentTeamRemaining > maxTeamRemaining ? currentTeam : maxTeam
        }, teamsData[0])

        const highestMaxBidAmount = teamWithHighestMaxBid.wallet - (minBid * (playersPerTeam - (teamWithHighestMaxBid.players || 0)))
        setMaxBidHeighestAmount(highestMaxBidAmount)
    }, [auctiondata, teamsData])

    // Initialize current bid when player changes or auction data loads
    useEffect(() => {
        if (!isUpdated && auctiondata) {
            const currentBidStatus = currentAuctionStatus ? (currentAuctionStatus?.bidPrice || Number(auctiondata.minimum_bid)) : Number(auctiondata.minimum_bid)
            setCurrentBid(currentBidStatus || 0)
            updateCurrentPlayerState()
            setIsUpdated(true)
        }
    }, [currentPlayer, auctiondata, isUpdated])

    useEffect(() => {
        setUpdateInputBid(currentBid.toString())
        updateCurrentPlayerState()
    }, [currentBid, currentTeamBidding])

    const updateCurrentPlayerState = useCallback(() => {
        const newObj = {
            teamId: currentTeamBidding?.id || null,
            currentPlayer: currentPlayer?.id || null,
            bidPrice: currentBid || 0
        }
        const payload = {
            id: auctionId,
            currentPlayer: newObj
        }
        dispatch(addCurrentPlayer(payload))
    }, [currentTeamBidding, currentPlayer, currentBid, auctionId, dispatch])

    // Handlers
    const handleModalClose = () => {
        setAlertModal({ open: false, success: false, message: "" })
        setIsSold(false)
        setIsUnsold(false)
    }

    const handleClose = () => {
        setOpen(false)
        setTimeout(() => {
            setOpenSettingModal(false)
        }, 500);
    }

    const fetchSearchResults = useCallback((query) => {
        setSearchResults(query)
    }, [])

    const debouncedSearch = useCallback(debounce(fetchSearchResults, 500), [])

    const handleOnSearch = (event) => {
        const value = event.target.value
        debouncedSearch(value)
    }

    const clearSearchValue = () => {
        setSearchResults('')
    }

    const handleTeamBid = useCallback((team) => {
        if (currentTeamBidding?.id !== team?.id) {
            setCurrentTeamBidding(team)
            if (currentTeamBidding !== null) {
                const sum = Number(currentBid) + Number(auctiondata?.bid_increase_by)
                setCurrentBid(Number(sum))
            }
        }
    }, [currentTeamBidding, currentBid, auctiondata])

    const handleBidUpDown = useCallback((action) => {
        if (!auctiondata && !action) return
        let current = Number(currentBid)
        const increment = Number(auctiondata?.bid_increase_by) || 100
        const minBid = Number(auctiondata.minimum_bid)

        if (action === 'up') {
            if ((current + increment) <= maxBidHeighestAmount) {
                current = current + increment
            }
        } else {
            if (current > auctiondata.minimum_bid) {
                current = Math.max(minBid, current - increment)
            }
        }
        setCurrentBid(current)
    }, [auctiondata, currentBid, maxBidHeighestAmount])

    const handleRandomPlayerChange = useCallback(() => {
        if (playerData.length === 0) return

        const otherPlayers = playerData.filter(player =>
            currentPlayer ? player.id !== currentPlayer.id : true
        )

        const randomPlayer = otherPlayers.length > 0
            ? otherPlayers[Math.floor(Math.random() * otherPlayers.length)]
            : playerData[Math.floor(Math.random() * playerData.length)]

        setCurrentPlayer(randomPlayer)
        setCurrentTeamBidding(null)
        setCurrentBid(Number(auctiondata?.minimum_bid || 0))
    }, [playerData, currentPlayer, auctiondata])

    const handlePlayerSold = useCallback(async () => {
        const newObj = {
            teamId: currentTeamBidding?.id,
            soldPlayer: currentPlayer?.id,
            bidPrice: currentBid
        }
        const payload = {
            id: auctionId,
            soldPlayers: newObj
        }

        if (currentTeamBidding) {
            await dispatch(addSoldPlayer(payload))
            handleRandomPlayerChange()

            const teams = teamState.data
                .filter(item => item?.tournamentId === auctiondata?.tournamentId)
                .map(item => ({
                    ...item,
                    teamId: item.id,
                    wallet: parseInt(auctiondata?.auction_team_balance_point) || 0,
                    players: auctiondata?.soldPlayers?.filter((sold) => sold?.teamId === item?.id)?.length || 0
                }))

            dispatch(updateAuctionTeamStats({ teams }))
        }
    }, [currentTeamBidding, currentPlayer, currentBid, auctionId, dispatch, handleRandomPlayerChange, teamState.data, auctiondata])

    const handlePlayerUnsold = useCallback(async () => {
        const payload = {
            id: auctionId,
            unsoldPlayers: {
                unsoldPlayer: currentPlayer?.id
            }
        }
        await dispatch(addUnsoldPlayer(payload))
        handleRandomPlayerChange()
    }, [currentPlayer, auctionId, dispatch, handleRandomPlayerChange])

    const bidHandling = useCallback((key) => {
        switch (key) {
            case 'bid-up':
                handleBidUpDown('up')
                break
            case 'bid-down':
                handleBidUpDown('down')
                break
            case 'random':
                handleRandomPlayerChange()
                break
            case 'manual':
                handleWhatOpen(MODAL_TYPES.PLAYER)
                break
            case 'sold':
                if (!currentTeamBidding) return
                setAlertModal({
                    success: false,
                    open: true,
                    message: `Are you sure want to sold ${currentPlayer?.playerName || ''} to ${currentTeamBidding?.team_name || 'team'}?`
                })
                setIsSold(true)
                break
            case 'unsold':
                setAlertModal({
                    success: false,
                    open: true,
                    message: `Are you sure want to unsold ${currentPlayer?.playerName || ''}?`
                })
                setIsUnsold(true)
                break
            default:
                return
        }
    }, [handleBidUpDown, handleRandomPlayerChange, currentTeamBidding, currentPlayer])

    const handleModalSubmitClick = useCallback(() => {
        if (isSold) {
            handlePlayerSold()
        } else if (isUnsold) {
            handlePlayerUnsold()
        }
        handleModalClose()
    }, [isSold, isUnsold, handlePlayerSold, handlePlayerUnsold])

    const handleOnChange = useCallback((val, key) => {
        setUpdateInputBid(val)
        setError({})
    }, [])

    const submitBidAmount = useCallback(() => {
        const minBid = Number(auctiondata?.minimum_bid)
        const bidValue = Number(updateInputBid)

        if (bidValue < minBid) {
            setError({
                'bid_amount': 'Bid value must be greater than minimum value'
            })
            return
        } else if (bidValue > maxBidHeighestAmount) {
            setError({
                'bid_amount': 'Bid value must be less than maximum value of teams.'
            })
            return
        }
        setCurrentBid(bidValue)
        handleClose()
    }, [updateInputBid, auctiondata, maxBidHeighestAmount])

    const handleWhatOpen = useCallback((type) => {
        setWhatOpen(type)
        setSelectManualPlayer(currentPlayer)
        setOpen(true)
    }, [currentPlayer])

    const handleManualPlayerSelection = useCallback(() => {
        if (selectManualPlayer) {
            setCurrentPlayer(selectManualPlayer)
        }
        handleClose()
    }, [selectManualPlayer])

    const handleAuctionAction = useCallback(async (id) => {
        const payload = { id: auctionId }
        const newObj = {
            id: auctionId,
            currentPlayer: {
                teamId: null,
                currentPlayer: null,
                bidPrice: currentBid || 0
            }
        }

        if (id === 'complete-auction') {
            // Handle auction completion
        } else if (id === 'reauction-unsold') {
            await dispatch(handleReauctionUnsold(payload))
            await dispatch(addCurrentPlayer(newObj))
        } else if (id === 'reset-auction') {
            const teams = teamState.data
                .filter(item => item?.tournamentId === auctiondata?.tournamentId)
                .map(item => ({
                    ...item,
                    teamId: item.id,
                    wallet: parseInt(auctiondata?.auction_team_balance_point) || 0,
                    players: 0
                }))

            await dispatch(handleResetAuction(payload))
            await dispatch(updateAuctionTeamStats({ teams }))
            await dispatch(addCurrentPlayer(newObj))
        }
        handleClose()
    }, [auctionId, currentBid, dispatch, teamState.data, auctiondata])

    return (
        <Box className='live-auction'>
            {/* ----- backButton header ---------- */}
            <Box className='live-auction-header-main'>
                <CustomeBack />
                <Typography variant='h6' className="header-title">Auction</Typography>
                <SvgIcon id={'three-dot-menu'} className='menu_auction_icon' />
            </Box>
            {/* -------- show auction player data ------------ */}
            {playerData.length > 0 && (
                <Box className='au-player-details'>
                    <Box
                        className='au-pl-img'
                        sx={{
                            backgroundColor: !currentPlayer?.playerImage ? currentPlayer?.playerColor : ''
                        }}
                    >
                        {currentPlayer?.playerImage ? (
                            <Image
                                src={`/${currentPlayer?.playerImage}`}
                                alt="player"
                                width={100}
                                height={100}
                                priority
                                quality={85}
                            />
                        ) : (
                            <Typography variant='h6'>{currentPlayer?.letter}</Typography>
                        )}
                    </Box>
                    <Box className='au-pl-details'>
                        <Typography variant='h6' className="auction-player">{currentPlayer?.playerName}</Typography>
                        <Box className='auction-bidding'>
                            <SvgIcon id='gold-coin' className='gold-coin' />
                            <Typography variant='h6' className="bidding-count">{currentBid}</Typography>
                            <SvgIcon id='edit' className='edit-icon' onClick={() => handleWhatOpen(MODAL_TYPES.BID)} />
                        </Box>
                        <Typography variant='h6' className="auction-team-name">
                            {currentTeamBidding ? currentTeamBidding.team_name : "No bidder"}
                        </Typography>
                    </Box>
                </Box>
            )}
            {/* -------------- participate auction team data --------- */}
            <Box className='auction-team'>
                {teamsData.map((item, i) => {
                    const totalCoins = formatNumberShort(Number(auctiondata?.auction_team_balance_point))
                    const areadyBidCalledTeams = auctiondata?.soldPlayers
                        ?.filter(sold => sold?.teamId === item?.id)
                        ?.reduce((sum, sold) => sum + (sold?.bidPrice || 0), 0) || 0;
                    const TeamWallet = formatNumberShort(Number(item?.wallet) - (Number(areadyBidCalledTeams) || 0))
                    const availableWallet = Number(item?.wallet) - (Number(areadyBidCalledTeams) || 0)
                    const maxBid = formatNumberShort(Number(availableWallet) - (Number(auctiondata?.minimum_bid) * (Number(auctiondata?.player_per_team) - (item?.players || 0))))
                    const maxBidReached = currentBid >= (Number(availableWallet) - (Number(auctiondata?.minimum_bid) * (Number(auctiondata?.player_per_team) - (item?.players || 0))))

                    return (
                        <Box
                            className={`team_card ${currentTeamBidding?.id === item.id ? 'active-bidder' : ''} ${maxBidReached ? 'disable-bidder' : ''}`}
                            key={i}
                            onClick={maxBidReached ? undefined : () => handleTeamBid(item)}
                        >
                            <Box
                                className='team-logo'
                                sx={{
                                    backgroundColor: !item?.team_logo ? item?.team_color : ''
                                }}
                            >
                                {item?.team_logo ? (
                                    <Image
                                        src={`/${item?.team_logo}`}
                                        alt="team logo"
                                        width={100}
                                        height={100}
                                        priority={i < 4}
                                        quality={85}
                                    />
                                ) : (
                                    <Typography variant="h6">{item?.letter}</Typography>
                                )}
                            </Box>
                            <Box className='team_details'>
                                <Typography variant="h6">{item?.team_name.slice(0, 12)}</Typography>
                                <Typography variant="h6">
                                    <SvgIcon id={'gold-coin'} />
                                    <span>{`${TeamWallet}/${totalCoins}`}</span>
                                </Typography>
                                <Typography variant="h6">{`Max Bid : ${maxBid}`}</Typography>
                            </Box>
                        </Box>
                    )
                })}
            </Box>
            {/* ----------- auction action and info bottom bar -------------- */}
            <Box className='info-bottom'>
                <Box className='button-group'>
                    {BTN_GROUP.map((item, i) => (
                        <Button
                            variant='contained'
                            className='action-btn'
                            key={i}
                            onClick={() => bidHandling(item.keyname)}
                        >
                            <SvgIcon id={item.icon} />
                            <span>{item.name}</span>
                        </Button>
                    ))}
                </Box>
                <Box className='info-btn-group'>
                    <SvgIcon id='three-line-menu' onClick={() => {
                        setOpenSettingModal(true)
                        setOpen(true)
                    }} />
                    {InfoOfAuction.map((item, i) => (
                        <Box className='info-btn' key={i}>
                            <span>{item.title}</span>
                            <span>{item.count}</span>
                        </Box>
                    ))}
                </Box>
            </Box>
            {/* --------------- modal --------------- */}
            <CustomeModal open={open} bgColor={'var(--text-white)'}>
                {!auctionCompleted ? (
                    <Box className='auction_modal'>
                        <Box className='auction-modal-header'>
                            <Typography variant="h6">
                                {isWhatOpen === MODAL_TYPES.PLAYER ? 'Select Player Manually' : 'Update Auction Bid'}
                            </Typography>
                            <CloseRoundedIcon onClick={handleClose} />
                        </Box>

                        {isWhatOpen === MODAL_TYPES.PLAYER && (
                            <Box className='auction-player-section'>
                                <Box sx={{ marginBottom: '20px' }}>
                                    <SearchInput
                                        placeholder='Search Player'
                                        onChange={handleOnSearch}
                                        onClear={clearSearchValue}
                                    />
                                </Box>
                                {showPlayerData.map((item, i) => {
                                    const isSelect = selectManualPlayer?.id === item.id
                                    return (
                                        <Box
                                            className='manual-player-selection'
                                            key={i}
                                            onClick={() => setSelectManualPlayer(item)}
                                        >
                                            <Box className='player_row'>
                                                <Box
                                                    className='player-img'
                                                    sx={{
                                                        backgroundColor: !item?.playerImage ? item?.playerColor : ''
                                                    }}
                                                >
                                                    {item?.playerImage ? (
                                                        <Image
                                                            src={`/${item.playerImage}`}
                                                            alt="player"
                                                            width={50}
                                                            height={50}
                                                            quality={85}
                                                        />
                                                    ) : (
                                                        <Typography variant="h6">{item?.letter}</Typography>
                                                    )}
                                                </Box>
                                                <Typography variant="h5" className="auction_player">
                                                    {item?.playerName}
                                                </Typography>
                                            </Box>
                                            <Box className={`auction-checkbox ${isSelect ? 'isSelect' : ''}`}>
                                                {isSelect && <SvgIcon id={'trueIcon'} />}
                                            </Box>
                                        </Box>
                                    )
                                })}
                            </Box>
                        )}

                        {isWhatOpen === MODAL_TYPES.BID && (
                            <Box className='update-bid-main'>
                                <CustomeInput
                                    placeholder={'Add Bid Amount'}
                                    type={'input'}
                                    error={error['bid_amount']}
                                    keyName={'bid_amount'}
                                    value={updateInputBid}
                                    onChange={handleOnChange}
                                />
                            </Box>
                        )}

                        {isWhatOpen === MODAL_TYPES.PLAYER ? (
                            <CustomeButton title='Done' onClick={handleManualPlayerSelection} />
                        ) : (
                            <CustomeButton title='Update' onClick={submitBidAmount} />
                        )}
                    </Box>
                ) : (
                    <Box className='message-info'>
                        {AUCTION_ACTIONS.map((action, index) => (
                            <React.Fragment key={action.id}>
                                <Box
                                    className='info-details'
                                    onClick={() => handleAuctionAction(action.id)}
                                    sx={{ cursor: 'pointer', '&:hover': { backgroundColor: 'action.hover' } }}
                                >
                                    <Box className='info'>
                                        <Typography variant="h6">{action.title}</Typography>
                                        <Typography variant="body2">{action.description}</Typography>
                                    </Box>
                                    <Box className='icon-info'>
                                        <SvgIcon id={action.icon} />
                                    </Box>
                                </Box>
                                {index !== AUCTION_ACTIONS.length - 1 && (
                                    <Box className='info-divider'></Box>
                                )}
                            </React.Fragment>
                        ))}
                        <Typography variant="h6" className="info-close" onClick={handleClose}>Close</Typography>
                    </Box>
                )}
            </CustomeModal>

            <MessageModal
                open={alertModal.open}
                handleClose={handleModalClose}
                success={alertModal.success}
                message={alertModal.message}
                handleSubmit={handleModalSubmitClick}
            />
        </Box>
    )
}

export default LiveAuctionPage