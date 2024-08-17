export const loginUser = async (identifier: string, password: string) => {
	try {
		const response = await fetch(`${process.env.API_URL}/api/auth/local`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				identifier,
				password,
			}),
		})

		if (!response.ok) {
			throw new Error("Login failed")
		}

		const data = await response.json()
		return data
	} catch (error) {
		console.error("Error:", error)
		return null
	}
}
