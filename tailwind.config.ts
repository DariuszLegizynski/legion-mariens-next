import { nextui } from "@nextui-org/theme"
import type { Config } from "tailwindcss"

const config: Config = {
	content: [
		"./pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
		"./node_modules/@nextui-org/theme/dist/components/(select|listbox|divider|popover|button|ripple|spinner|scroll-shadow).js",
	],
	theme: {
		extend: {
			colors: {
				primary: "hsl(227, 46%, 44%)",
				"primary-light": "hsl(227, 46%, 64%)",
				green: "#A4CC78",
				"green-dark": "#78CC84",
				accent: "hsl(339, 84%, 43%)",
				black: "hsl(210, 11%, 15%)",
				white: "hsl(5, 0%, 100%)",
				blue: "#3C52A3",
				grey: "hsl(0, 0%, 74%)",
				"grey-dark": "hsl(0, 0%, 20%)",
				"grey-light": "#E2E2E2",
			},
			screens: {
				xxs: "375px",
				xs: "425px",
				"2xl": "1440px",
				"3xl": "1920px",
			},
		},
	},
	plugins: [nextui()],
}
export default config
