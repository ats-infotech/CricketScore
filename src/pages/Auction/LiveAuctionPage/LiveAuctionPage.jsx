'use client'
import SvgIcon from "@/assets/icons/SvgIcon"
import CustomeBack from "@/components/common/commonUi/CustomeBack"
import { Box, Button, Typography } from "@mui/material"
import Image from "next/image"
import './LiveAuctionPage.css'

const btnGroup = [
    { icon: 'random', name: 'Random' },
    { icon: 'bidding-up', name: 'Bid Up' },
    { icon: 'bidding-down', name: 'Bid Down' },
    { icon: 'manual', name: 'Manual' },
    { icon: 'sold', name: 'Sold' },
    { icon: 'unsold', name: 'Unsold' },
]

const LiveAuctionPage = () => {
    return (
        <Box className='live-auction'>
            <Box className='live-auction-header-main'>
                <CustomeBack />
                <Typography variant='h6' className="header-title">Auction</Typography>
                <SvgIcon id={'three-dot-menu'} className='menu_auction_icon' />
            </Box>
            <Box className='au-player-details'>
                <Box className='au-pl-img'>
                    <Image src={require('../../../assets/img/profiledummy.png')} alt="auction" unoptimized />
                </Box>
                <Box className='au-pl-details'>
                    <Typography variant='h6' className="auction-player">Rudra X</Typography>
                    <Box className='auction-bidding'>
                        <SvgIcon id='gold-coin' className='gold-coin' />
                        <Typography variant='h6' className="bidding-count">1100</Typography>
                        <SvgIcon id='edit' className='edit-icon' />
                    </Box>
                    <Typography variant='h6' className="auction-team-name">Team name</Typography>
                </Box>
            </Box>
            <Box className='auction-team'>
                {
                    Array(10).fill('').map((item, i) => {
                        return (
                            <Box className='team_card' key={i}>
                                <Box className='team-logo'>
                                    <Image src={require('../../../assets/img/teamdummy.jpeg')} alt="loggo" unoptimized />
                                </Box>
                                <Box className='team_details'>
                                    <Typography variant="h6">Team A</Typography>
                                    <Typography variant="h6">
                                        <SvgIcon id={'gold-coin'} />
                                        <span>100K/100K</span>
                                    </Typography>
                                    <Typography variant="h6">Max Bid : 80K</Typography>
                                </Box>
                            </Box>
                        )
                    })
                }
            </Box>
            <Box className='button-group'>
                {
                    btnGroup.map((item, i) => {
                        return (
                            <Button variant='contained' className='action-btn' key={i}>
                                <SvgIcon id={item?.icon} />
                                <span>{item?.name}</span>
                            </Button>
                        )
                    })
                }
            </Box>
        </Box>
    )
}

export default LiveAuctionPage