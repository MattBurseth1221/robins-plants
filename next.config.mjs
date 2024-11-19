/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  output: 'standalone',
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '*',
                port: '',
            },
            {
              protocol: 'http',
              hostname: 'http://localhost',
              port: '3000'
            }
        ]
    },
    env: {
        URL: process.env.URL
    }
};

export default nextConfig;
