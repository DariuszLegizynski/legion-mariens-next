export async function getStrapiData(query: string) {
	try {
		const response = await fetch(`${process.env.API_URL}/api/${query}`)
		const data = await response.json()
		return data
	} catch (error) {
		throw new Error(`Fehler bei fetchen der Daten: ${error}`)
	}
}
