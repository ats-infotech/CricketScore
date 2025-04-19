import SvgIcon from "@/assets/icons/SvgIcon";
import { CheckTournamentIsRunning, DateFormat, debounce } from "@/components/common/commomFunction";
import CustomeButton from "@/components/common/commonUi/CustomeButton";
import CustomeMessageBox from "@/components/common/commonUi/CustomeMessageBox";
import { auctionState } from "@/redux/slices/auctionSlice";
import { Box, Tab, Tabs, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import CustomeTabs from "../../components/common/commonUi/CustomeTabs";
import Menubar from "../../components/common/commonUi/Menubar/Menubar";
import SearchInput from "../../components/common/commonUi/SearchInput/SearchInput";
import './Tournament.css';

const pageTabs = [
    { title: 'All', value: 0 },
    { title: 'Tournament', value: 1 },
    { title: 'Upcoming', value: 2 },
    // { title: 'Result', value: 3 },
]

const tournamentTabs = [
    { label: 'Live', value: 0 },
    { label: 'Upcoming', value: 1 },
    { label: 'Past', value: 2 }
]

const Tournament = ({ tournamentData, matchData, type }) => {
    const router = useRouter()
    const [t_data, setT_Data] = useState([])
    const [openDrawer, setOpenDrawer] = useState(false)
    const [activeUserTab, setActiveUserTab] = useState(0)
    const [activeTournamentTab, setActiveTournamentTab] = useState(0)
    const [animation, setAnimation] = useState(false)
    const [searchValue, setSearchValue] = useState("");
    const [searchResults, setSearchResults] = useState('');

    const auctionstate = useSelector(auctionState)

    const handleOpen = () => setOpenDrawer(true)
    const handleClose = () => setOpenDrawer(false)

    const searchFunction = (dataArr = [], query) => {
        if (!query) return dataArr;
        const searchQuery = query.toLowerCase();
        return dataArr.filter((item) =>
        (item?.tournament_name?.toLowerCase()?.includes(searchQuery) ||
            item?.tournament_location?.toLowerCase()?.includes(searchQuery) ||
            item?.ground?.toLowerCase()?.includes(searchQuery) ||
            // item?.organizer_name?.toLowerCase()?.includes(searchQuery) ||
            item?.tournaments_category?.toLowerCase()?.includes(searchQuery))
        );
    };

    useEffect(() => {
        if (tournamentData) {
            let tournamentFilter;
            if (type === 'admin') {
                tournamentFilter = tournamentData.filter((item) => CheckTournamentIsRunning(item?.tournament_start_date, item?.tournament_end_date) === 'live');
            } else {
                tournamentFilter = tournamentData;
            }

            if (!searchResults) {
                setT_Data(tournamentFilter || [])
            }

        }
    }, [tournamentData]);

    useEffect(() => {
        if (type === 'admin') {
            handleTabClick(activeTournamentTab)
        } else {
            handleUserTab(activeUserTab)
        }

    }, [searchResults]);

    const handleTabClick = (val) => {
        if (tournamentData) {
            setAnimation(true)
            let tournamentFilter;
            switch (val) {
                case 0:
                    tournamentFilter = tournamentData.filter((item) => CheckTournamentIsRunning(item?.tournament_start_date, item?.tournament_end_date) === 'live');
                    break;
                case 1:
                    tournamentFilter = tournamentData.filter((item) => CheckTournamentIsRunning(item?.tournament_start_date, item?.tournament_end_date) === 'upcoming');
                    break;
                case 2:
                    tournamentFilter = tournamentData.filter((item) => CheckTournamentIsRunning(item?.tournament_start_date, item?.tournament_end_date) === 'completed');
                    break;

                default:
                    break;
            }
            setActiveTournamentTab(val)
            if (searchResults.trim() !== '') {
                setT_Data(searchFunction(tournamentFilter, searchResults))
            } else {
                setT_Data(tournamentFilter || [])
            }
            let timer = setTimeout(() => setAnimation(false), 500);
            return () => clearTimeout(timer)
        }
    }

    const handleUserTab = (val) => {
        setAnimation(true)
        let tournamentFilter;
        switch (val) {
            case 0:
                tournamentFilter = tournamentData;
                break;
            case 1:
                tournamentFilter = tournamentData
                break;
            case 2:
                tournamentFilter = tournamentData.filter((item) => CheckTournamentIsRunning(item?.tournament_start_date, item?.tournament_end_date) === 'upcoming');
                break;

            default:
                break;
        }
        setActiveUserTab(val)
        if (searchResults.trim() !== '') {
            setT_Data(searchFunction(tournamentFilter, searchResults))
        } else {
            setT_Data(tournamentFilter || [])
        }
        let timer = setTimeout(() => setAnimation(false), 500);
        return () => clearTimeout(timer)
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
        if (type === 'admin') {
            handleTabClick(activeTournamentTab)
        } else {
            handleUserTab(activeUserTab)
        }
    }


    const handleTournamentRedirect = (item) => {
        const auctionData = auctionstate?.data.find((items) => items?.tournamentId === item?.id)
        const isAuction = auctionData && auctionData?.auctionStatus !== 3
        const subPath = isAuction ? 'auction' : 'match'
        type !== 'admin' ?
            router.push(`tournament/${item?.id}/${subPath}`) :
            router.push(`mytournament/${item?.id}/${subPath}`)
    }

    return (
        <Box className='tournamentPageMain'>
            <Box className='tournament_page_menu'>
                <SvgIcon id='three-line-menu' onClick={handleOpen} />
                <Box className='notificationBox'>
                    <SvgIcon id='notification' />
                </Box>
            </Box>
            <Box className='search_box_main' >
                <SearchInput value={searchValue} onChange={(e) => handleOnSearch(e)} onClear={clearSearchValue} />
            </Box>
            {
                type !== 'admin' &&
                <Box className='tournament_tab_main'>
                    <Tabs variant="scrollable" value={activeUserTab} onChange={(event, newValue) => handleUserTab(newValue)}>
                        {
                            pageTabs.length > 0 && pageTabs.map((item, i) => {
                                return (
                                    <Tab label={item?.title} value={item?.value} key={item?.title} />
                                )
                            })
                        }
                    </Tabs>
                </Box>}
            {type === 'admin' && tournamentData?.length > 0 &&
                <Box className='tournamentTabs'>
                    <CustomeTabs data={tournamentTabs || []} onClick={handleTabClick} activeTab={activeTournamentTab} />
                </Box>
            }
            <Box className={`all_tournaments ${type === 'admin' ? 'adminHeight' : ''} ${animation ? 'activeAnimation' : ''} `}>
                {
                    t_data.length > 0 && t_data.map((item, i) => {
                        return (
                            <Box key={i} sx={{ backgroundImage: `url('${item?.tournament_banner}')`, backgroundColor: `${!item?.tournament_banner ? item?.tournament_logo_color : ""}` }} className='tournament-card' onClick={() => handleTournamentRedirect(item)}>
                                <Box className='tournament-details'>
                                    <Typography variant="h6">{item?.tournament_name}</Typography>
                                    <Typography variant="body2">{DateFormat(item?.tournament_start_date)}{' To '} {DateFormat(item?.tournament_end_date)} </Typography>
                                    <Typography variant="body2" className="tournament-location">
                                        <SvgIcon id='location' width={14} height={14} />
                                        <span>{item?.ground}</span>
                                    </Typography>
                                </Box>
                                <Box className='more-deatils-icon'>
                                    <SvgIcon id='long-up-arrow' width={14} height={14} />
                                </Box>
                            </Box>
                        )
                    })
                }
                {
                    t_data.length === 0 &&
                    <CustomeMessageBox icon='tournamentcup' title='Tournament Guide'
                        describe={`${type !== 'admin' ?
                            'Currently, there are no upcoming tournaments available. Please stay tuned for future updates.' :
                            'Quickly start or schedule matches with ease.Get personalized suggestions based on your preferences'}`}
                    >
                        {
                            // type === 'admin' ?
                            <Box className='create_tournament_button'>
                                <CustomeButton width={'100%'} height={'50px'} bgColor={'var(--primary-color) !important'} hover='none' title='Create Your Tournaments' onClick={() => router.push('/registeredTornaments')} />
                            </Box>
                            // : ''
                        }
                    </CustomeMessageBox>
                }
            </Box>
            <Menubar open={openDrawer} handleClose={handleClose} />
        </Box>
    )
}

export default Tournament