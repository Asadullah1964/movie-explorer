/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // TMDB images
      { protocol: 'https', hostname: 'image.tmdb.org', pathname: '/t/p/**' },
      // YouTube thumbnails
      { protocol: 'https', hostname: 'i.ytimg.com', pathname: '/vi/**' },
      // Optional: YouTube static variants
      { protocol: 'https', hostname: 'img.youtube.com', pathname: '/vi/**' },
    ],
  },
};

module.exports = nextConfig;
