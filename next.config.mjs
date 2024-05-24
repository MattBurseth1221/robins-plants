/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '*',
                port: '',
            }
        ]
    },
    env: {
        URL: 'http://localhost:3000'
    }
};

export default nextConfig;
