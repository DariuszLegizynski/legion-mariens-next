export async function getStrapiData(query: string) {
	try {
		const response = await fetch(`${process.env.API_URL}/api/${query}`)
		const data = await response.json()
		return data
	} catch (error) {
		throw new Error(`Fehler bei fetchen der Daten: ${error}`)
	}
}

export async function getStrapiAuthData(query: string, jwt: string) {
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

export async function postStrapiAuthData(query: string, data: any, jwt: string) {
	console.log({ query }, { data }, { jwt }, process.env.API_URL)
	try {
		console.log("before fetch")
		const response = await fetch(`${process.env.API_URL}/api/${query}`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${jwt}`,
			},
			body: JSON.stringify({ data }),
			cache: "no-cache",
		})

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
