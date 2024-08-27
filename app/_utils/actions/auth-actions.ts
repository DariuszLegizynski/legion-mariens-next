"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"

import { loginUserService } from "@/app/_utils/services/auth-services"
import { deleteStrapiAuthData, getStrapiAuthData } from "@/app/_utils/services/getStrapiData"

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

	cookies().set("jwt", responseData.jwt, config)
	redirect("/fuer-legionaere-mariens/products")
}

export const logoutAction = async () => {
	const jwt = cookies().get("jwt").value
	const { data } = await getStrapiAuthData(`user-carts?filters[session_id][$eq]=${jwt}&populate=*`, jwt)

	data.length > 0 &&
		data?.forEach(async cartItem => {
			await deleteStrapiAuthData("user-carts", jwt!, cartItem.id)
				.then(res => res)
				.catch(err => err)
		})
	cookies().set("jwt", "", { ...config, maxAge: -1 })
	redirect("/auth/login")
}
