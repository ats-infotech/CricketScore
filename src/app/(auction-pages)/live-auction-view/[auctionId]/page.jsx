'use client'
import dynamic from 'next/dynamic';

const LiveAuctionPage = dynamic(
    () => import('@/pages/Auction/LiveAuctionPage/LiveAuctionPage'),
    // { ssr: false }
);

const LiveAuction = () => {
    return (
        <LiveAuctionPage type='user' />
    )
}

export default LiveAuction