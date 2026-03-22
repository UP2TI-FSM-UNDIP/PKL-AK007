/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: "/persuratan-keterangan-mhs",
  assetPrefix: "",
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
  experimental: { missingSuspenseWithCSRBailout: false },
  trailingSlash: true,
  async rewrites() {
    return {
      fallback: [
        {
          source: '/:path*',
          destination: 'http://10.137.58.124:20032/:path*',
        },
      ],
    };
  },
};

export default nextConfig;
