'use client'
import SvgIcon from "@/assets/icons/SvgIcon";
import { DateFormat } from "@/components/common/commomFunction";
import CustomeButton from "@/components/common/commonUi/CustomeButton";
import CustomeMessageBox from "@/components/common/commonUi/CustomeMessageBox";
import { statusUpdateAuction } from "@/redux/slices/auctionSlice";
import { playersState } from "@/redux/slices/playersSlice";
import { teamsState } from "@/redux/slices/teamSlice";
import { Box, Typography } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import './AuctionPage.css';

const AuctionPage = ({ tournamentData, isUser = false }) => {
    const router = useRouter()
    const dispatch = useDispatch()
    const auctionState = useSelector(state => state?.auction)
    const teamState = useSelector(teamsState)
    const playerState = useSelector(playersState)
    const auctionData = auctionState?.data.length > 0 && auctionState?.data.find((item) => item?.tournamentId === tournamentData?.id) || null
    const teamData = teamState?.data.length > 0 && teamState?.data.filter((item) => item?.tournamentId === tournamentData?.id) || []
    const playerData = playerState?.data.length > 0 && playerState?.data.filter((item) => item?.tournamentId === tournamentData?.id) || []
    const auctionTime = new Date(auctionData?.auction_time)
    const formattedTime = auctionTime.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });

    const isAuctionCreated = auctionData && Object.keys(auctionData).length > 0
    const isStartAuction = teamData.length >= 2 && playerData.length >= 4
    const isAuctionCompleted = auctionData?.auctionStatus === 3
    const isAuctionLive = auctionData?.auctionStatus === 2

    const handleScheduleAuction = () => {
        router.push(`/create-auction/${tournamentData?.id}`)
    }

    const handleUpdateAuction = () => {
        router.push(`/update-auction/${tournamentData?.id}`)
    }

    const handleAuctionRedirect = async (type) => {
        if (type === 'live') {
            const payload = {
                ...auctionData,
                auctionStatus: 2
            }
            const res = await dispatch(statusUpdateAuction(payload))
            if (res) {
                router.push(`/live-auction/${auctionData?.id}`)
            }
        } else if (type === 'view') {
            router.push(`/auction-players/${auctionData?.id}`)
        } else {
            router.push(`/auction-mvp/${auctionData?.id}`)
        }
    }

    const ViewLiveAuction = () => {
        router.push(`/live-auction-view/${auctionData?.id}`)
    }

    return (
        <Box className='auction_page_main'>
            {isAuctionCreated &&
                <Box className='auction_card'>
                    <Box className={`auction_image ${!tournamentData?.tournament_image ? 'isText' : ''}`}
                        sx={{
                            backgroundColor: !tournamentData?.tournament_image ? tournamentData?.tournament_logo_color : ''
                        }}
                    >
                        {tournamentData?.tournament_image ? <Image src={`${tournamentData?.tournament_image}`} alt="auction" unoptimized width={80} height={80} />
                            :
                            <Typography variant="h5">{tournamentData?.letter}</Typography>
                        }
                    </Box>
                    <Box className='auction-details'>
                        <Typography variant="h5">{tournamentData?.tournament_name}</Typography>
                        <Box className='icon-text-row'>
                            <Typography className="icon-text">
                                <SvgIcon id='calender' />
                                <span>{DateFormat(auctionData?.auction_date)}</span>
                            </Typography>
                            <Typography className="icon-text">
                                <SvgIcon id='clock' />
                                <span>{`${formattedTime}`}</span>
                            </Typography>
                        </Box>
                        <Typography className="icon-text" sx={{ marginBottom: '10px' }}>
                            <SvgIcon id='add-player' />
                            <span>{`${auctionData?.player_per_team} PI/Team`}</span>
                        </Typography>
                        <Typography className="icon-text">
                            <SvgIcon id='auction-thor' />
                            <span>{`${auctionData?.auction_team_balance_point} Pts/Team`}</span>
                        </Typography>
                    </Box>
                    {!isUser && !auctionState?.auction && !isAuctionCompleted ? <SvgIcon id='edit' className='menu-icon' onClick={handleUpdateAuction} /> : <Box></Box>}
                </Box>
            }
            {isAuctionCreated ?
                <>
                    <Box className='auction_btn_row'>
                        {!isUser && !isAuctionCompleted ?
                            <CustomeButton title={"Start Auction"} width={'50%'} height={'50px'} hover={'none'} onClick={() => handleAuctionRedirect('live')} disabled={!isStartAuction} /> :
                            isAuctionCompleted && <CustomeButton title={"Auction Mvp"} width={'50%'} height={'50px'} hover={'none'} onClick={() => handleAuctionRedirect('mvp')} />}
                        {isUser && isAuctionLive && <CustomeButton title={"Live Auction"} width={'50%'} height={'50px'} hover={'none'} onClick={ViewLiveAuction} />}
                        <CustomeButton title={"View Auction"} width={'50%'} height={'50px'} hover={'none'} onClick={() => handleAuctionRedirect('view')} />
                    </Box>
                    {!isUser && !isStartAuction &&
                        <>
                            <Typography variant="h6" className="describe-msg"> 🚀 Auction Start Instructions: </Typography>
                            <Typography variant="h6" className="describe-msg">📌 please add at least 2 teams and a minimum of 4 players to start the auction.</Typography>
                        </>
                    }
                </>
                :
                <>
                    <CustomeMessageBox icon='teams2' title='Auction Guide'
                        describe={!isUser ? 'Quickly Add Auction with ease. Get personalized suggestions based on your preferences' : 'Currently, there are no auctions scheduled. Please check back later for updates. Once an auction is scheduled, you will be able to view the details here.'}
                    >
                    </CustomeMessageBox>
                    {!isUser && <Box sx={{ marginTop: '40px' }}>
                        <CustomeButton
                            title={"Schedule Auction"}
                            width={'80%'}
                            height={'50px'}
                            hover={'none'}
                            bgColor={'transparent'}
                            color={'var(--theme-primary)'}
                            border={'2px solid var(--theme-primary)'}
                            onClick={handleScheduleAuction}
                        />
                    </Box>}
                </>
            }
        </Box>
    )
}

export default AuctionPage;