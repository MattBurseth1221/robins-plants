/** @type {import('next').NextConfig} */
const nextConfig = {
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
            }
        ]
    },
    env: {
        URL: 'http://localhost:3000'
    }
};

export default nextConfig;
