const Links = ({ title, links }) => {
	return (
		<section className="mb-24">
			<h3>{title}</h3>
			<ul>
				{links.map(link => (
					<li className="my-4" key={link.id}>
						<a className="text-primary hover:text-accent transition-colors duration-300" href={`${process.env.API_URL}${link.pdf.data.attributes.url}`}>
							{link.name}
						</a>
					</li>
				))}
			</ul>
		</section>
	)
}

export default Links
