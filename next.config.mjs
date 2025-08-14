/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "cdn-useast1.kapwing.com",
      },
      {
        protocol: "https",
        hostname: "richskxn.co.uk",
      },
      {
        protocol: "https",
        hostname: "www.hi.edu",
      },
      {
        protocol: "https",
        hostname: "*.googleusercontent.com",
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "www.patanjaliayurved.net",
      },
      {
        protocol: "https",
        hostname: "images.pexels.com",
      },
      {
        protocol: "https",
        hostname: "images.everydayhealth.com",
      },
      {
        protocol: "https",
        hostname: "img.bebeautiful.in",
      },
      {
        protocol: "https",
        hostname: "drive.google.com",
      },
      {
        protocol: "https",
        hostname: "cdna.artstation.com",
      },
      {
        protocol: "https",
        hostname: "cdnb.artstation.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com", // ✅ For Google OAuth profile images
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com", // ✅ For GitHub profile images
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "platform-lookaside.fbsbx.com", // ✅ For Facebook profile images
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
