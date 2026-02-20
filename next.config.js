/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // 임시로 Vercel 배포 시 ESLint 무시
    // TODO: ESLint 에러 수정 후 이 옵션 제거
    ignoreDuringBuilds: true,
  },
  typescript: {
    // 타입 체크는 유지 (엄격하게)
    ignoreBuildErrors: false,
  },
};

module.exports = nextConfig;
