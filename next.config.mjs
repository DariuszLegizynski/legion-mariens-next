/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: false,
	env: {
		API_URL: process.env.API_URL,
	},
	eslint: {
		ignoreDuringBuilds: true,
	},
	typescript: {
		// !! WARN !!
		// Dangerously allow production builds to successfully complete even if
		// your project has type errors.
		// !! WARN !!
		ignoreBuildErrors: true,
	},
	images: {
		remotePatterns: [
			{
				protocol: "http",
				hostname: "localhost",
				port: "1337",
				pathname: "/**",
			},
			{
				protocol: "http",
				hostname: "127.0.0.1",
				port: "1337",
				pathname: "/**",
			},
			{
				protocol: "http",
				hostname: "89.58.8.55",
				port: "7001",
				pathname: "/**",
			},
		],
	},
}

export default nextConfig

