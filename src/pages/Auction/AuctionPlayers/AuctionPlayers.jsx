'use client'
import SvgIcon from "@/assets/icons/SvgIcon"
import { debounce, formatNumberShort } from "@/components/common/commomFunction"
import CustomeBack from "@/components/common/commonUi/CustomeBack"
import CustomeMessageBox from "@/components/common/commonUi/CustomeMessageBox"
import CustomeTabs from "@/components/common/commonUi/CustomeTabs"
import PlayerCard from "@/components/common/commonUi/PlayerCard/PlayerCard"
import SearchInput from "@/components/common/commonUi/SearchInput/SearchInput"
import { auctionState } from "@/redux/slices/auctionSlice"
import { playersState } from "@/redux/slices/playersSlice"
import { teamsState } from "@/redux/slices/teamSlice"
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import { Box, Typography } from "@mui/material"
import { useParams } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import { useSelector } from "react-redux"
import './AuctionPlayers.css'

const tournamentTabs = [
    { label: 'Sold', value: 0 },
    { label: 'Unsold', value: 1 },
    { label: 'Available', value: 2 }
]

const ErrorObj = {
    0: { title: 'Sold player', desc: 'No players went sold yet' },
    1: { title: 'Unsold players', desc: 'No players went unsold yet' },
    2: { title: 'Available player', desc: 'No players available' },
}

const AuctionPlayersPage = () => {
    const { auctionId } = useParams()
    const [activeTab, setActiveTab] = useState(0)
    const [searchValue, setSearchValue] = useState("");
    const [searchResults, setSearchResults] = useState('');
    const [showSearchBar, setShowSearchBar] = useState(false)
    const [teamData, setTeamData] = useState([])
    const [playerData, setPlayerData] = useState([])
    const [auctionData, setAuctionData] = useState({})
    const [currentTabPlayers, setCurrentTabPlayers] = useState([])

    const team_data = useSelector(teamsState)
    const player_data = useSelector(playersState)
    const auction_data = useSelector(auctionState)

    useEffect(() => {
        let currentAuction = auction_data?.data?.find((items) => items?.id === auctionId)
        let currentTournamentTeam = team_data?.data?.filter((items) => items?.tournamentId === currentAuction?.tournamentId)
        let currentTournamentPlayer = player_data?.data?.filter((items) => items?.tournamentId === currentAuction?.tournamentId)
        setAuctionData(currentAuction)
        setTeamData(currentTournamentTeam)
        setPlayerData(currentTournamentPlayer)
    }, [auction_data, player_data, team_data])

    useEffect(() => {
        switch (activeTab) {
            case 0:
                setCurrentTabPlayers(auctionData?.soldPlayers || []);
                break;
            case 1:
                setCurrentTabPlayers(auctionData?.unsoldPlayers || []);
                break;
            case 2:
                setCurrentTabPlayers(
                    playerData.filter((item) =>
                        item?.tournamentId === auctionData?.tournamentId &&
                        !auctionData?.soldPlayers?.some(sold => sold?.soldPlayer === item?.id) &&
                        !auctionData?.unsoldPlayers?.some(unsold => unsold?.unsoldPlayer === item?.id)
                    ),
                );
                break;
            default:
                break;
        }
    }, [activeTab, auctionData, playerData]);

    const handleTabClick = (val) => {
        setActiveTab(val)
        switch (val) {
            case 0:
                setCurrentTabPlayers(auctionData?.soldPlayers || [])
                break;
            case 1:
                setCurrentTabPlayers(auctionData?.unsoldPlayers || [])
                break;
            case 2:
                setCurrentTabPlayers(
                    playerData.filter((item) =>
                        item?.tournamentId === auctionData?.tournamentId
                        && !auctionData?.soldPlayers?.some(sold => sold?.soldPlayer === item?.id)
                        && !auctionData?.unsoldPlayers?.some(unsold => unsold?.unsoldPlayer === item?.id)
                    ),
                )
                break;
            default:
                break;
        }
    }

    const handleSearchBarShow = () => {
        setShowSearchBar(!showSearchBar)
    }

    const fetchSearchResults = (query) => {
        setSearchResults(query)
    }

    const debouncedSearch = useCallback(debounce(fetchSearchResults, 500), [])

    const handleOnSearch = (event) => {
        let value = event.target.value
        setSearchValue(value)
        debouncedSearch(value)
    }

    const clearSearchValue = () => {
        setSearchValue('')
        setSearchResults('')
    }

    // Filter players by search text
    const filteredPlayers = currentTabPlayers.filter((items) => {
        const player = playerData.find((item) =>
            item?.id === items?.soldPlayer || item?.id === items?.unsoldPlayer || item?.id === items?.id
        );
        if (!player) return false;
        const playerName = player?.playerName?.toLowerCase() || '';
        return playerName.includes(searchResults.toLowerCase());
    });

    return (
        <Box className='auction-players-page'>
            <Box className='auction-header-main'>
                <CustomeBack />
                <Typography variant='h6' className="header-title">Players</Typography>
                {showSearchBar ?
                    <CloseRoundedIcon onClick={handleSearchBarShow} />
                    :
                    <SvgIcon id={showSearchBar ? 'close' : 'search'} className='auction_icon' onClick={handleSearchBarShow} />
                }
            </Box>

            {showSearchBar && (
                <Box className='auction_search_box_main'>
                    <SearchInput value={searchValue} placeholder="Search Player" onChange={(e) => handleOnSearch(e)} onClear={clearSearchValue} />
                </Box>
            )}

            <CustomeTabs data={tournamentTabs || []} onClick={handleTabClick} activeTab={activeTab} />

            <Box className={`auctioned_players_data ${showSearchBar ? 'active' : ''}`}>
                {
                    filteredPlayers.length > 0 ?
                        filteredPlayers.map((items, i) => {
                            const player = playerData.find((item) =>
                                item?.id === items?.soldPlayer || item?.id === items?.unsoldPlayer || item?.id === items?.id
                            )
                            const team = teamData.find((item) => item?.id === items?.teamId)
                            const playerAmount = formatNumberShort(items?.bidPrice)

                            const data = {
                                playerName: player?.playerName,
                                playerImage: player?.playerImage,
                                playerColor: player?.playerColor || '',
                                letter: player?.letter || '',
                                teamName: team?.team_name,
                                playerAmount: playerAmount
                            }

                            return (
                                <Box key={i}>
                                    <PlayerCard data={data} isUser={true} isMVP={activeTab === 0} />
                                </Box>
                            )
                        })
                        :
                        <CustomeMessageBox
                            title={searchResults ? 'No Results Found' : `${ErrorObj?.[activeTab]?.title}`}
                            describe={searchResults ? '⚠️ No players match your search.' : `⚠️ ${ErrorObj?.[activeTab]?.desc}`}
                        />
                }
            </Box>
        </Box>
    )
}

export default AuctionPlayersPage