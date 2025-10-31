/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: {
      allowedOrigins: process.env.NODE_ENV === "production" 
        ? [process.env.NEXTAUTH_URL?.replace(/^https?:\/\//, "") || "localhost:3000"]
        : ["localhost:3000"]
    }
  }
};

export default nextConfig;

