/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Static export
  images: {
    unoptimized: true // Static에서 이미지 최적화 불가
  },
  trailingSlash: true, // /dashboard/ (서버 없으니 필요)
  typescript: {
    // 타입 체크는 유지 (엄격하게)
    ignoreBuildErrors: false,
  },
};

module.exports = nextConfig;
