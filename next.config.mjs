/** @type {import('next').NextConfig} */
const nextConfig = {
  // reactStrictMode: false,
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
        URL: process.env.URL
    },
    future: { webpack5: true }
};

export default nextConfig;
