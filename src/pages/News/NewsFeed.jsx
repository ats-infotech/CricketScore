'use client'
import SvgIcon from "@/assets/icons/SvgIcon"
import { Box, Button, Typography } from "@mui/material"
import { useRef, useState } from "react"
import './NewsFeed.css'
import Menubar from "@/components/common/commonUi/Menubar/Menubar"
import { newsFeed } from '@/components/common/newsFeed'
import Image from "next/image"

const VideoPlayer = ({ items, index, playingIndex, setPlayingIndex, videoRefs }) => {
    const videoRef = useRef(null);
    videoRefs.current[index] = videoRef;
    const isPlaying = playingIndex === index;

    const togglePlayPause = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
                setPlayingIndex(null);
            } else {
                if (playingIndex !== null && videoRefs.current[playingIndex]) {
                    videoRefs.current[playingIndex].current.pause();
                }
                setPlayingIndex(index);
                videoRef.current.play();
            }
        }
    };

    return (
        <Box sx={{ position: "relative", width: '100%', height: '100%' }}>
            <video
                ref={videoRef}
                poster={
                    items.title === "Festival Poster"
                        ? "/videos/news/festivalposter_poster.png"
                        : items?.title === "ImagetoText"
                            ? "/videos/news/Imageto_text_poster.png"
                            : "/videos/news/news_sphere_poster.png"
                }
                width="100%"
                height="100%"
                onClick={togglePlayPause}
                onPause={() => setPlayingIndex(null)}
                onPlay={() => setPlayingIndex(index)}
                style={{ objectFit: "cover" }}
            >
                <source
                    src={
                        items.title === "Festival Poster"
                            ? "/videos/news/festival_poster_video.mp4"
                            : items?.title === "ImagetoText"
                                ? "/videos/news/imageTotext_video.mp4"
                                : "/videos/news/NewsApp_video.mp4"
                    }
                    type="video/mp4"
                />
                Your browser does not support the video tag.
            </video>
            {!isPlaying && (
                <Box className="play-button" onClick={togglePlayPause}>
                    <SvgIcon id="play-icon" sx={{ color: "#fff", fontSize: 32 }} />
                </Box>
            )}
        </Box>
    );
};

const NewsFeed = () => {
    const [openDrawer, setOpenDrawer] = useState(false)
    const [playingIndex, setPlayingIndex] = useState(null);
    const videoRefs = useRef([]);
    const handleOpen = () => setOpenDrawer(true)
    const handleClose = () => setOpenDrawer(false)

    return (
        <Box className="news_feed_main_section">
            {/* <Box className='news_feed_menu'>
                <SvgIcon id='three-line-menu' onClick={handleOpen} />
                <Box className='notificationBox'>
                    <SvgIcon id='notification' />
                </Box>
            </Box> */}
            <Menubar open={openDrawer} handleClose={handleClose} />

            <Box className="news_feed_section">
                {
                    newsFeed.length > 0 && newsFeed.map((items, i) => {
                        return (
                            <Box key={i} className="news_feed_sub_section" sx={{ flexDirection: i % 2 !== 0 ? 'row-reverse' : 'row' }}>
                                <Box className="news_feed_info_section" sx={{ padding: i % 2 !== 0 ? '10px 15px' : '10px 15px 10px 20px' }}>
                                    <Box className="news_feed_app_title">
                                        <Box className="news_feed_app_info_image">
                                            <Image unoptimized src={items.image} height={50} width={50} alt="logo" />
                                        </Box>
                                        <Typography variant="body2" sx={{ background: items.titleColor }}>{items.title}</Typography>
                                    </Box>
                                    <Typography variant="body2" sx={{ color: items.descriptionColor }}>{items.description}</Typography>
                                    {items.subdescription && <Typography variant="body2" sx={{ color: items.subdescriptionColor }}>{items.subdescription}</Typography>}
                                    <Button onClick={() => window.open(items.buttonLink, '_blank')} sx={{ background: items.buttonColor }} className="news_feed_button">{items.buttonText}</Button>
                                </Box>
                                <Box className="news_feed_video_section" sx={{ position: "relative" }}>
                                    <VideoPlayer
                                        key={i}
                                        items={items}
                                        index={i}
                                        playingIndex={playingIndex}
                                        setPlayingIndex={setPlayingIndex}
                                        videoRefs={videoRefs}
                                    />
                                </Box>
                            </Box>
                        )
                    })
                }
            </Box>
        </Box>
    )
}

export default NewsFeed