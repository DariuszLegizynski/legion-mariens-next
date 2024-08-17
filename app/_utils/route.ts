import { NextResponse } from "next/server"
import { loginUser } from "@/lib/strapi"

export async function POST(request) {
	const { identifier, password } = await request.json()

	const data = await loginUser(identifier, password)

	if (data) {
		// Create a new NextResponse object
		const response = NextResponse.json({ user: data.user })

		// Set the cookie
		response.cookies.set("jwt", data.jwt, {
			httpOnly: true, // Security measure to prevent client-side access
			secure: process.env.NODE_ENV === "production", // Only set cookie over HTTPS in production
			maxAge: 60 * 60 * 24 * 7, // 1 week
			path: "/",
		})

		return response
	} else {
		return NextResponse.json({ error: "Login failed" }, { status: 401 })
	}
}
