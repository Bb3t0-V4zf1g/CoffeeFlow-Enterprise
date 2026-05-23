import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    transpilePackages: ["@coffeeflow/ui", "@coffeeflow/database"],
};

export default nextConfig;
