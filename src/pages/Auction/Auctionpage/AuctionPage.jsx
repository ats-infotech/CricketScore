import SvgIcon from "@/assets/icons/SvgIcon";
import { DateFormat } from "@/components/common/commomFunction";
import CustomeButton from "@/components/common/commonUi/CustomeButton";
import CustomeMessageBox from "@/components/common/commonUi/CustomeMessageBox";
import { Box, Typography } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import './AuctionPage.css';

const AuctionPage = ({ tournamentData, isUser = false }) => {
    const router = useRouter()
    const auctionState = useSelector(state => state?.auction)
    const auctionData = auctionState?.data.length > 0 && auctionState?.data.find((item) => item?.tournamentId === tournamentData?.id) || null
    const isAuctionCompleted = auctionData && Object.keys(auctionData).length > 0

    const handleScheduleAuction = () => {
        router.push(`/create-auction/${tournamentData?.id}`)
    }

    const handleUpdateAuction = () => {
        router.push(`/update-auction/${tournamentData?.id}`)
    }

    const handleAuctionRedirect = (type) => {
        if (type === 'live') {
            router.push(`/live-auction/${auctionData?.id}`)
        } else {
            router.push(`/auction-players/${auctionData?.id}`)
        }
    }


    return (
        <Box className='auction_page_main'>
            {isAuctionCompleted &&
                <Box className='auction_card'>
                    <Box className={`auction_image ${!tournamentData?.tournament_image ? 'isText' : ''}`}
                        sx={{
                            backgroundColor: !tournamentData?.tournament_image ? tournamentData?.tournament_logo_color : ''
                        }}
                    >
                        {tournamentData?.tournament_image ? <Image src={`/${tournamentData?.tournament_image}`} alt="auction" unoptimized width={80} height={80} />
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
                                <SvgIcon id='add-player' />
                                <span>{`${auctionData?.player_per_team} PI/Team`}</span>
                            </Typography>
                        </Box>
                        <Typography className="icon-text">
                            <SvgIcon id='auction-thor' />
                            <span>{`${auctionData?.auction_team_balance_point} Pts/Team`}</span>
                        </Typography>
                    </Box>
                    {!isUser && !auctionState?.auction && <SvgIcon id='edit' className='menu-icon' onClick={handleUpdateAuction} />}
                </Box>
            }
            {isAuctionCompleted ?
                <Box className='auction_btn_row'>
                    {!isUser && <CustomeButton title={"Start Auction"} width={'50%'} height={'50px'} hover={'none'} bgColor={'var(--primary-color)'} onClick={() => handleAuctionRedirect('live')} />}
                    <CustomeButton title={"View Auction"} width={'50%'} height={'50px'} hover={'none'} bgColor={'var(--primary-color)'} onClick={() => handleAuctionRedirect('view')} />
                </Box>
                :
                <>
                    <CustomeMessageBox icon='teams2' title='Auction Guide'
                        describe='Quickly Add Auction with ease. Get personalized suggestions based on your preferences'
                    >
                    </CustomeMessageBox>
                    <Box sx={{ marginTop: '40px' }}>
                        <CustomeButton
                            title={"Schedule Auction"}
                            width={'80%'}
                            height={'50px'}
                            hover={'none'}
                            bgColor={'var(--primary-color)'}
                            onClick={handleScheduleAuction}
                        />
                    </Box>
                </>
            }
        </Box>
    )
}

export default AuctionPage;