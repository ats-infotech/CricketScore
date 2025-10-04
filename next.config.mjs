/** @type {import('next').NextConfig} */

const nextConfig = {
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
        domains: ['cricketchampion.co.in','images.sportdevs.com', 'gcdnimages.entitysport.com'],
        formats: ['image/avif', 'image/webp'], // Modern image formats for faster loading
    },
    experimental: {
        optimizeCss: false,  // Reduce CSS size
        scrollRestoration: true, // Maintain scroll position on navigation
    },
    webpack: (config) => {
        config.module.rules.push({
            test: /\.(mp4|webm|ogg|ogv)$/,
            type: 'asset/resource',
            generator: {
                filename: 'static/videos/[name].[hash][ext]',
            },
        });
        return config;
    },
};

export default nextConfig;
