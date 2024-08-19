"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"

import { loginUserService } from "@/app/_utils/services/auth-services"

const config = {
	maxAge: 60 * 60 * 24 * 7, // 1 week
	path: "/",
	domain: process.env.HOST ?? "localhost",
	httpOnly: true,
	secure: process.env.NODE_ENV === "production",
}

export const loginUserAction = async (prevState: any, formData: FormData) => {
	const fields = {
		identifier: formData.get("identifier"),
		password: formData.get("password"),
	}

	const responseData = await loginUserService(fields)

	if (!responseData) {
		return {
			...prevState,
			strapiErrors: responseData.error,
			message: "Fehler beim verbinden mit der Datenbank.",
		}
	}

	if (responseData.error) {
		return {
			...prevState,
			strapiErrors: responseData.error,
			message: "Login versuch fehlgeschlagen.",
		}
	}

	cookies().set("jwt", responseData.jwt)
	redirect("/fuer-legionaere-mariens/products")
}

export async function logoutAction() {
	cookies().set("jwt", "", { ...config, maxAge: 0 })
	redirect("/auth/login")
}
