'use client'
import SvgIcon from "@/assets/icons/SvgIcon"
import { debounce } from "@/components/common/commomFunction"
import CustomeBack from "@/components/common/commonUi/CustomeBack"
import CustomeTabs from "@/components/common/commonUi/CustomeTabs"
import SearchInput from "@/components/common/commonUi/SearchInput/SearchInput"
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import { Box, Typography } from "@mui/material"
import Image from "next/image"
import { useParams } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import './AuctionPlayers.css'
import { useSelector } from "react-redux"
import { teamsState } from "@/redux/slices/teamSlice"
import { playersState } from "@/redux/slices/playersSlice"
import { auctionState } from "@/redux/slices/auctionSlice"
import { tournamentState } from "@/redux/slices/tournamentSlice"
import Avtar from "@/components/common/commonUi/Avtar/Avtar"

const tournamentTabs = [
    { label: 'Sold', value: 0 },
    { label: 'Unsold', value: 1 },
    { label: 'Available', value: 2 }
]

const AuctionplayerCard = ({ name, price, team, letter, bgColor, image }) => {
    return (
        <Box className='auction_player_card'>
            <Box className='plyer_img'>
                {image ? <Image src={require('../../../assets/img/profiledummy.png')} alt='auction' unoptimized />
                    :
                    <Box className='player_avatar' sx={{backgroundColor: bgColor}}>
                        <Typography variant="body2">{letter}</Typography>
                    </Box>
                }
            </Box>
            <Box className='auction_player_details'>
                <Typography variant="h6" className="player_name">{name}</Typography>
                <Typography variant="h6" className="coins">
                    <SvgIcon id='gold-coin' />
                    <span>{price}</span>
                </Typography>
                <Typography variant="h6" className="team_name">{team}</Typography>
            </Box>
        </Box>
    )
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
    const [tournamentData, setTournamentData] = useState({})
    const [currentTabPlayers, setCurrentTabPlayers] = useState([])
    const team_data = useSelector(teamsState)
    const player_data = useSelector(playersState)
    const auction_data = useSelector(auctionState)
    const tournament_data = useSelector(tournamentState)

    useEffect(() => {
        let currentAuction = auction_data?.data?.find((items) => items?.id === auctionId)
        let currentTournament = tournament_data?.data?.find((items) => items?.id === currentAuction?.tournamentId)
        let currentTournamentTeam = team_data?.data?.filter((items) => items?.tournamentId === currentAuction?.tournamentId)
        let currentTournamentPlayer = player_data?.data?.filter((items) => items?.tournamentId === currentAuction?.tournamentId)
        setAuctionData(currentAuction)
        setTournamentData(currentTournament)
        setTeamData(currentTournamentTeam)
        setPlayerData(currentTournamentPlayer)
    }, [auction_data, tournament_data, player_data, team_data])

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
    const debouncedSearch = useCallback(debounce(fetchSearchResults, 500), []);

    const handleOnSearch = (event) => {
        let value = event.target.value
        setSearchValue(value)
        debouncedSearch(value)
    }

    const clearSearchValue = () => {
        setSearchValue('')
        setSearchResults('')
    }

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
            {showSearchBar && <Box className='auction_search_box_main' >
                <SearchInput value={searchValue} onChange={(e) => handleOnSearch(e)} onClear={clearSearchValue} />
            </Box>}
            <CustomeTabs data={tournamentTabs || []} onClick={handleTabClick} activeTab={activeTab} />
            {
                currentTabPlayers.length > 0 && currentTabPlayers.map((items, i) => {
                    const player = playerData.find((item) => item?.id === items?.soldPlayer|| item?.id === items?.unsoldPlayer || item?.id === items?.id)
                    const team = teamData.find((item) => item?.id === items?.teamId)

                    return (
                        <Box key={i}>
                            <AuctionplayerCard letter={player?.letter || ''} bgColor={player?.playerColor || ''} image={player?.playerImage || ''} name={player?.playerName} price={items?.bidPrice} team={team?.team_name} />
                        </Box>
                    )
                })
            }
            {/* <AuctionplayerCard /> */}
        </Box>
    )
}

export default AuctionPlayersPage