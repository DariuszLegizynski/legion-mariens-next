export const getStrapiData = async (query: string) => {
	try {
		const response = await fetch(`${process.env.API_URL}/api/${query}`)
		const data = await response.json()
		return data
	} catch (error) {
		throw new Error(`Fehler bei fetchen der Daten: ${error}`)
	}
}

export const getStrapiAuthData = async (query: string, jwt: string) => {
	try {
		const response = await fetch(`${process.env.API_URL}/api/${query}`, {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${jwt}`,
			},
		})
		const result = await response.json()
		return result
	} catch (error) {
		throw new Error(`Fehler bei fetchen der Daten: ${error}`)
	}
}

export const createStrapiAuthData = async (query: string, data: any, jwt: string) => {
	try {
		const response = await fetch(`${process.env.API_URL}/api/${query}`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${jwt}`,
			},
			body: JSON.stringify(data),
			cache: "no-cache",
		})
		console.log({ response })
		if (!response.ok) {
			const errorText = await response.text()
			console.error("Response error:", errorText)
			throw new Error(`HTTP error! status: ${response.status}`)
		}
		const result = await response.json()
		return result
	} catch (error) {
		throw new Error(`Fehler bei fetchen der Daten: ${error}`)
	}
}

export const updateStrapiAuthData = async (query: string, data: any, jwt: string) => {
	try {
		const response = await fetch(`${process.env.API_URL}/api/${query}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${jwt}`,
			},
			body: JSON.stringify(data),
			cache: "no-cache",
		})
		const result = await response.json()

		return result
	} catch (error) {
		throw new Error(`Fehler bei fetchen der Daten: ${error}`)
	}
}

export const deleteStrapiAuthData = async (query: string, jwt: string, productId: number) => {
	try {
		const response = await fetch(`${process.env.API_URL}/api/${query}/${productId}`, {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${jwt}`,
			},
		})
		const result = await response.json()

		return result
	} catch (error) {
		throw new Error(`Fehler bei fetchen der Daten: ${error}`)
	}
}
