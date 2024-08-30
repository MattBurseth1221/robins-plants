/** @type {import('next').NextConfig} */
const nextConfig = {
  // reactStrictMode: false,
  output: 'standalone',
    async rewrites() {
        return [
          {
            source: '/api/:path*',
            destination: 'https://storage.googleapis.com/:path*',
          },
        ]
      },
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
