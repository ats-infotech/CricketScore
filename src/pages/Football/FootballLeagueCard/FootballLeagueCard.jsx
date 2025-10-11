'use client'
import { Box, Typography, IconButton } from "@mui/material"
import { useSelector } from "react-redux"
import './FootballLeagueCard.css'
import Image from "next/image"
import SvgIcon from "@/assets/icons/SvgIcon"
import Slider from "react-slick"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"


// Custom Arrows
const NextArrow = ({ onClick }) => (
    <div className="custom-arrow-wrapper next-arrow">
        <IconButton className="custom-arrow" onClick={onClick}>
            <SvgIcon id="down-arrow" />
        </IconButton>
    </div>
);

const PrevArrow = ({ onClick }) => (
    <div className="custom-arrow-wrapper prev-arrow">
        <IconButton className="custom-arrow" onClick={onClick}>
            <SvgIcon id="down-arrow" />
        </IconButton>
    </div>
);


const FootballLeagueCard = () => {
    const { premiumLeaguesData, englandAndFranceLeaguesData } = useSelector(state => state.footballData)
    const [data, setData] = useState([])
    const router = useRouter()

    useEffect(() => {
        if (premiumLeaguesData || englandAndFranceLeaguesData) {
            setData([
                ...(premiumLeaguesData?.result || []),
                ...(englandAndFranceLeaguesData || [])
            ])
        }
    }, [premiumLeaguesData, englandAndFranceLeaguesData])

    const sliderSettings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 2,
        slidesToScroll: 2,
        arrows: true,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
        responsive: [
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                }
            }
        ]
    }

    return (
        <Box className='football-league-cards-section'>
            <Slider {...sliderSettings} className="football-league-slider">
                {data?.length > 0 && data?.map((items, i) => {
                    return (
                        <Box key={i} className='football-league-slide'>
                            <Box className='football-league-cards'>
                                <Image
                                    src={items?.league_logo || 'https://apiv3.apifootball.com/badges/logo_country/2_intl.png'}
                                    height={110}
                                    width={110}
                                    alt="logo"
                                />
                                <Box className='football-league-card-league-info' onClick={() => { router.push(`/football/${items?.league_key ? items?.league_key : items?.league_id}`) }} >
                                    <Image
                                        src={items?.country_logo || 'https://apiv3.apifootball.com/badges/logo_country/2_intl.png'}
                                        height={110}
                                        width={110}
                                        alt="country flag"
                                    />
                                    <Typography variant="body2">
                                        {items?.league_name}
                                    </Typography>
                                    <SvgIcon id={'keyboard-right'} />
                                </Box>
                            </Box>
                        </Box>
                    )
                })}
            </Slider>
        </Box>
    )
}

export default FootballLeagueCard;
