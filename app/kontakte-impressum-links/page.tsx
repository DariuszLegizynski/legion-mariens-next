import { getStrapiData } from "@/app/_utils/services/getStrapiData"

const ContactsImpressumLinks = async () => {
	const data = await getStrapiData("spiritualitaet-maria?populate=*")
	const mariaContentData = data?.data?.attributes?.maria

	const archiveData = await getStrapiData("spiritualitaet-maria?populate[links][populate]=*")
	const archiveContentData = archiveData?.data?.attributes

	return <article className="my-24 mx-4 max-container">Im Bau</article>
}

export default ContactsImpressumLinks
