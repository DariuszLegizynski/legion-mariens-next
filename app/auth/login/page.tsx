"use client"

import { useFormState, useFormStatus } from "react-dom"
import { loginUserAction } from "@/app/_utils/actions/auth-actions"

import { useEffect, useState } from "react"

import BaseButton from "@/components/base/BaseButton"

const initialState = {
	strapiErrors: null,
	data: null,
	message: null,
}

const login = () => {
	const [formState, formAction] = useFormState(loginUserAction, initialState)

	const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)

	useEffect(() => {
		const allCookies = document.cookie
		const jwtCookie = allCookies.split("; ").find(row => row.startsWith("jwt="))

		if (jwtCookie) {
			setIsAuthenticated(jwtCookie.split("=")[1] ? true : false)
		}
	}, [])

	console.log({ isAuthenticated })

	return (
		<article className="my-20 mx-8 flex flex-col items-center">
			<div className={`text-left mb-8 ${isAuthenticated ? "h2" : "h3"}`}>{isAuthenticated ? "Legionsleben" : "Anmelden (Geschützte Seite)"}</div>
			{!isAuthenticated && (
				<section>
					<form action={formAction} className="flex flex-col items-center gap-y-4 w-full">
						<div className="flex flex-col items-start gap-y-2 w-full">
							<label htmlFor="identifier">Benutzername:</label>
							<input id="user" name="identifier" required />
						</div>
						<div className="flex flex-col items-start gap-y-2 w-full">
							<label htmlFor="password">Passwort:</label>
							<input type="password" id="password" name="password" required />
						</div>
						<BaseButton isDisabled={useFormStatus.pending} buttonType="submit" text="Anmelden" />
					</form>
				</section>
			)}
			{isAuthenticated ? (
				<p>Wählen Sie aus den Unterpunkten des Menü</p>
			) : (
				<section className="text-center mt-8">{formState?.strapiErrors && <p style={{ color: "red" }}>{formState?.strapiErrors}</p>}</section>
			)}
		</article>
	)
}

export default login
