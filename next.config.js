/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  async redirects() {
    return [
      {
        source: '/category/:path*',
        destination: '/categories/:path*',
        permanent: true,
      },
    ];
  },
  images: {
    domains: [
      'media-ik.croma.com',
      'media.croma.com',
      'example.com',
      'placehold.co',
      'placekitten.com',
      'picsum.photos',
      'images.unsplash.com'
    ],
  },
};

module.exports = nextConfig;
