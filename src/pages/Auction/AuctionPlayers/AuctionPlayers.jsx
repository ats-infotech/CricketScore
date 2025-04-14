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
import { useCallback, useState } from "react"
import './AuctionPlayers.css'

const tournamentTabs = [
    { label: 'Sold', value: 0 },
    { label: 'Unsold', value: 1 },
    { label: 'Available', value: 2 }
]

const AuctionplayerCard = () => {
    return (
        <Box className='auction_player_card'>
            <Box className='plyer_img'>
                <Image src={require('../../../assets/img/profiledummy.png')} alt='auction' unoptimized />
            </Box>
            <Box className='auction_player_details'>
                <Typography variant="h6" className="player_name">Naman Lal</Typography>
                <Typography variant="h6" className="coins">
                    <SvgIcon id='gold-coin' />
                    <span>100K</span>
                </Typography>
                <Typography variant="h6" className="team_name">RCB</Typography>
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


    console.log(auctionId, 'auctionId');

    const handleTabClick = (val) => {
        setActiveTab(val)
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
            <AuctionplayerCard />
        </Box>
    )
}

export default AuctionPlayersPage