'use client'
import CustomeMessageBox from '@/components/common/commonUi/CustomeMessageBox';
import MatchCard from '@/components/common/commonUi/MatchCard/MatchCard';
import { Box } from '@mui/material';
import { useEffect, useState } from 'react';
import './Match.css';

const tabKeys = [
    { id: 0, label: 'Live', key_name: 'live' },
    { id: 1, label: 'Upcoming', key_name: 'upcoming' },
    { id: 2, label: 'Past', key_name: 'past' },
]

const MatchPage = ({ teamData, tournamentData, matchData, tournamenId }) => {

    const [activeTab, setActiveTab] = useState(0);
    const [matches, setMatches] = useState([])
    const [animation, setAnimation] = useState(false)
    const [addMargin, setAddMargin] = useState(false)

    useEffect(() => {
        if (activeTab === 0) {
            let matchesFilter = matchData.filter((item) => item?.status === 3);
            setMatches(matchesFilter || [])
        }
    }, [matchData]);

    useEffect(() => {
        const tabElement = document.getElementById("tab-list");
        const pageTabElement = document.getElementById("user-sub-tab");
        const mainContainer = document.getElementById("mainContainer");
        if (!mainContainer || !tabElement || !pageTabElement) return

        const handleScroll = () => {
            const tabTop = tabElement.getBoundingClientRect().top;

            if (tabTop <= 0) {
                if (tabElement.classList.contains("sticky-tab-list")) {
                    setAddMargin(tabTop <= 0)
                    pageTabElement.classList.add("userSubTab");
                    pageTabElement.style.top = tabElement.offsetHeight + 'px'
                }
            } else {
                setAddMargin(tabTop <= 0)
                pageTabElement.classList.remove("userSubTab");
                pageTabElement.style = ''
            }
        };

        mainContainer.addEventListener("scroll", handleScroll);
        return () => mainContainer.removeEventListener("scroll", handleScroll);
    }, []);

    const handleTabClick = (val) => {
        setAnimation(true)
        let matchesFilter;
        switch (val) {
            case 0:
                matchesFilter = matchData.filter((item) => item?.status === 3);
                break;
            case 1:
                matchesFilter = matchData.filter((item) => item?.status === 1 || item?.status === 2);
                break;
            case 2:
                matchesFilter = matchData.filter((item) => item?.status === 4);
                break;

            default:
                break;
        }
        setMatches(matchesFilter || [])
        setActiveTab(val)
        let timer = setTimeout(() => setAnimation(false), 500);
        return clearTimeout(timer)
    }

    return (
        <Box className='activeAnimation'>
            <Box className='matchOption' id='user-sub-tab'>
                {
                    tabKeys.map((field, index) => (
                        <Box
                            key={index}
                            className={`Details ${activeTab === field.id ? 'active' : ' '}`}
                            onClick={() => handleTabClick(field.id)}
                        >
                            <h2 className='matchText'>{field.label}</h2>
                        </Box>
                    ))
                }
            </Box>

            <Box className='match_list_main_section' sx={{ marginTop: addMargin ? '14px' : '0' }}>
                <MatchCard
                    matches={matches}
                    animation={animation}
                    tournamentData={tournamentData}
                    activeTab={activeTab}
                    isAdmin={false}
                />
                {
                    matches.length <= 0 &&
                    <Box className='user_message_box'>
                        <CustomeMessageBox icon='batsman2' title='Match Guide'
                            describe='Quickly start or schedule matches with ease. Get personalized suggestions based on your preferences'
                        />
                    </Box>
                }
            </Box>

        </Box>
    )

}

export default MatchPage