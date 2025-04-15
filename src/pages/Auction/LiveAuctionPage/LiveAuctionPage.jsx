'use client'
import SvgIcon from "@/assets/icons/SvgIcon"
import { debounce, formatNumberShort } from "@/components/common/commomFunction"
import CustomeBack from "@/components/common/commonUi/CustomeBack"
import CustomeButton from "@/components/common/commonUi/CustomeButton"
import CustomeInput from "@/components/common/commonUi/CustomeInput"
import CustomeModal from "@/components/common/commonUi/CustomeModal"
import SearchInput from "@/components/common/commonUi/SearchInput/SearchInput"
import { playersState } from "@/redux/slices/playersSlice"
import { teamsState } from "@/redux/slices/teamSlice"
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import { Box, Button, Typography } from "@mui/material"
import Image from "next/image"
import { useParams } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import { useSelector } from "react-redux"
import './LiveAuctionPage.css'

const btnGroup = [
    { icon: 'random', name: 'Random', keyname: 'random' },
    { icon: 'bidding-up', name: 'Bid Up', keyname: 'bid-up' },
    { icon: 'bidding-down', name: 'Bid Down', keyname: 'bid-down' },
    { icon: 'manual', name: 'Manual', keyname: 'manual' },
    { icon: 'sold', name: 'Sold', keyname: 'sold' },
    { icon: 'unsold', name: 'Unsold', keyname: 'unsold' },
]

const LiveAuctionPage = () => {
    const [displayPlayerIndex, setDisplayPlayerIndex] = useState(0)
    const [currentTeamBidding, setCurrentTeamBidding] = useState(null)
    const [currentBid, setCurrentBid] = useState(0)
    const [updateInputBid, setUpdateInputBid] = useState('')
    const [error, setError] = useState({})
    const [isWhatOpen, setWhatOpen] = useState('')
    const [selectManualPlayer, setSelectManualPlayer] = useState(displayPlayerIndex)
    const { auctionId } = useParams()

    const auctionState = useSelector(state => state.auction)
    const teamState = useSelector(teamsState)
    const playerState = useSelector(playersState)

    const auctiondata = auctionState.data.find((item) => item?.id === auctionId)
    const teamsData = teamState.data.filter((item) => item?.tournamentId === auctiondata?.tournamentId)
    const playerData = playerState.data.filter((item) => item?.tournamentId === auctiondata?.tournamentId)
    const player = playerData[displayPlayerIndex]

    const [open, setOpen] = useState(false)
    const [searchValue, setSearchValue] = useState("")
    const [searchResults, setSearchResults] = useState('')
    const [showPlayerData, setShowPlayerData] = useState(playerData || [])

    const handleClose = () => {
        setOpen(false)
    }

    const fetchSearchResults = (query) => {
        setSearchResults(query)
    }

    const debouncedSearch = useCallback(debounce(fetchSearchResults, 500), [])

    const handleOnSearch = (event) => {
        const value = event.target.value
        setSearchValue(value)
        debouncedSearch(value)
    }

    const clearSearchValue = () => {
        setSearchValue('')
        setSearchResults('')
    }

    const searchFunction = (dataArr = [], query) => {
        if (!query) return dataArr
        const searchQuery = query.toLowerCase()
        return dataArr.filter((item) => item?.playerName?.toLowerCase()?.includes(searchQuery))
    }

    useEffect(() => {
        if (searchValue) {
            const data = searchFunction(playerData, searchValue)
            setShowPlayerData(data)
        }
    }, [searchValue, playerData])

    // Initialize current bid when player changes or auction data loads
    useEffect(() => {
        if (auctiondata) {
            setCurrentBid(auctiondata.minimum_bid || 0)
            setUpdateInputBid(auctiondata.minimum_bid || '')
        }
    }, [auctiondata, displayPlayerIndex])

    // Handle team bidding
    const handleTeamBid = (team) => {
        if (currentTeamBidding?.id !== team?.id) {
            setCurrentTeamBidding(team)
            if (currentTeamBidding !== null) {
                const sum = Number(currentBid) + Number(auctiondata?.bid_increase_by)
                setCurrentBid(sum)
            }
        }
    }

    // bidding up and Down
    const handleBidUpDown = (action) => {
        if (!auctiondata && !action) return
        let current = Number(currentBid)
        const increment = Number(auctiondata?.bid_increase_by) || 100
        const minBid = Number(auctiondata.minimum_bid)

        if (action === 'up') {
            current = current + increment
        } else {
            if (current > auctiondata.minimum_bid) {
                current = Math.max(minBid, current - increment)
            }
        }
        setCurrentBid(current)
    }

    // auction player Change
    const handleRandomPlayerChange = () => {
        if (displayPlayerIndex < playerData.length - 1) {
            setDisplayPlayerIndex(prev => prev + 1)
        } else {
            setDisplayPlayerIndex(0)
        }
        setCurrentTeamBidding(null)
    }

    const bidHandling = (key) => {
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
                handleWhatOpen('player')
                break
            default:
                return
        }
    }

    // update bid using custom
    const handleOnChange = (val, key) => {
        setUpdateInputBid(val)
        setError({})
    }

    // confirm input bid Amount
    const submitBidAmount = () => {
        const minBid = Number(auctiondata.minimum_bid)
        if (updateInputBid < minBid) {
            setError({
                'bid_amount': 'Bid value must be greater than minimum value'
            })
            return
        }
        setCurrentBid(updateInputBid)
        handleClose()
    }

    // handle Modal content show
    const handleWhatOpen = (type) => {
        setWhatOpen(type)
        setSelectManualPlayer(displayPlayerIndex)
        setOpen(true)
    }

    const handleManualPlayerSelection = () => {
        setDisplayPlayerIndex(selectManualPlayer)
        handleClose()
    }

    return (
        <Box className='live-auction'>
            <Box className='live-auction-header-main'>
                <CustomeBack />
                <Typography variant='h6' className="header-title">Auction</Typography>
                <SvgIcon id={'three-dot-menu'} className='menu_auction_icon' />
            </Box>

            {playerData.length > 0 && (
                <Box className='au-player-details'>
                    <Box
                        className='au-pl-img'
                        sx={{
                            backgroundColor: !player?.playerImage ? player?.playerColor : ''
                        }}
                    >
                        {player?.playerImage ? (
                            <Image
                                src={player?.playerImage}
                                alt="player"
                                width={100}
                                height={100}
                                unoptimized
                            />
                        ) : (
                            <Typography variant='h6'>{player?.letter}</Typography>
                        )}
                    </Box>
                    <Box className='au-pl-details'>
                        <Typography variant='h6' className="auction-player">{player?.playerName}</Typography>
                        <Box className='auction-bidding'>
                            <SvgIcon id='gold-coin' className='gold-coin' />
                            <Typography variant='h6' className="bidding-count">{currentBid}</Typography>
                            <SvgIcon id='edit' className='edit-icon' onClick={() => handleWhatOpen('bid')} />
                        </Box>
                        <Typography variant='h6' className="auction-team-name">
                            {currentTeamBidding ? currentTeamBidding.team_name : "No bidder"}
                        </Typography>
                    </Box>
                </Box>
            )}

            <Box className='auction-team'>
                {teamsData.length > 0 && teamsData.map((item, i) => {
                    const totalCoins = formatNumberShort(auctiondata?.auction_team_balance_point)
                    return (
                        <Box
                            className={`team_card ${currentTeamBidding?.id === item.id ? 'active-bidder' : ''}`}
                            key={i}
                            onClick={() => handleTeamBid(item)}
                        >
                            <Box
                                className='team-logo'
                                sx={{
                                    backgroundColor: !item?.team_logo ? item?.team_color : ''
                                }}
                            >
                                {item?.team_logo ? (
                                    <Image
                                        src={item?.team_logo}
                                        alt="team logo"
                                        width={100}
                                        height={100}
                                        unoptimized
                                    />
                                ) : (
                                    <Typography variant="h6">{item?.letter}</Typography>
                                )}
                            </Box>
                            <Box className='team_details'>
                                <Typography variant="h6">{item?.team_name}</Typography>
                                <Typography variant="h6">
                                    <SvgIcon id={'gold-coin'} />
                                    <span>{`100K/${totalCoins}`}</span>
                                </Typography>
                                <Typography variant="h6">Max Bid : 80K</Typography>
                            </Box>
                        </Box>
                    )
                })}
            </Box>

            <Box className='button-group'>
                {btnGroup.map((item, i) => (
                    <Button
                        variant='contained'
                        className='action-btn'
                        key={i}
                        onClick={() => bidHandling(item?.keyname)}
                    >
                        <SvgIcon id={item?.icon} />
                        <span>{item?.name}</span>
                    </Button>
                ))}
            </Box>

            <CustomeModal open={open} bgColor={'var(--text-white)'}>
                <Box className='auction_modal'>
                    <Box className='auction-modal-header'>
                        <Typography variant="h6">
                            {isWhatOpen === 'player' ? 'Select Player Manually' : 'Update Auction Bid'}
                        </Typography>
                        <CloseRoundedIcon onClick={handleClose} />
                    </Box>

                    {isWhatOpen === 'player' && (
                        <Box className='auction-player-section'>
                            <Box sx={{ marginBottom: '20px' }}>
                                <SearchInput
                                    placeholder='Search Player'
                                    onChange={handleOnSearch}
                                    onClear={clearSearchValue}
                                />
                            </Box>
                            {showPlayerData.map((item, i) => {
                                const isSelect = selectManualPlayer === i
                                return (
                                    <Box
                                        className='manual-player-selection'
                                        key={i}
                                        onClick={() => setSelectManualPlayer(i)}
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
                                                        src={item.playerImage}
                                                        alt="player"
                                                        width={50}
                                                        height={50}
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

                    {isWhatOpen === 'bid' && (
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

                    {isWhatOpen === 'player' ? (
                        <CustomeButton title='Done' onClick={handleManualPlayerSelection} />
                    ) : (
                        <CustomeButton title='Update' onClick={submitBidAmount} />
                    )}
                </Box>
            </CustomeModal>
        </Box>
    )
}

export default LiveAuctionPage