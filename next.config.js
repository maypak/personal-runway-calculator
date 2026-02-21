/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // 타입 체크는 유지 (엄격하게)
    ignoreBuildErrors: false,
  },
};

module.exports = nextConfig;
