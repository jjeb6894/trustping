/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Remote listing/profile images come from arbitrary third-party sites,
    // so we allow any https host but keep optimization disabled on the
    // Cloudflare Pages edge runtime (next-on-pages does not support the
    // default Next.js image optimizer).
    unoptimized: true,
  },
};

module.exports = nextConfig;
