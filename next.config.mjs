/** @type {import('next').NextConfig} */
// import withTM from 'next-transpile-modules';

// const withTranspile = withTM(['@mui/x-date-pickers', '@mui/material']);

const nextConfig = {
// const nextConfig = withTranspile ({
    reactStrictMode: false,
    onDemandEntries: {
        maxInactiveAge: 60 * 1000, // Keep entries longer
        pagesBufferLength: 5, // Less aggressive refresh
    },
    devIndicators: {
        appIsrStatus: false,
    },
    compress: true,         // Enables Gzip compression
    output: 'standalone',   // Makes app more independent for deployment
    images: {
        formats: ['image/avif', 'image/webp'], // Modern image formats for faster loading
    },
    experimental: {
        optimizeCss: true,  // Reduce CSS size
        scrollRestoration: true, // Maintain scroll position on navigation
    },
};

export default nextConfig;
