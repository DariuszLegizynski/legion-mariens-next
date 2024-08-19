import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getUserMeLoader } from "@/app/_utils/services/getUserMeLoader"

export async function middleware(request: NextRequest) {
	const user = await getUserMeLoader()
	const currentPath = request.nextUrl.pathname

	if (currentPath.startsWith("/fuer-legionaere-mariens") && user.ok === false) {
		return NextResponse.redirect(new URL("/auth/login", request.url))
	}

	return NextResponse.next()
}
