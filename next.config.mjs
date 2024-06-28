/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  basePath: "/~flowchart",
  images: { unoptimized: true },
  distDir: "flowchart",
};

export default nextConfig;
