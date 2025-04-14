import SvgIcon from "@/assets/icons/SvgIcon";
import { DateFormat } from "@/components/common/commomFunction";
import CustomeButton from "@/components/common/commonUi/CustomeButton";
import { Box, Typography } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import './AuctionPage.css';

const AuctionPage = ({ tournamentData }) => {
    const router = useRouter()
    const auctionState = useSelector(state => state?.auction)
    const auctionData = auctionState?.data
    const isAuctionCompleted = auctionState?.data && Object.keys(auctionState?.data).length > 0

    const handleScheduleAuction = () => {
        router.push(`/create-auction/${tournamentData?.id}`)
    }

    const handleUpdateAuction = () => {
        router.push(`/update-auction/${tournamentData?.id}`)
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
                                <SvgIcon id='auction-thor' />
                                <span>{`${auctionData?.auction_team_balance_point} PI/Team`}</span>
                            </Typography>
                        </Box>
                        <Typography className="icon-text">
                            <SvgIcon id='pound' />
                            <span>{`${auctionData?.auction_team_balance_point} Pts/Team`}</span>
                        </Typography>
                    </Box>
                   {!auctionState?.auction && <SvgIcon id='edit' className='menu-icon' onClick={handleUpdateAuction} />}
                </Box>
            }
            {isAuctionCompleted ?
                <Box className='auction_btn_row'>
                    <CustomeButton title={"Start Auction"} width={'50%'} height={'50px'} hover={'none'} bgColor={'var(--primary-color)'} />
                    <CustomeButton title={"View Auction"} width={'50%'} height={'50px'} hover={'none'} bgColor={'var(--primary-color)'} />
                </Box>
                :
                <CustomeButton
                    title={"Schedule Auction"}
                    width={'100%'}
                    height={'50px'}
                    hover={'none'}
                    bgColor={'transparent'}
                    color={'var(--primary-color)'}
                    border={'1px solid var(--primary-color)'}
                    onClick={handleScheduleAuction}
                />
            }
        </Box>
    )
}

export default AuctionPage;