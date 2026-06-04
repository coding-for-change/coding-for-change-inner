import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    // Bundles the server + minimal node_modules into `.next/standalone` so the
    // Docker runner image can `node server.js` without a full install.
    output: 'standalone',
    // The prod Docker build gates on the TypeScript type-check (good), but we
    // don't want lint warnings to fail the build.
    eslint: { ignoreDuringBuilds: true },
};

export default nextConfig;
