import { withPayload } from '@payloadcms/next/withPayload';

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost', 'localhost:80', 'localhost:8080'],
    },
  },
};

export default withPayload(nextConfig);
