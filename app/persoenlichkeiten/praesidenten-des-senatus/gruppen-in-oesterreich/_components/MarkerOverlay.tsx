import Link from "next/link"

const MarkerOverlay = ({ presidium }: { presidium: any }) => {
	const { lat, lng } = presidium.location.coordinates
	return (
		<section className="bg-white rounded-xl pt-2">
			<h2 className="pb-2 min-w-64 text-wrap">{presidium.title}</h2>
			<div className="flex flex-col sm:flex-row gap-x-4">
				<p>
					<b>Pfarre: </b>
					{presidium.parish}
				</p>
				<p>
					<b>Diözese: </b>
					{presidium.diocese}
				</p>
			</div>
			<div className="flex flex-col text-wrap pt-2">
				<p>
					<b>Adresse: </b>
				</p>
				<p>{presidium.address}</p>
				<p>{presidium.city}</p>
			</div>
			<div className="pt-4">
				<h3 className="mb-2 pb-1 border-b border-primary">Treffen</h3>
				<p>
					<b>Wann: </b>
				</p>
				<p>
					{presidium.day} | {presidium.time} Uhr
				</p>

				<p>
					<b>Ansprechperson: </b>
				</p>
				<p>{presidium.contact_person}</p>
			</div>
			<div className="pt-4">
				<Link href={`http://maps.google.com/?ie=UTF8&hq=&${lat},${lng}&z=13`}>Auf Google Maps ansehen &rarr;</Link>
			</div>
		</section>
	)
}

export default MarkerOverlay
