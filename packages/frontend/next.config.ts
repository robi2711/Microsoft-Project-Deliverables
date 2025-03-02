import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	output: 'standalone',
	experimental: {
		// @ts-expect-error - outputFileTracingRoot exists but is not typed
		outputFileTracingRoot: undefined, // Includes all files
	}
}
export default nextConfig;
