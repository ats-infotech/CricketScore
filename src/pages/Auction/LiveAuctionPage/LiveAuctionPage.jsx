'use client'
import { debounce, formatNumberShort } from "@/components/common/commomFunction"
import {
    addCurrentPlayer,
    addSoldPlayer,
    addUnsoldPlayer,
    handleReauctionUnsold,
    handleResetAuction,
    statusUpdateAuction
} from "@/redux/slices/auctionSlice"
import { deleteMultiplePlayerData, playersState, updateAuctionedPlayersTeam } from "@/redux/slices/playersSlice"
import { teamsState, updateAuctionTeamStats } from "@/redux/slices/teamSlice"
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import { Box, Button, Menu, MenuItem, Typography } from "@mui/material"
import dynamic from "next/dynamic"
import Image from "next/image"
import { useParams, useRouter } from "next/navigation"
import React, { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import './LiveAuctionPage.css'

// Dynamic imports
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

const LiveAuctionPage = ({ type }) => {
    const { auctionId } = useParams()
    const dispatch = useDispatch()
    const router = useRouter()
    const playerDataRef = useRef([])
    const currentBidRef = useRef(0)

    // Redux state
    const auctionState = useSelector(state => state.auction)
    const teamState = useSelector(state => teamsState(state))
    const playerState = useSelector(state => playersState(state))

    // Derived data
    const auctiondata = auctionState.data.find(item => item?.id === auctionId)
    const teamsData = teamState.data.filter(item => item?.tournamentId === auctiondata?.tournamentId)

    const availablePlayers = playerState.data.filter(item =>
        item?.tournamentId === auctiondata?.tournamentId &&
        !auctiondata?.soldPlayers?.some(sold => sold?.soldPlayer === item?.id) &&
        !auctiondata?.unsoldPlayers?.some(unsold => unsold?.unsoldPlayer === item?.id)
    )

    playerDataRef.current = availablePlayers

    const currentAuctionStatus = auctiondata?.currentPlayer || {}
    const teambidding = currentAuctionStatus ? teamsData.find(team => team?.id === currentAuctionStatus?.teamId) : null
    const auctinablePlayer = currentAuctionStatus ?
        availablePlayers.find(player => player.id === currentAuctionStatus?.currentPlayer) || null :
        availablePlayers[0]
    const isAuctionCompleted = availablePlayers.length === 0

    // Local state
    const [currentTeamBidding, setCurrentTeamBidding] = useState(teambidding)
    const [currentBid, setCurrentBid] = useState(0)
    const [updateInputBid, setUpdateInputBid] = useState('')
    const [error, setError] = useState({})
    const [isWhatOpen, setWhatOpen] = useState('')
    const [searchResults, setSearchResults] = useState('')
    const [currentPlayer, setCurrentPlayer] = useState(auctinablePlayer)
    const [selectManualPlayer, setSelectManualPlayer] = useState(auctinablePlayer)
    const [maxBidHeighestAmount, setMaxBidHeighestAmount] = useState(0)
    const [isUpdated, setIsUpdated] = useState(false)
    const [alertModal, setAlertModal] = useState({ open: false, success: false, message: "" })
    const [isSold, setIsSold] = useState(false)
    const [isUnsold, setIsUnsold] = useState(false)
    const [open, setOpen] = useState(false)
    const [openSettingModal, setOpenSettingModal] = useState(false)
    const [auctionComplete, setAuctionComplete] = useState(false)
    const [resetAuction, setResetAuction] = useState(false)
    const auctionCompleted = (openSettingModal || isAuctionCompleted)
    const [reauctionUnsold, setReauctionUnsold] = useState(false)

    // meulist state
    const [anchorEl, setAnchorEl] = useState(false);

    // gets the current bidding teams info
    let currentTeamAlreadyOwnedPlayers = auctiondata?.soldPlayers
        ?.filter(sold => sold?.teamId === currentTeamBidding?.id)
        ?.reduce((sum, sold) => sum + (sold?.bidPrice || 0), 0) || 0
    let currentTeamPurchasedPlayerCount = auctiondata?.soldPlayers?.filter(sold => sold?.teamId === currentTeamBidding?.id).length || 0
    let currentTeamWallet = Number(currentTeamBidding?.wallet) - (Number(currentTeamAlreadyOwnedPlayers) || 0)
    let currentTeamMaxBid = (Number(currentTeamWallet) - (Number(auctiondata?.minimum_bid) * (Number(auctiondata?.player_per_team) - (currentTeamPurchasedPlayerCount || 0))))

    // Derived UI data
    const InfoOfAuction = [
        { title: 'Sold', count: auctiondata?.soldPlayers?.length || 0 },
        { title: 'unsold', count: auctiondata?.unsoldPlayers?.length || 0 },
        { title: 'Available', count: availablePlayers.length },
        { title: 'Team', count: teamsData.length }
    ]

    // button group UI data
    const BTN_GROUP = [
        { icon: 'random', name: 'Random', keyname: 'random' },
        { icon: 'bidding-up', name: 'Bid Up', keyname: 'bid-up', disable: currentTeamMaxBid < (currentBid + parseInt(auctiondata?.bid_increase_by)) },
        { icon: 'bidding-down', name: 'Bid Down', keyname: 'bid-down', disable: currentBid <= parseInt(auctiondata?.minimum_bid) },
        { icon: 'manual', name: 'Manual', keyname: 'manual' },
        { icon: 'sold', name: 'Sold', keyname: 'sold', disable: !currentTeamBidding },
        { icon: 'unsold', name: 'Unsold', keyname: 'unsold' },
    ]

    const showPlayerData = searchResults.trim()
        ? availablePlayers.filter(item => item?.playerName?.toLowerCase()?.includes(searchResults.toLowerCase()))
        : availablePlayers

    const isUser = type === 'user'

    // menulist handle
    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleMenuItemClick = () => {
        router.push(`/auction-players/${auctiondata?.id}`)
        handleMenuClose()
    }

    useEffect(() => {
        if (availablePlayers && !currentPlayer) {
            setCurrentPlayer(availablePlayers[0])
        }
    }, [availablePlayers])

    // Effects
    useEffect(() => {
        if (!isUser && isAuctionCompleted) {
            const newObj = {
                id: auctionId,
                currentPlayer: {
                    teamId: null,
                    currentPlayer: null,
                    bidPrice: Number(auctiondata?.minimum_bid) || 0
                }
            }
            dispatch(addCurrentPlayer(newObj))
            setOpenSettingModal(true)
            setOpen(true)
        } else {
            if (isUser && isAuctionCompleted) {
                router.replace(`/auction-players/${auctiondata?.id}`)
            }
        }
    }, [isAuctionCompleted, isUser])

    useEffect(() => {
        const newTeams = teamState.data.filter(item => item?.tournamentId === auctiondata?.tournamentId &&
            (!item?.wallet || item?.wallet !== parseInt(auctiondata?.auction_team_balance_point))).map(items => ({
                ...items,
                teamId: items.id,
                wallet: parseInt(auctiondata?.auction_team_balance_point) || 0,
                players: items?.players && items?.wallet !== parseInt(auctiondata?.auction_team_balance_point) ? items?.players : 0
            }));

        if (newTeams.length) {
            dispatch(updateAuctionTeamStats({ teams: newTeams }));
        }
    }, [auctiondata?.auction_team_balance_point, auctiondata?.tournamentId, teamState.data]);

    useEffect(() => {
        if (!auctiondata || !teamsData?.length) return

        const playersPerTeam = parseInt(auctiondata.player_per_team) || 0
        const minBid = parseInt(auctiondata?.minimum_bid) || 0

        const teamWithHighestMaxBid = teamsData.reduce((maxTeam, currentTeam) => {
            return maxTeam
        }, currentTeamBidding)

        const alreadyPurchasedPlayer = auctiondata?.soldPlayers?.filter(sold => sold?.teamId === teamWithHighestMaxBid?.id).length || 0
        const areadyBidCalledTeams = auctiondata?.soldPlayers?.filter(sold => sold?.teamId === teamWithHighestMaxBid?.id)?.reduce((sum, sold) => sum + (sold?.bidPrice || 0), 0) || 0
        const highestMaxBidAmount = (teamWithHighestMaxBid?.wallet - areadyBidCalledTeams) - (minBid * (playersPerTeam - (alreadyPurchasedPlayer || 0)))
        setMaxBidHeighestAmount(highestMaxBidAmount)
    }, [auctiondata, teamsData])

    useEffect(() => {
        if (!isUpdated && auctiondata) {
            const currentBidStatus = currentAuctionStatus ? (currentAuctionStatus?.bidPrice || Number(auctiondata?.minimum_bid)) : Number(auctiondata?.minimum_bid)
            setCurrentBid(currentBidStatus || 0)
            currentBidRef.current = currentBidStatus || 0
            updateCurrentPlayerState()
            setIsUpdated(true)
        }
    }, [currentPlayer, auctiondata, isUpdated])

    useEffect(() => {
        setUpdateInputBid(currentBid.toString())
        currentBidRef.current = currentBid
        updateCurrentPlayerState()
    }, [currentBid, currentTeamBidding])

    // Helper functions
    function updateCurrentPlayerState() {
        const newObj = {
            teamId: currentTeamBidding?.id || null,
            currentPlayer: currentPlayer?.id || null,
            bidPrice: currentBidRef.current || 0
        }
        const payload = {
            id: auctionId,
            currentPlayer: newObj
        }
        dispatch(addCurrentPlayer(payload))
        if (reauctionUnsold) {
            setReauctionUnsold(false)
        }
    }

    function handleModalClose() {
        setAlertModal({ open: false, success: false, message: "" })
        setIsSold(false)
        setIsUnsold(false)
    }

    function handleClose() {
        setOpen(false)
        setError({})
        setUpdateInputBid(currentBid.toString())
        setTimeout(() => {
            setOpenSettingModal(false)
        }, 500)
    }

    const debouncedSearch = debounce((query) => {
        setSearchResults(query)
    }, 500)

    function handleOnSearch(event) {
        const value = event.target.value
        debouncedSearch(value)
    }

    function clearSearchValue() {
        setSearchResults('')
    }

    function handleTeamBid(team) {
        if (currentTeamBidding?.id !== team?.id) {
            setCurrentTeamBidding(team)
            if (currentTeamBidding !== null) {
                const sum = Number(currentBid) + Number(auctiondata?.bid_increase_by)
                setCurrentBid(Number(sum))
            }
        }
    }

    function handleBidUpDown(action) {
        if (!auctiondata && !action) return
        let current = Number(currentBid)
        const increment = Number(auctiondata?.bid_increase_by) || 100
        const minBid = Number(auctiondata?.minimum_bid)

        if (action === 'up') {
            if ((current + increment) <= maxBidHeighestAmount) {
                current = current + increment
            }
        } else {
            if (current > auctiondata?.minimum_bid) {
                current = Math.max(minBid, current - increment)
            }
        }
        setCurrentBid(current)
    }

    function handleRandomPlayerChange() {
        if (availablePlayers.length === 0) {
            setCurrentPlayer(null)
            return
        }

        const otherPlayers = currentPlayer
            ? availablePlayers.filter(player => player.id !== currentPlayer.id)
            : availablePlayers

        const randomPlayer = otherPlayers.length > 0
            ? otherPlayers[Math.floor(Math.random() * otherPlayers.length)]
            : availablePlayers[Math.floor(Math.random() * availablePlayers.length)]

        setCurrentPlayer(randomPlayer)
        setCurrentTeamBidding(null)
        setCurrentBid(Number(auctiondata?.minimum_bid || 0))
    }

    async function handlePlayerSold() {
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
                    players: auctiondata?.soldPlayers?.filter(sold => sold?.teamId === item?.id)?.length || 0
                }))

            dispatch(updateAuctionTeamStats({ teams }))
        }
    }

    async function handlePlayerUnsold() {
        const payload = {
            id: auctionId,
            unsoldPlayers: {
                unsoldPlayer: currentPlayer?.id
            }
        }
        await dispatch(addUnsoldPlayer(payload))
        handleRandomPlayerChange()
    }

    function bidHandling(key) {
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
                break
        }
    }

    function handleModalSubmitClick() {
        if (isSold) {
            handlePlayerSold()
        } else if (isUnsold) {
            handlePlayerUnsold()
        }
        handleModalClose()
    }

    function handleOnChange(val, key) {
        if (key === 'bid_amount') {
            if (!/^[0-9]*$/.test(val)) {
                return; // Stop further execution if invalid
            }
        }
        setUpdateInputBid(val)
        setError({})
    }

    function submitBidAmount() {
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
    }

    function handleWhatOpen(type) {
        setWhatOpen(type)
        setSelectManualPlayer(currentPlayer)
        clearSearchValue()
        setOpen(true)
    }

    function handleManualPlayerSelection() {
        if (selectManualPlayer) {
            const resetState = {
                teamId: null,
                currentPlayer: selectManualPlayer,
                bidPrice: auctiondata?.minimum_bid || 0
            }
            dispatch(addCurrentPlayer({
                id: auctionId,
                currentPlayer: resetState
            }))
            setCurrentBid(auctiondata?.minimum_bid || 0)
            setCurrentTeamBidding(null)
            setCurrentPlayer(selectManualPlayer)
        }
        handleClose()
    }

    const handleAuctionComplete = async (type) => {
        if (type === "Yes") {
            const resetState = {
                teamId: null,
                currentPlayer: availablePlayers[0],
                bidPrice: auctiondata?.minimum_bid || 0
            }
            if (auctiondata?.soldPlayers?.length > 0 && auctionComplete) {
                const unSoldplayerIds = auctiondata?.unsoldPlayers?.length > 0 ? auctiondata?.unsoldPlayers.map(player => player?.unsoldPlayer) : [];
                const playerIds = availablePlayers?.length > 0 ? availablePlayers.map(player => player?.id) : [];
                let allIds = [...unSoldplayerIds, ...playerIds]

                if (playerIds.length > 0) {
                    await dispatch(deleteMultiplePlayerData({ playerId: allIds }));
                }

                let playersPayload = auctiondata?.soldPlayers.map((item) => {
                    return {
                        playerId: item?.soldPlayer,
                        teamId: item?.teamId
                    }
                })
                const res = await dispatch(updateAuctionedPlayersTeam(playersPayload))
                if (res) {
                    const payload = {
                        ...auctiondata,
                        auctionStatus: 3
                    }
                    const resp = await dispatch(statusUpdateAuction(payload))
                    if (resp) {
                        router.replace(`/mytournament/${auctiondata?.tournamentId}/auction`)
                    }
                }
            } else if (resetAuction) {
                await dispatch(handleResetAuction({ id: auctionId }))
            }
            await dispatch(addCurrentPlayer({
                id: auctionId,
                currentPlayer: resetState
            }))
            setCurrentPlayer(availablePlayers[0] || null)
            setCurrentBid(auctiondata?.minimum_bid || 0)
            setCurrentTeamBidding(null)
        }
        handleClose()
        setAuctionComplete(false)
        setResetAuction(false)
    }

    const handleAuctionAction = async (id) => {
        const resetState = {
            teamId: null,
            currentPlayer: availablePlayers[0],
            bidPrice: auctiondata?.minimum_bid || 0
        }
        if (id === 'complete-auction') {
            setAuctionComplete(true)
        }
        else if (id === 'reauction-unsold') {
            await dispatch(handleReauctionUnsold({ id: auctionId }))
        }
        else if (id === 'reset-auction') {
            setResetAuction(true)
        }
        if (id !== 'complete-auction' && id !== 'reset-auction') {
            await dispatch(addCurrentPlayer({
                id: auctionId,
                currentPlayer: resetState
            }))
            setCurrentPlayer(availablePlayers[0] || null)
            setCurrentBid(auctiondata?.minimum_bid || 0)
            setCurrentTeamBidding(null)
            handleClose()
        }
    }

    // Render
    return (
        <Box className='live-auction'>
            {/* Header */}
            <Box className='live-auction-header-main'>
                <CustomeBack />
                <Typography variant='h6' className="header-title">Auction</Typography>
                <Box>
                    <SvgIcon id={'three-dot-menu'} className='menu_auction_icon' onClick={(e) => handleMenuClick(e)} />
                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                        className='list-menu'
                    >
                        <MenuItem onClick={() => handleMenuItemClick()}>
                            <Box className='auction-player-menu' >
                                <SvgIcon id='auction-thor' />
                                <Typography variant='body2'>Players</Typography>
                            </Box>
                        </MenuItem>
                    </Menu>
                </Box>
            </Box>

            {/* Player Details */}
            {availablePlayers.length > 0 && (
                <Box className='au-player-details'>
                    <Box className="au-pl-age">
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
                                    unoptimized
                                />
                            ) : (
                                <Typography variant='h6'>{currentPlayer?.letter}</Typography>
                            )}
                        </Box>
                        {currentPlayer?.player_age && <Typography variant="body2">{currentPlayer?.player_age} Years</Typography>}
                    </Box>
                    <Box className='au-pl-details'>
                        <Typography variant='h6' className="auction-player">{currentPlayer?.playerName}</Typography>
                        {currentPlayer?.player_skills && <Box className="auction-player-skills">
                            <Typography variant="body2">{currentPlayer?.player_skills}</Typography>
                        </Box>}
                        <Box className='auction-bidding'>
                            <SvgIcon id='gold-coin' className='gold-coin' />
                            <Typography variant='h6' className="bidding-count">{currentBid}</Typography>
                            {!isUser ? <SvgIcon id='edit' className='edit-icon' onClick={() => handleWhatOpen(MODAL_TYPES.BID)} /> : <Box></Box>}
                        </Box>
                        <Typography variant='h6' className="auction-team-name">
                            {currentTeamBidding ? currentTeamBidding.team_name : "No bidder"}
                        </Typography>
                    </Box>
                    {/* <Box className='stamp-gif'>
                        <Image src={require('../../../assets/img/sold.png')} alt="stamp" unoptimized/>
                    </Box> */}
                </Box>
            )}

            {/* Team Bidding Area */}
            <Box className={`auction-team-section ${currentPlayer?.player_skills ? 'skills' : ''}`}>
                <Box className='auction-team'>
                    {teamsData.map((item, i) => {
                        const totalCoins = formatNumberShort(Number(auctiondata?.auction_team_balance_point))
                        const alreadyPurchasedPlayer = auctiondata?.soldPlayers?.filter(sold => sold?.teamId === item?.id).length
                        const areadyBidCalledTeams = auctiondata?.soldPlayers
                            ?.filter(sold => sold?.teamId === item?.id)
                            ?.reduce((sum, sold) => sum + (sold?.bidPrice || 0), 0) || 0
                        const TeamWallet = formatNumberShort(Number(item?.wallet) - (Number(areadyBidCalledTeams) || 0))
                        const availableWallet = Number(item?.wallet) - (Number(areadyBidCalledTeams) || 0)
                        const maxBid = formatNumberShort(Number(availableWallet) - (Number(auctiondata?.minimum_bid) * (Number(auctiondata?.player_per_team) - (alreadyPurchasedPlayer || 0))))
                        const reachBid = (Number(availableWallet) - (Number(auctiondata?.minimum_bid) * (Number(auctiondata?.player_per_team) - (alreadyPurchasedPlayer || 0))))
                        const maxBidReached = TeamWallet < Number(auctiondata?.minimum_bid) ? true : !currentTeamBidding ? currentBid > reachBid : currentBid >= reachBid

                        return (
                            <Box
                                className={`team_card ${isUser ? 'not-cursor' : ''} ${currentTeamBidding?.id === item.id ? 'active-bidder' : ''} ${maxBidReached ? 'disable-bidder' : ''}`}
                                key={i}
                                onClick={isUser || maxBidReached ? undefined : () => handleTeamBid(item)}
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
                                            unoptimized
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
            </Box>

            {/* Bottom Action Bar */}
            <Box className='info-bottom'>
                {!isUser && <Box className='button-group'>
                    {BTN_GROUP.map((item, i) => {
                        return (
                            <Button
                                variant='contained'
                                className='action-btn'
                                key={i}
                                onClick={() => bidHandling(item.keyname)}
                                disabled={item?.disable}
                            >
                                <SvgIcon id={item.icon} />
                                <span>{item.name}</span>
                            </Button>
                        )
                    })}
                </Box>}
                <Box className='info-btn-group'>
                    {!isUser && <SvgIcon id='three-line-menu' onClick={() => {
                        setOpenSettingModal(true)
                        setOpen(true)
                    }} />}
                    {InfoOfAuction.map((item, i) => (
                        <Box className={`info-btn ${isUser ? 'isUser' : 'isAdmin'}`} key={i}>
                            <span>{item.title}</span>
                            <span>{item.count}</span>
                        </Box>
                    ))}
                </Box>
            </Box>

            {/* Modals */}
            <CustomeModal open={open} bgColor={'var(--color-white)'}>

                {(auctionComplete || resetAuction) ? <Box className="auction_complete_warning">
                    <Typography variant="body2" className="errorText">{`${auctionComplete ? 'Are you sure auction is completed?'
                        : 'Are you sure you want to reset this auction?'}`}</Typography>
                    <Box className="auction_complete_buttons">
                        {
                            ['Yes', 'No'].map((item, i) => {
                                return (
                                    <CustomeButton title={item} key={i} margin={'0px'} onClick={() => handleAuctionComplete(item)} />
                                )
                            })
                        }
                    </Box>
                </Box> : !auctionCompleted ? (
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
                                <Box className={showPlayerData.length > 5 ? 'overflow-player' : ''}>
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
                                                                unoptimized
                                                            />
                                                        ) : (
                                                            <Typography variant="body2">{item?.letter}</Typography>
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
                        {AUCTION_ACTIONS.map((action, index) => {
                            if (action.id === "reauction-unsold" && (!auctiondata?.unsoldPlayers || auctiondata.unsoldPlayers.length === 0)) {
                                return null;
                            }
                            if (action.id === "complete-auction" && (!auctiondata?.soldPlayers || auctiondata.soldPlayers.length === 0)) {
                                return null;
                            }

                            return (
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
                            )
                        })}
                        {!isAuctionCompleted && <Typography variant="h6" className="info-close" onClick={handleClose}>Close</Typography>}
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